import CardImage from "./CardImage";

const DeckCardItem = ({ card, width = 55, onDragStart }) => {
    return (
        <div style={{ position: "relative", width: `${width}px` }} onDragStart={onDragStart}>
            <CardImage card={card} width={width} showStatus={false} />

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
    );
};

export default DeckCardItem;