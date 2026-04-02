import React from "react";

const Zone = ({
  title = "Zone",
  cards = [],
  onDropCard,
  renderCard,
  height = 160,
}) => {
  const handleDragOver = (e) => {
    e.preventDefault(); // bắt buộc để drop được
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const cardId = e.dataTransfer.getData("cardId");
    if (!cardId) return;

    if (onDropCard) onDropCard(cardId);
  };

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(43, 43, 43, 0.35)",
        overflow: "hidden",
        marginTop: "10px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <span style={{ fontWeight: "bold", color: "white", fontSize: "14px" }}>
          {title}: {cards.length}
        </span>

        {/* <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>

        </span> */}
      </div>

      {/* BODY */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
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
          cards.map((cardId, index) => (
            <div key={`${cardId}-${index}`}>{renderCard(cardId)}</div>
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
