import { useEffect, useState } from "react";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Fillter from "./components/CardFilter";
import CardTable from "./components/CardTable";
import cardApi from "../../api/cardAPI";
import { buildParams } from "helpers/card";
import { TYPE_ATTRIBUTES, CARD_TYPES } from "config/card";
import CardDeck from "./components/CardDeck";

function Cards() {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Fillter filter={filter} setFilter={setFilter} optionsCategory={CARD_TYPES} optionsAttribute={TYPE_ATTRIBUTES} />
      <MDBox sx={{ display: "flex", gap: 2, height: "100vh", mb: 4 }}>
        <MDBox sx={{ flex: "0 0 75%", height: "100%" }}>
          <CardDeck></CardDeck>
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
