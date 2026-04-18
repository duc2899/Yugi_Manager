import { useEffect, useState } from "react";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Fillter from "./components/CardFilter";
import CardTable from "./components/CardTable";
import cardApi from "../../api/cardAPI";
import Zone from "./components/Zone";
import { CARD_TYPE } from "config/card";
import { DECK_LIMIT } from "config/card";
import CardImage from "./components/CardImage";
import { useAlert } from "context/AlertContext";
import { removeCardFromDeck } from "helpers/card";
import { validateDeck } from "helpers/card";
import { addCardToDeck } from "helpers/card";
import { countCardInAllDeck } from "helpers/card";
import { buildParams } from "helpers/card";
import { useApi } from "hooks/useApi";
import adminAPI from "api/adminAPI";

function Cards() {
  const { showAlert } = useAlert();
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectDeck, setSelectDeck] = useState("")

  const [deck, setDeck] = useState({
    mainDeck: [],
    extraDeck: [],
    sideDeck: [],
  });

  const [filter, setFilter] = useState({
    monsterType: null,
    monsterCategory: null,
    category: null,
    monsterAttribute: null,
    lte: null,
    gte: null,
    spellType: null,
    trapType: null,
    atk: null,
    def: null,
    name: null,
    cardLimitStatus: null,
  });

  console.log(deck);


  const fetchCards = async (pageNumber = 1, isReset = false) => {
    if (loading) return;

    try {
      setLoading(true);

      const params = buildParams(pageNumber, filter);

      const res = await cardApi.searchCard(params);
      const newCards = res.data.data;

      if (isReset) {
        setCards(newCards);
      } else {
        setCards((prev) => [...prev, ...newCards]);
      }

      setHasMore(newCards.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const { data: dataDetailDeck } = useApi(() => adminAPI.getDetailDeck(selectDeck), [selectDeck], {
    auto: !!selectDeck,
    defaultData: [],
  });

  useEffect(() => {
    if (!dataDetailDeck.data?._id) return;

    setDeck({
      mainDeck: Array.isArray(dataDetailDeck.data.mainDeckCards)
        ? dataDetailDeck.data.mainDeckCards
        : [],
      extraDeck: Array.isArray(dataDetailDeck.data.extraDeckCards)
        ? dataDetailDeck.data.extraDeckCards
        : [],
      sideDeck: Array.isArray(dataDetailDeck.data.sideDeckCards)
        ? dataDetailDeck.data.sideDeckCards
        : [],
    });
  }, [dataDetailDeck]);



  // khi filter/search thay đổi → reset
  useEffect(() => {
    setCards([]);
    fetchCards(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // load more
  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCards(nextPage);
  };

  const handleDragStartFromDeck = (e, card, fromDeck) => {
    console.log(card);
    console.log(fromDeck);
    
    
    const payload = {
      ...card,
      source: fromDeck, // "MAIN" | "EXTRA" | "SIDE"
    };

    e.dataTransfer.setData("card", JSON.stringify(payload));
  };

  const handleDropCard = (card, toZone) => {
    setDeck((prev) => {
      // drop vào chính deck => ignore
      if (card.source === toZone) return prev;

      const newDeck = {
        mainDeck: [...prev.mainDeck],
        extraDeck: [...prev.extraDeck],
        sideDeck: [...prev.sideDeck],
      };

      // ====== DROP VÀO POOL => remove khỏi deck ======
      if (toZone === "POOL" && card.source !== "POOL") {
        removeCardFromDeck(newDeck, card._id, card.source);
        return newDeck;
      }

      // ====== DROP VÀO DECK ======
      // check rule trước (validateDrop)
      const ok =
        (toZone === "MAIN" && validateDeck(card, newDeck, "MAIN")) ||
        (toZone === "EXTRA" && validateDeck(card, newDeck, "EXTRA")) ||
        (toZone === "SIDE" && validateDeck(card, newDeck, "SIDE"));

      if (!ok) return prev;

      // ===== CHECK LIMIT ONLY WHEN ADD FROM POOL =====
      if (card.source === "POOL") {
        const totalCopies = countCardInAllDeck(newDeck, card.name);

        if (card.cardLimitStatus === 0) {
          alert("Lá bài này đã bị BAN!");
          return prev;
        }

        if (totalCopies >= card.cardLimitStatus) {
          alert(`Lá bài này chỉ được tối đa ${card.cardLimitStatus} bản trong toàn bộ deck!`);
          return prev;
        }
      }

      // nếu kéo từ deck khác -> remove khỏi deck cũ
      if (card.source !== "POOL") {
        removeCardFromDeck(newDeck, card._id, card.source);
      }

      // add vào deck mới
      addCardToDeck(newDeck, card, toZone);

      return newDeck;
    });
  };

  const handeleSetStatus = async (code, status) => {
    try {
      await cardApi.setCardStatus({
        code,
        status
      });
      showAlert("Cập nhật trạng thái lá bài thành công", "success");
      // update local state
      setCards((prev) => prev.map((card) => (card.code === code ? { ...card, cardLimitStatus: status } : card)));
    } catch (error) {
      showAlert(error.message, "error")
    }

  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Fillter filter={filter} setFilter={setFilter} setSelectDeck={setSelectDeck} />
      <MDBox sx={{ display: "flex", gap: 2, height: "100vh", mb: 4 }}>
        <MDBox sx={{ flex: "0 0 75%", height: "100%" }}>
          <Zone
            title="Main Deck"
            cards={deck.mainDeck}
            onDropCard={(card) => handleDropCard(card, "MAIN")}
            renderCard={(card) => (
              <div
                style={{ position: "relative", width: "55px" }}
                onDragStart={(e) => handleDragStartFromDeck(e, card, "MAIN")}
              >
                <CardImage card={card} width={55} showStatus={false} />

                {/* Quantity */}
                {card.number > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      right: "3px",
                      background: "rgba(0,0,0,0.75)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "1px 5px",
                      borderRadius: "6px",
                      lineHeight: 1.2,
                    }}
                  >
                    x{card.number}
                  </div>
                )}
              </div>
            )}
            validateDrop={(card) => validateDeck(card, deck, "MAIN")}
            allowTypes={[CARD_TYPE.MONSTER, CARD_TYPE.SPELL, CARD_TYPE.TRAP]}
            deckLimit={DECK_LIMIT.MAIN}
          />
          <Zone
            title="Extra Deck"
            cards={deck.extraDeck}
            onDropCard={(card) => handleDropCard(card, "EXTRA")}
            renderCard={(card) => (
              <div
                style={{ position: "relative", width: "55px" }}
                draggable
                onDragStart={(e) => handleDragStartFromDeck(e, card, "EXTRA")}
              >
                <CardImage card={card} width={55} showStatus={false} />

                {/* Quantity */}
                {card.number > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      right: "3px",
                      background: "rgba(0,0,0,0.75)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "1px 5px",
                      borderRadius: "6px",
                      lineHeight: 1.2,
                    }}
                  >
                    x{card.number}
                  </div>
                )}
              </div>
            )}
            validateDrop={(card) => validateDeck(card, deck, "EXTRA")}
            allowTypes={["FUSION", "SYNCHRO", "XYZ", "LINK"]}
            deckLimit={DECK_LIMIT.EXTRA}
          />
          <Zone
            title="Side Deck"
            cards={deck.sideDeck}
            onDropCard={(card) => handleDropCard(card, "SIDE")}
            renderCard={(card) => (
              <div
                style={{ position: "relative", width: "55px" }}
                onDragStart={(e) => handleDragStartFromDeck(e, card, "SIDE")}
              >
                <CardImage card={card} width={55} showStatus={false} />

                {/* Quantity */}
                {card.number > 1 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      right: "3px",
                      background: "rgba(0,0,0,0.75)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "1px 5px",
                      borderRadius: "6px",
                      lineHeight: 1.2,
                    }}
                  >
                    x{card.number}
                  </div>
                )}
              </div>
            )}
            validateDrop={(card) => validateDeck(card, deck, "SIDE")}
            allowTypes={[CARD_TYPE.MONSTER, CARD_TYPE.SPELL, CARD_TYPE.TRAP]}
            deckLimit={DECK_LIMIT.SIDE}
          />
        </MDBox>
        <MDBox sx={{ flex: "0 0 25%", maxHeight: "100%" }}>
          <CardTable
            cards={cards}
            loading={loading}
            hasMore={hasMore}
            onDropCard={(card) => handleDropCard(card, "POOL")}
            onLoadMore={handleLoadMore}
            handeleSetStatus={handeleSetStatus}
          />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Cards;
