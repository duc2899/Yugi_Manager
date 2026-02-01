import { useEffect, useState } from "react";
import cardApi from "../../../../api/cardAPI";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import wind from 'assets/images/attributes/wind.png';
import dark from 'assets/images/attributes/dark.png';
import divine from 'assets/images/attributes/divine.png';
import earth from 'assets/images/attributes/earth.png';
import fire from 'assets/images/attributes/fire.png';
import light from 'assets/images/attributes/light.png';
import water from 'assets/images/attributes/water.png';
import { Stack } from "@mui/material";
import LazyImage from "components/common/LazyImage";

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
                    type: "Spell Card",
                    num: 90,
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

    const ATTRIBUTE_ICONS = {
        dark,
        light,
        earth,
        water,
        fire,
        wind,
        divine
    }

    const BACKGROUND_CARDS = [
        {
            type: "Normal Monster",
            background: "radial-gradient(circle at top left, #F7D58A, #C9A24D)",
        },
        {
            type: "Effect Monster",
            background: "radial-gradient(circle at top left, #F3A55A, #C96B2C)",
        },
        {
            type: "Ritual Monster",
            background: "radial-gradient(circle at top left, #7FB3E6, #2F6DB3)",
        },
        {
            type: "Fusion Monster",
            background: "radial-gradient(circle at top left, #C28BD9, #6B2C91)"
        },
        {
            type: "Synchro Monster",
            background: "radial-gradient(circle at top left, #F5F5F5, #9E9E9E)"
        },
        {
            type: "Xyz Monster",
            background: "radial-gradient(circle at top left, #555555, #000000)"
        },
        {
            type: "Pendulum Monster",
            background: "linear-gradient(135deg, #2E8B57, #D2B48C)"
        },
        {
            type: "Link Monster",
            background: "radial-gradient(circle at top left, #1E90FF, #0B3C6D)"
        },
        {
            type: "Spell Card",
            background: "radial-gradient(circle at top left, #4CAF91, #1E7F6F)"
        },
        {
            type: "Trap Card",
            background: "radial-gradient(circle at top left, #C94B9A, #7A1F5C)"
        }
    ]


    const getBackgroundByType = (type) => {
        const bgObj = BACKGROUND_CARDS.find((bg) => bg.type === type);
        return bgObj ? bgObj.background : "radial-gradient(circle at top left, #F7D58A, #C9A24D)";
    }


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%', // hoặc height cố định, ví dụ 400px

        }}>
            <div
                style={{
                    padding: '8px 12px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}
            >
                <MDTypography variant="h6" sx={{ margin: 0 }}>Total Cards: {cards.length}</MDTypography>
            </div>
            {
                cards.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        overflowY: 'auto',
                        flex: 1,  
                        paddingBottom: "150px"        // 👈 chiếm phần còn lại
                    }}>
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
                                <LazyImage src={card.card_images[0].image_url_small} alt={card.name} style={{ width: '70px', height: 'auto' }} />
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
                    <div style={{ display: 'flex', alignItems: 'flex-start', }}>
                        <img src={hoverCard.card_images[0].image_url} width={150} alt={hoverCard.name} />
                        <div style={{
                            alignSelf: 'flex-start',
                            maxWidth: '800px',
                            minWidth: '400px',
                            border: '2px solid #ccc',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <MDBox sx={{
                                background: getBackgroundByType(hoverCard.type),
                                borderRadius: "8px 8px 0 0",
                            }}>
                                <MDBox sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    paddingTop: "15px",
                                }}>
                                    <MDTypography variant="h4" sx={{
                                        color: "#fff",
                                    }}>{hoverCard.name}</MDTypography>
                                    {
                                        hoverCard.level && (
                                            <img
                                                src={ATTRIBUTE_ICONS[hoverCard.attribute.toLowerCase()]}
                                                alt={hoverCard.attribute}
                                                style={{ width: 24, height: 24 }}
                                            />
                                        )
                                    }

                                </MDBox>
                                <MDBox>
                                    <MDTypography variant="h6" fontWeight="regular" sx={{ color: "#fff", textAlign: "center" }}>
                                        {hoverCard.typeline ? hoverCard.typeline?.join(" / ") : hoverCard.race}
                                    </MDTypography>
                                </MDBox>
                                {
                                    hoverCard.level && (
                                        <MDBox sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: "15px",
                                            padding: "10px 0",
                                            borderTop: "2px solid rgba(255, 255, 255, 0.49)",
                                        }}>
                                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                                <MDBox sx={{
                                                    p: 0.5,
                                                    borderRadius: "4px",
                                                    background: "rgba(172, 172, 172, 0.3)",
                                                    textAlign: "center",
                                                    width: "fit-content",
                                                }}>
                                                    <MDTypography variant="h6" color={"white"} fontWeight="bold" sx={{ fontSize: "13px" }}>
                                                        Level
                                                    </MDTypography>
                                                </MDBox>
                                                <MDTypography variant="h6" color={"white"} fontWeight="bold" sx={{ fontSize: "15px" }}>
                                                    {hoverCard.level}
                                                </MDTypography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                                <MDBox sx={{
                                                    p: 0.5,
                                                    borderRadius: "4px",
                                                    background: "rgba(172, 172, 172, 0.3)",
                                                    textAlign: "center",
                                                    width: "fit-content",
                                                }}>
                                                    <MDTypography variant="h6" color={"white"} fontWeight="bold" sx={{ fontSize: "13px" }}>
                                                        ATK
                                                    </MDTypography>
                                                </MDBox>
                                                <MDTypography variant="h6" color={"white"} fontWeight="bold" sx={{ fontSize: "15px" }}>
                                                    {hoverCard.atk}
                                                </MDTypography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                                <MDBox sx={{
                                                    p: 0.5,
                                                    borderRadius: "4px",
                                                    background: "rgba(172, 172, 172, 0.3)",
                                                    textAlign: "center",
                                                    width: "fit-content",
                                                }}>
                                                    <MDTypography variant="h6" color={"white"} fontWeight="bold" sx={{ fontSize: "13px" }}>
                                                        DEF
                                                    </MDTypography>
                                                </MDBox>
                                                <MDTypography variant="h6" color={"white"} fontWeight="bold" sx={{ fontSize: "15px" }}>
                                                    {hoverCard.def}
                                                </MDTypography>
                                            </Stack>
                                        </MDBox>
                                    )
                                }

                            </MDBox>
                            <div style={{ padding: "10px" }}>
                                <MDTypography variant="body2" color={"black"} fontWeight="regular">
                                    {hoverCard.desc}
                                </MDTypography>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

export default ShowCards;