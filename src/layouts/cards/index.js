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
import { URL_IMAGE } from "config/constant";
import { CARD_TYPE } from "config/card";
import { DECK_LIMIT } from "config/card";

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

  const handleDropToDeck = (deckType) => (cardId) => {
    setDeck((prev) => ({
      ...prev,
      [deckType]: [...prev[deckType], cardId]
    }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Fillter filter={filter} setFilter={setFilter} optionsCategory={CARD_TYPES} optionsAttribute={TYPE_ATTRIBUTES} />
      <MDBox sx={{ display: "flex", gap: 2, height: "100vh", mb: 4 }}>
        <MDBox sx={{ flex: "0 0 75%", height: "100%" }}>
          <Zone title="Main Deck"
            cards={deck.mainDeck}
            onDropCard={handleDropToDeck('mainDeck')}
            renderCard={(cardId) => (
              <img
                src={`${URL_IMAGE}${cardId}.jpg`}
                style={{ width: "55px", borderRadius: "6px" }}
                alt="card"
              />
            )}
            validateDrop={(card) => validateMainDeck(card, deck)}
            allowTypes={[CARD_TYPE.MONSTER, CARD_TYPE.SPELL, CARD_TYPE.TRAP]}
            deckLimit={DECK_LIMIT.MAIN}
          />
          <Zone title="Extra Deck"
            cards={deck.extraDeck}
            onDropCard={handleDropToDeck('extraDeck')}
            renderCard={(cardId) => (
              <img
                src={`${URL_IMAGE}${cardId}.jpg`}
                style={{ width: "55px", borderRadius: "6px" }}
                alt="card"
              />
            )}
            validateDrop={(card) => validateExtraDeck(card, deck)}
            allowTypes={["FUSION", "SYNCHRO", "XYZ", "LINK"]}
            deckLimit={DECK_LIMIT.EXTRA}
          />
          <Zone title="Side Deck"
            cards={deck.sideDeck}
            onDropCard={handleDropToDeck('sideDeck')}
            renderCard={(cardId) => (
              <img
                src={`${URL_IMAGE}${cardId}.jpg`}
                style={{ width: "55px", borderRadius: "6px" }}
                alt="card"
              />
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
            onLoadMore={handleLoadMore}
          />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Cards;
