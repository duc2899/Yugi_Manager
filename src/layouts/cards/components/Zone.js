import React, { useMemo } from "react";

const Zone = ({
  title = "Zone",
  cards = [],
  onDropCard,
  renderCard,
  height = 160,
  validateDrop = () => true, // hàm kiểm tra xem card có hợp lệ để drop vào zone này không
  allowTypes = [],
  deckLimit = 0,
}) => {
  const handleDragOver = (e) => {
    e.preventDefault(); // bắt buộc để drop được
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const cardData = e.dataTransfer.getData("card");
    if (!cardData) return;

    const card = JSON.parse(cardData);

    if (!validateDrop(card)) {
      return;
    }
    if (onDropCard) onDropCard(card);

  };

  // ===== COUNT BY allowTypes =====
  const countByAllowTypes = useMemo(() => {
    const counter = {};

    allowTypes.forEach((t) => {
      counter[t] = 0;
    });

    cards.forEach((card) => {
      if (!card) return;

      // ưu tiên match type
      if (counter[card.type] !== undefined) {
        counter[card.type]++;
        return;
      }

      // nếu không match type thì match category
      if (counter[card.category] !== undefined) {
        counter[card.category]++;
        return;
      }
    });

    return counter;
  }, [cards, allowTypes]);

  const totalCards = cards.reduce((sum, card) => sum + (card.number || 1), 0);

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(43, 43, 43, 0.35)",
        overflow: "hidden",
        marginTop: "5px",
        height: "200px"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "5px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            color: `${totalCards >= deckLimit ? "springgreen" : "white"}`,
            fontSize: "14px",
          }}
        >
          {title}: {totalCards} / {deckLimit > 0 ? deckLimit : "∞"}
        </span>
        <div>
          {allowTypes.map((type) => (
            <span
              key={type}
              style={{
                fontSize: "12px",
                color: "rgb(255, 255, 255)",
                background: "rgba(255,255,255,0.1)",
                padding: "2px 6px",
                borderRadius: "4px",
                marginLeft: "6px",
              }}
            >
              {type}: <span>{countByAllowTypes[type] || 0}</span>
            </span>

          ))}
        </div>
      </div>

      {/* BODY */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        draggable
        style={{
          height,
          padding: "10px",
          overflowY: "auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          borderTop: "1px solid rgba(0,0,0,0.3)",
        }}
      >
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div key={`${card._id}-${index}`} >{renderCard(card)}</div>
          ))
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "13px",
              fontStyle: "italic",
              border: "1px dashed rgba(255,255,255,0.2)",
              borderRadius: "10px",
            }}
          >
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
};

export default Zone;
