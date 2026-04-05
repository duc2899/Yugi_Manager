import { useEffect, useRef, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import LazyImage from "components/common/LazyImage";
import { URL_IMAGE } from "config/constant";
import { useMaterialUIController } from "context";
import CardHover from "./CardHover";
import { CARD_TYPE } from "config/card";

function CardTable({
    cards,
    loading,
    hasMore,
    onLoadMore,
    onDropCard,
}) {
    const [controller] = useMaterialUIController();
    const {
        lang
    } = controller;
    const PREVIEW_WIDTH = 680;
    const PREVIEW_HEIGHT = 350;
    const OFFSET = 20;

    const [hoverCard, setHoverCard] = useState(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const observerRef = useRef(null);
    const bottomRef = useRef(null);

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

    const handleMouseEnter = (card, e) => {
        setHoverCard(card);

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        let x = mouseX + OFFSET;
        let y = mouseY + OFFSET;

        // 🔁 Flip ngang nếu sát mép phải
        if (mouseX + PREVIEW_WIDTH + OFFSET > window.innerWidth) {
            x = mouseX - PREVIEW_WIDTH - OFFSET;
        }

        // 🔁 Flip dọc nếu sát đáy
        if (mouseY + PREVIEW_HEIGHT + OFFSET > window.innerHeight) {
            y = mouseY - PREVIEW_HEIGHT - OFFSET;
        }

        setPos({ x, y });
    };

    const handleMouseLeave = (event) => {
        setHoverCard(null);
        event.currentTarget.style.transform = 'scale(1)'
    }

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
            source: "POOL"
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
                </MDBox>
            </div>
            {
                cards.length > 0 ? (
                    <div
                        draggable
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            overflowY: 'auto',
                            flex: 1,
                            minHeight: 0,
                            paddingBottom: "150px"

                        }}
                    >
                        {cards.map((card) => (
                            <div
                                key={card._id}
                                style={{
                                    margin: '10px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseMove={(e) => handleMouseEnter(card, e)}
                                onMouseLeave={(e) => handleMouseLeave(e)}
                                onDragStart={(e) => handleDragStart(e, card)}
                            >
                                <LazyImage src={`${URL_IMAGE}${card._id}.jpg`} alt={card.name} style={{ width: '70px', height: 'auto' }} />
                            </div>
                        ))}

                        {loading && (
                            <div style={{ width: '100%', textAlign: 'center', padding: 20 }}>
                                Loading...
                            </div>
                        )}

                        <div ref={bottomRef} style={{ height: 20 }} />
                    </div>
                )
                    : (
                        <div style={{ textAlign: 'center', padding: 50 }}>
                            {loading ? "Loading..." : "Không tìm thấy thẻ nào."}
                        </div>
                    )
            }

            {hoverCard && <CardHover hoverCard={hoverCard} lang={lang} pos={pos}></CardHover>}
        </div >
    );
}

export default CardTable;