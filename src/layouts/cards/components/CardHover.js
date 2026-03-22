import { Stack } from "@mui/material";
import { ATTRIBUTE_ICONS } from "config/card";
import { URL_IMAGE } from "config/constant";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { BACKGROUND_CARDS } from "config/constant";

const CardHover = ({ pos, hoverCard, lang }) => {

    const getBackgroundByType = (type, monsterType = null) => {
        const bgObj = BACKGROUND_CARDS.find((bg) => bg.type.toLowerCase() === type.toLowerCase() && (monsterType ? bg.monsterType.toLowerCase() === monsterType.toLowerCase() : true));
        return bgObj ? bgObj.background : "radial-gradient(circle at top left, #F7D58A, #C9A24D)";
    }

    return (
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
                <img src={`${URL_IMAGE}${hoverCard._id}.jpg`} width={150} alt={hoverCard.name} />
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
                        background: getBackgroundByType(hoverCard.type, hoverCard.monsterCategories?.[0]),
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
                                hoverCard.level > 0 && (
                                    <img
                                        src={ATTRIBUTE_ICONS[hoverCard.monsterAttribute.toLowerCase()]}
                                        alt={hoverCard.monsterAttribute}
                                        style={{ width: 24, height: 24 }}
                                    />
                                )
                            }

                        </MDBox>
                        <MDBox>
                            <MDTypography variant="h6" fontWeight="regular" sx={{ color: "#fff", textAlign: "center" }}>
                                {hoverCard.monsterCategories ? hoverCard.monsterCategories?.join(" / ") + " (" + hoverCard.monsterType + ")" : (hoverCard.spellType || hoverCard.trapType || hoverCard.type)}
                            </MDTypography>
                        </MDBox>
                        {
                            hoverCard.level > 0 && (
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
                            {lang === "en" ? hoverCard.desc : hoverCard.descVN}
                        </MDTypography>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardHover