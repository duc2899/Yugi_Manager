import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import {
    Stack,
    Chip,
    Divider,
} from "@mui/material";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import tournamentAPI from "api/tournamentsAPI";
import { formatTimestampVN } from "utils";
import PlayerItem from "./components/Player";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Info from "./components/Infor";
import { getStatusInfo } from "utils";

const DetailTournament = () => {

    const { id } = useParams();
    const [data, setData] = useState(null);

    const fetchDetail = async () => {
        const res = await tournamentAPI.getDetailTournament(id);
        setData(res.data);
    };

    useEffect(() => {
        fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!data) return null;

    const winner = data?.registers?.find(
        (p) => p.playerId === data?.winPlayerId
    );

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox
                sx={{
                    p: 3,
                    height: "calc(100vh - 120px)", // trừ navbar + padding
                    overflowY: "auto"
                }}
            >

                <MDBox
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", md: "center" },
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2
                    }}
                >
                    <MDTypography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            wordBreak: "break-word"
                        }}
                    >
                        {data.name}
                    </MDTypography>

                    {winner && (
                        <MDBox
                            sx={{
                                width: { xs: "100%", md: "auto" }
                            }}
                        >
                            <PlayerItem isWinner={true} player={winner} />
                        </MDBox>
                    )}
                </MDBox>

                <Stack direction="row" spacing={2} mt={1}>
                    <Chip label={getStatusInfo(data.status, "name")} variant="filled" sx={{
                        backgroundColor: getStatusInfo(data.status, "color"),
                        color: "#fff"
                    }} />
                    <Chip label={data.type} variant="outlined" />
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Thông tin giải đấu */}
                <MDBox
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: 2
                    }}
                >
                    <Info label="Phí tham gia" value={`${data.rubyFee} Ruby`} />
                    <Info label="Phần thưởng" value={`${data.rubyReward} Ruby`} />
                    <Info label="Số người tối đa" value={data.limitNumberPlayers} />
                    <Info label="Vòng hiện tại" value={data.roundIndex} />
                    <Info
                        label="Thời gian bắt đầu"
                        value={formatTimestampVN(data.tournamentStartedTime)}
                    />
                    <Info
                        label="Round bắt đầu"
                        value={formatTimestampVN(data.roundStartedTime)}
                    />
                    <Info
                        label="Created time"
                        value={formatTimestampVN(data.createdTime)}
                    />
                </MDBox>
                <Divider sx={{ my: 4 }} />

                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                    Danh sách Card bị cấm ({data.bannishCardCodes.length})
                </MDTypography>


                {data.bannishCardCodes.length === 0 ? (
                    <MDTypography variant="body2">
                        Không cards nào bị cấm
                    </MDTypography>
                ) : data.bannishCardCodes.map((item, index) => (
                    <MDBox
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                            gap: 2
                        }}
                    >
                        <MDBox
                            key={index}
                            sx={{
                                background: "#fff",
                                borderRadius: 2,
                                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                                overflow: "hidden",
                                transition: "0.2s",
                                "&:hover": {
                                    transform: "scale(1.05)"
                                }
                            }}
                        >
                            <img
                                src={`https://images.ygoprodeck.com/images/cards_small/${item}.jpg`}
                                style={{
                                    width: "100%",
                                    display: "block",
                                    borderRadius: 6
                                }}
                                alt={`Card ${index}`}
                            />
                        </MDBox>
                    </MDBox>

                ))}

                <Divider sx={{ my: 4 }} />

                {/* Danh sách đăng ký */}
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                    Người đăng ký ({data.registers.length})
                </MDTypography>

                <MDBox
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: 2
                    }}
                >
                    {data.registers.length === 0 ? (
                        <MDTypography variant="body2">
                            Chưa có dữ liệu
                        </MDTypography>
                    ) : (
                        data.registers.map((player) => (
                            <PlayerItem
                                key={player.playerId}
                                player={player}
                                isWinner={player.playerId === data.winPlayerId}
                            />
                        ))
                    )}
                </MDBox>

                <Divider sx={{ my: 4 }} />

                {/* Round Players */}
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                    Người chơi trong vòng đấu ({data.roundPlayers.length})
                </MDTypography>

                <MDBox
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: 2
                    }}
                >
                    {data.roundPlayers.length === 0 ? (
                        <MDTypography variant="body2">
                            Chưa có dữ liệu
                        </MDTypography>
                    ) : (
                        data.roundPlayers.map((player, index) => (
                            <PlayerItem key={index} player={player} />
                        ))
                    )}
                </MDBox>

            </MDBox>
        </DashboardLayout>
    );
};

export default DetailTournament;
