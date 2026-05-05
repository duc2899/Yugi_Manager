import { useEffect, useMemo, useRef, useState } from "react";
import MDBox from "components/MDBox";
import { useMutation } from "@tanstack/react-query";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Fillter from "./components/CardFilter";
import CardTable from "./components/CardTable";
import cardApi from "../../api/cardAPI";
import { useAlert } from 'hooks/useAlert';
import { buildDeckPayload, normalizeDeck, removeCardFromDeck, updateDeckOption } from "helpers/card";
import { validateDeck } from "helpers/card";
import { addCardToDeck } from "helpers/card";
import { countCardInAllDeck } from "helpers/card";
import { buildParams } from "helpers/card";
import { useApi } from "hooks/useApi";
import adminAPI from "api/adminAPI";
import ModalDeck from "./components/ModalDeck";
import DeckZones from "./components/DeckZone";

const Cards = () => {
  const initialDeckRef = useRef(null);        // restore
  const rowRef = useRef(null);
  const [rowHeight, setRowHeight] = useState("100vh");



  const { showAlert } = useAlert();
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [modalDeck, setModalDeck] = useState({
    isOpen: false,
    type: "EDIT" | "CREATE" | "EMPTY",
    data: {
      type: "",
      name: ""
    }
  })
  const [deck, setDeck] = useState({
    mainDeckCards: [],
    extraDeckCards: [],
    sideDeckCards: [],
    id: "",
    name: "",
    type: "",
    isLocal: true
  });
  const [snapshotHash, setSnapshotHash] = useState("");
  const [localDecks, setLocalDecks] = useState([]);
  const [selectedDeckId, setSelectedDeckId] = useState("");

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

  const { data: dataDeck, setData: setDataDeck } = useApi(adminAPI.getAllDeck, [], {
    auto: true,
    defaultData: [],
  });

  const deckOptions = useMemo(() => {
    const serverDecks = dataDeck?.data || [];
    return [...localDecks, ...serverDecks];
  }, [localDecks, dataDeck]);

  const { loading, refetch: fetchCardsApi } = useApi(cardApi.searchCard, [filter], {
    auto: false,
    defaultData: [],
  });

  const fetchCards = async (pageNumber = 1, isReset = false) => {
    const params = buildParams(pageNumber, filter);

    const res = await fetchCardsApi(params);
    const newCards = res.data.data;

    setCards((prev) => (isReset ? newCards : [...prev, ...newCards]));
    setHasMore(newCards.length > 0);
  };

  useEffect(() => {
    if (!rowRef.current) return;
    const top = rowRef.current.getBoundingClientRect().top + 10;
    setRowHeight(`calc(100vh - ${top}px)`);
  }, []);

  useEffect(() => {
    setCards([]);
    setPage(1);
    fetchCards(1, true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const { data: dataDetailDeck } = useApi(
    () => adminAPI.getDetailDeck(selectedDeckId),
    [selectedDeckId],
    {
      auto: selectedDeckId && !String(selectedDeckId).startsWith("LOCAL_"),
      defaultData: [],
    }
  );

  // CALL POST API
  const createDeckMutation = useMutation({
    mutationFn: adminAPI.createDeck,
  });

  const updateDeckMutation = useMutation({
    mutationFn: adminAPI.updateDeck,
  });

  const updateStatusMutation = useMutation({
    mutationFn: cardApi.setCardStatus,
  });

  useEffect(() => {
    if (!dataDetailDeck?.data?._id) return;

    const newDeck = {
      mainDeckCards: dataDetailDeck.data.mainDeckCards || [],
      extraDeckCards: dataDetailDeck.data.extraDeckCards || [],
      sideDeckCards: dataDetailDeck.data.sideDeckCards || [],
      name: dataDetailDeck.data.name,
      type: dataDetailDeck.data.type,
      id: dataDetailDeck.data._id,
      isLocal: false,
    };

    setDeck(newDeck);

    initialDeckRef.current = structuredClone(newDeck);
    setSnapshotHash(JSON.stringify(normalizeDeck(newDeck)));
  }, [dataDetailDeck]);

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
        ...prev,
        mainDeckCards: [...prev.mainDeckCards],
        extraDeckCards: [...prev.extraDeckCards],
        sideDeckCards: [...prev.sideDeckCards],
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
        if (card.activeStatus === 0) {
          showAlert("Lá bài này đã bị tắt hoạt động", "error");
          return prev;
        }
        if (card.cardLimitStatus === 0) {
          showAlert("Lá bài này đã bị BAN", "error");
          return prev;
        }

        if (totalCopies >= card.cardLimitStatus) {
          showAlert(`Lá bài này chỉ được tối đa ${card.cardLimitStatus} bản trong toàn bộ deck!`, "warning");
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

  const handeleSetStatus = async (code, cardLimitStatus, activeStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        code,
        cardLimitStatus,
        activeStatus
      });
      showAlert("Cập nhật trạng thái lá bài thành công", "success");
      // update local state
      setCards((prev) => prev.map((card) => (card.code === code ? { ...card, cardLimitStatus, activeStatus } : card)));
    } catch (error) {
      showAlert(error.message, "error")
    }
  };

  const handleRestoreDeck = () => {
    if (!initialDeckRef.current) return;

    const snapshot = structuredClone(initialDeckRef.current);

    setDeck(snapshot);

    updateDeckOption(snapshot.id, {
      name: snapshot.name,
      type: snapshot.type,
    },
      setLocalDecks,
      setDataDeck
    );
  };

  const savingDeck = createDeckMutation.isPending || updateDeckMutation.isPending;

  const handleSaveDeck = async () => {
    try {
      const payload = buildDeckPayload(deck);

      // ===== CREATE NEW DECK (LOCAL) =====
      if (String(deck.id).startsWith("LOCAL_")) {
        const res = await createDeckMutation.mutateAsync(payload);
        const createdDeck = res.data;

        // remove local deck draft
        setLocalDecks((prev) => prev.filter((d) => d._id !== deck.id));

        // add deck mới vào list server
        setDataDeck((prev) => ({
          ...(prev || {}),
          data: [createdDeck, ...(prev?.data || [])],
        }));

        const newDeck = { ...deck, id: createdDeck._id, isLocal: false };

        setDeck(newDeck);
        setSelectedDeckId(createdDeck._id);

        // update snapshot
        initialDeckRef.current = structuredClone(newDeck);
        setSnapshotHash(JSON.stringify(normalizeDeck(newDeck)));

        showAlert("Tạo deck thành công!", "success");
        return;
      }

      // ===== UPDATE DECK EXISTING =====
      await updateDeckMutation.mutateAsync(payload);

      showAlert("Save deck thành công!", "success");

      initialDeckRef.current = structuredClone(deck);
      setSnapshotHash(JSON.stringify(normalizeDeck(deck)));
    } catch (err) {
      showAlert(err?.message || "Save thất bại!", "error");
    }
  };

  const handleSelectDeck = (id) => {
    setSelectedDeckId(id);

    // nếu là LOCAL deck thì không fetch, chỉ set deck local luôn
    const local = localDecks.find((d) => d._id === id);
    if (local) {
      const newDeck = {
        mainDeckCards: [],
        extraDeckCards: [],
        sideDeckCards: [],
        id: local._id,
        name: local.name,
        type: local.type,
        isLocal: true,
      };

      setDeck(newDeck);

      initialDeckRef.current = structuredClone(newDeck);
      setSnapshotHash(JSON.stringify(normalizeDeck(newDeck)));
    }
  };

  const isChanged = useMemo(() => {
    if (!snapshotHash) return false;
    if (!deck.id) return false;
    return JSON.stringify(normalizeDeck(deck)) !== snapshotHash;
  }, [deck, snapshotHash]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Fillter
        deckManager={{
          deck,
          isChanged,
          handleRestoreDeck,
          deckOptions,
          handleSelectDeck,
          selectedDeckId
        }}
        filterManager={{
          filter,
          setFilter
        }}
      />
      <MDBox
        ref={rowRef}
        sx={{ display: "flex", gap: 2, height: rowHeight, overflow: "hidden" }}
      >
        <MDBox sx={{
          width: "75%",         // fixed ratio
          flexShrink: 1,        // cho phép co
          height: "100%",
          overflowY: "auto"
        }}>
          <DeckZones
            deck={deck}
            handleDropCard={handleDropCard}
            handleDragStartFromDeck={handleDragStartFromDeck}
          />
        </MDBox>
        <MDBox sx={{
          width: "25%",         // fixed ratio
          flexShrink: 1,        // cho phép co
          height: "100%",
          overflowY: "auto"
        }}>
          <CardTable
            cards={cards}
            loading={loading}
            hasMore={hasMore}
            onDropCard={(card) => handleDropCard(card, "POOL")}
            onLoadMore={handleLoadMore}
            handeleSetStatus={handeleSetStatus}
            setModalDeck={setModalDeck}
            deck={deck}
            isChanged={isChanged}
            handleSaveDeck={handleSaveDeck}
            isSavingDeck={savingDeck}
          />
        </MDBox>
      </MDBox>
      <ModalDeck
        deck={deck}
        modalDeck={modalDeck}
        setModalDeck={setModalDeck}
        setDeck={setDeck}
        setLocalDecks={setLocalDecks}
        initialDeckRef={initialDeckRef}
        setSnapshotHash={setSnapshotHash}
        setSelectDeck={setSelectedDeckId}
        setDataDeck={setDataDeck}
        selectedDeckId={selectedDeckId}
      />
      <Footer />
    </DashboardLayout>
  );
}

export default Cards;
