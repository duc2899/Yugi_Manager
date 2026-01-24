import { useEffect, useState } from "react";
import cardApi from "../../../../api/cardAPI";

function ShowCards() {

    const PREVIEW_WIDTH = 280;
    const PREVIEW_HEIGHT = 350;
    const OFFSET = 20;
    const [cards, setCards] = useState([]);
    const [hoverCard, setHoverCard] = useState(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const data = await cardApi.getAllCards({
                    type: "Normal Monster",
                    num: 40,
                    offset: 0
                });
                setCards(data.data);
            } catch (error) {
                console.error("Error fetching cards:", error);
            }
        };

        fetchCards();
    }, []);

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


    return (
        <div>
            <h2>Total Cards: {cards.length}</h2>
            {
                cards.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                style={{
                                    margin: '10px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseMove={(e) => handleMouseEnter(card, e)}
                                onMouseLeave={(e) => handleMouseLeave(e)}
                            >
                                <img
                                    src={card.card_images[0].image_url_small}
                                    alt={card.name}
                                    style={{ width: '70px', height: 'auto' }}
                                />
                            </div>
                        ))}
                    </div>
                )
                    : (
                        <p>No cards to display.</p>
                    )
            }

            {hoverCard && (
                <div
                    style={{
                        position: 'fixed',
                        top: Math.min(pos.y, window.innerHeight - 400),
                        left: Math.min(pos.x, window.innerWidth - 280),
                        zIndex: 9999,
                        pointerEvents: 'none',

                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                        <img src={hoverCard.card_images[0].image_url} width={150} alt={hoverCard.name} />
                        <div style={{
                            alignSelf: 'flex-start',
                            maxWidth: '500px',
                            border: '2px solid #ccc',
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <div>{hoverCard.name}</div>
                            <div>{hoverCard.desc}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}

export default ShowCards;