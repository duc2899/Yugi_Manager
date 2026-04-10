import { useEffect, useState } from "react";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Fillter from "./components/CardFilter";
import CardTable from "./components/CardTable";
import cardApi from "../../api/cardAPI";
import { buildParams, validateMainDeck, validateExtraDeck, validateSideDeck } from "helpers/card";
import { TYPE_ATTRIBUTES, CARD_TYPES } from "config/card";
import Zone from "./components/Zone";
import { CARD_TYPE } from "config/card";
import { DECK_LIMIT } from "config/card";
import { removeCardFromDeck } from "helpers/card";
import { addCardToDeck } from "helpers/card";
import CardImage from "./components/CardImage";
import { countCardInAllDeck } from "helpers/card";

function Cards() {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
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
  });

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
        (toZone === "MAIN" && validateMainDeck(card, newDeck)) ||
        (toZone === "EXTRA" && validateExtraDeck(card, newDeck)) ||
        (toZone === "SIDE" && validateSideDeck(card, newDeck));

      if (!ok) return prev;

      // ===== CHECK LIMIT ONLY WHEN ADD FROM POOL =====
      if (card.source === "POOL") {
        const totalCopies = countCardInAllDeck(newDeck, card._id);

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Fillter filter={filter} setFilter={setFilter} optionsCategory={CARD_TYPES} optionsAttribute={TYPE_ATTRIBUTES} />
      <MDBox sx={{ display: "flex", gap: 2, height: "100vh", mb: 4 }}>
        <MDBox sx={{ flex: "0 0 75%", height: "100%" }}>
          <Zone
            title="Main Deck"
            cards={deck.mainDeck}
            onDropCard={(card) => handleDropCard(card, "MAIN")}
            renderCard={(card) => (
              <div
                onDragStart={(e) => handleDragStartFromDeck(e, card, "MAIN")}
              >
                <CardImage card={card} width={55} showStatus={false} />
              </div>
            )}
            validateDrop={(card) => validateMainDeck(card, deck)}
            allowTypes={[CARD_TYPE.MONSTER, CARD_TYPE.SPELL, CARD_TYPE.TRAP]}
            deckLimit={DECK_LIMIT.MAIN}
          />
          <Zone
            title="Extra Deck"
            cards={deck.extraDeck}
            onDropCard={(card) => handleDropCard(card, "EXTRA")}
            renderCard={(card) => (
              <div
                onDragStart={(e) => handleDragStartFromDeck(e, card, "EXTRA")}
              >
                <CardImage card={card} width={55} showStatus={false} />
              </div>
            )}
            validateDrop={(card) => validateExtraDeck(card, deck)}
            allowTypes={["FUSION", "SYNCHRO", "XYZ", "LINK"]}
            deckLimit={DECK_LIMIT.EXTRA}
          />
          <Zone
            title="Side Deck"
            cards={deck.sideDeck}
            onDropCard={(card) => handleDropCard(card, "SIDE")}
            renderCard={(card) => (
              <div
                onDragStart={(e) => handleDragStartFromDeck(e, card, "SIDE")}
              >
                <CardImage card={card} width={55} showStatus={false} />
              </div>
            )}
            validateDrop={(card) => validateSideDeck(card, deck)}
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
          />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Cards;
