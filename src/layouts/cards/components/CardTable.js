import { useEffect, useRef, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import { useMaterialUIController } from "context";
import CardHover from "./CardHover";
import { CARD_TYPE } from "config/card";
import CardImage from "./CardImage";
import CardSetStatus from "./CardSetStatus";
import { CircularProgress } from "@mui/material";
import MDButton from "components/MDButton";
import { useCardHover } from "../../../hooks/useCardHover";

function CardTable({
    cards,
    loading,
    hasMore,
    onLoadMore,
    onDropCard,
    handeleSetStatus,
    setModalDeck,
    deck,
    isChanged,
    handleSaveDeck,
    isSavingDeck
}) {
    const [controller] = useMaterialUIController();
    const { lang } = controller;

    const { hoverCard, pos, onMouseEnter, onMouseLeave } = useCardHover();

    const observerRef = useRef(null);
    const bottomRef = useRef(null);
    const [cardSetStatusOpen, setCardSetStatusOpen] = useState({
        isOpen: false,
        card: null,
    });

    useEffect(() => {
        if (!hasMore) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    onLoadMore();
                }
            },
            { threshold: 1 }
        );

        if (bottomRef.current) {
            observerRef.current.observe(bottomRef.current);
        }

        return () => observerRef.current?.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, loading]);

    const handleDragStart = (e, card) => {
        const payload = {
            _id: card._id,
            type: card.type,
            category:
                card.type === CARD_TYPE.MONSTER
                    ? (card.monsterCategories?.find((x) =>
                        ["FUSION", "SYNCHRO", "XYZ", "LINK"].includes(x)
                    ) || "")
                    : "",
            source: "POOL",
            name: card.name,
            cardLimitStatus: card.cardLimitStatus,
            number: 1,
            data: card
        };

        e.dataTransfer.setData("card", JSON.stringify(payload));
    };

    const handleDrop = (e) => {
        e.preventDefault();

        const cardData = e.dataTransfer.getData("card");
        if (!cardData) return;

        const card = JSON.parse(cardData);
        if (onDropCard) onDropCard(card);

    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '85%', // hoặc height cố định, ví dụ 400px
        }}

        >
            <div
                style={{
                    padding: '8px 12px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}
            >
                <MDBox sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                }}>
                    <MDTypography variant="h6" sx={{ margin: 0 }}>Total Cards: {cards.length}</MDTypography>
                    <MDBox sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "5px",
                    }}>
                        {isChanged &&
                            <MDButton
                                color="primary"
                                size="small"
                                onClick={handleSaveDeck}
                                loading={isSavingDeck}
                            >
                                Lưu
                            </MDButton>
                        }
                        {deck.name &&
                            <MDButton
                                color="success"
                                size="small"
                                onClick={() => setModalDeck({
                                    isOpen: true,
                                    type: "EDIT",
                                    data: {
                                        type: deck.type,
                                        name: deck.name
                                    }
                                })}
                            >
                                Sửa
                            </MDButton>
                        }
                        <MDButton
                            color="info"
                            size="small"
                            onClick={() => setModalDeck({
                                isOpen: true,
                                type: "CREATE",
                                data: {
                                    type: "",
                                    name: ""
                                }
                            })}
                        >
                            Tạo
                        </MDButton>
                    </MDBox>

                </MDBox>
            </div>
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    overflowY: "auto",
                    flex: 1,
                    minHeight: 0,
                    paddingBottom: "150px",
                    position: "relative",
                }}
            >
                {/* LOADING OVERLAY */}
                {loading && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 10,
                        }}
                    >
                        <CircularProgress
                            size={50}
                            thickness={3}
                            sx={{
                                color: "primary.main",
                                "& .MuiCircularProgress-circle": {
                                    strokeLinecap: "round",
                                },
                            }}
                        />
                    </div>
                )}

                {/* EMPTY */}
                {!loading && cards.length === 0 && (
                    <div
                        style={{
                            width: "100%",
                            height: "250px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "15px",
                            color: "rgba(255,255,255,0.7)",
                            fontStyle: "italic",
                        }}
                    >
                        Không tìm thấy thẻ nào.
                    </div>
                )}

                {/* CARDS */}
                {cards.map((card) => (
                    <div
                        key={card._id}
                        draggable
                        style={{
                            margin: "10px",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => onMouseEnter(card, e)}
                        onMouseLeave={onMouseLeave}
                        onDragStart={(e) => handleDragStart(e, card)}
                        onClick={() => setCardSetStatusOpen({ isOpen: true, card })}
                    >
                        <CardImage card={card} />
                    </div>
                ))}

                <div ref={bottomRef} style={{ height: 20, width: "100%" }} />
            </div>
            {cardSetStatusOpen.isOpen && (
                <CardSetStatus
                    open={cardSetStatusOpen}
                    setOpen={setCardSetStatusOpen}
                    lang={lang}
                    handleSetStatus={handeleSetStatus}
                />
            )}
            {hoverCard && <CardHover hoverCard={hoverCard} lang={lang} pos={pos} />}
        </div >
    );
}

export default CardTable;