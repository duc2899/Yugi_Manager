import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Chip, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';

// Material Dashboard 2 React components

// Material Dashboard 2 React example components
import MDBox from 'components/MDBox';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import MDTypography from 'components/MDTypography';
import { formatTimestampFixed } from 'utils';
import MDButton from 'components/MDButton';
import CreateTournaments from './components/createTournaments';


function Tables() {
    const [age, setAge] = useState('');
    const [open, setOpen] = useState(false);
    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const status = [
        {
            name: "Tất cả",
            key: "ALL",
            color: ""
        },
        {
            name: "Đã hoàn thành",
            key: "COMPLETED",
            color: "#4CAF50"
        },
        {
            name: "Đang diễn ra",
            key: "INPROGRESS",
            color: "#2196F3"
        },
        {
            name: "Dự kiến",
            key: "COMMINGSOON",
            color: "#FF9800"
        },
        {
            name: "Đã hủy",
            key: "CANCELLED",
            color: "#F44336"
        }
    ]

    const tournamentsData = [
        // {
        //     "debugRoundCountdownTime": "Jan 22, 2026, 8:37:00 AM",
        //     "rubyFee": 10,
        //     "debugRoundStartedTime": "Jan 22, 2026, 8:38:00 AM",
        //     "type": "SERVER",
        //     "numberJoinRoomPlayers": 0,
        //     "roundIndex": 2,
        //     "limitNumberPlayers": 4,
        //     "numberRegisteredPlayers": 4,
        //     "name": "Test tournament-22/01/2026",
        //     "roundCountdownTime": 1769071020000,
        //     "debugTournamentStaredTime": "Jan 22, 2026, 8:35:00 AM",
        //     "id": 228952400,
        //     "bannishCardCodes": [
        //         "69247929"
        //     ],
        //     "roundStartedTime": 1769071080000,
        //     "rubyReward": 1000,
        //     "tournamentStaredTime": 1769070900000,
        //     "status": "COMPLETED"
        // },
        // {
        //     "debugRoundCountdownTime": "Jan 22, 2026, 8:25:00 AM",
        //     "rubyFee": 10,
        //     "debugRoundStartedTime": "Jan 22, 2026, 8:26:00 AM",
        //     "type": "SERVER",
        //     "numberJoinRoomPlayers": 0,
        //     "roundIndex": 2,
        //     "limitNumberPlayers": 4,
        //     "numberRegisteredPlayers": 4,
        //     "name": "Test tournament-22/01/2026",
        //     "roundCountdownTime": 1769070300000,
        //     "debugTournamentStaredTime": "Jan 22, 2026, 8:25:00 AM",
        //     "id": 1655540089,
        //     "bannishCardCodes": [
        //         "69247929"
        //     ],
        //     "roundStartedTime": 1769070360000,
        //     "rubyReward": 1000,
        //     "tournamentStaredTime": 1769070300000,
        //     "status": "COMPLETED"
        // },
        // {
        //     "debugRoundCountdownTime": "Jan 22, 2026, 7:46:00 AM",
        //     "rubyFee": 10,
        //     "debugRoundStartedTime": "Jan 22, 2026, 7:47:00 AM",
        //     "type": "SERVER",
        //     "numberJoinRoomPlayers": 0,
        //     "roundIndex": 3,
        //     "limitNumberPlayers": 4,
        //     "numberRegisteredPlayers": 4,
        //     "name": "Test tournament-22/01/2026",
        //     "roundCountdownTime": 1769067960000,
        //     "debugTournamentStaredTime": "Jan 22, 2026, 7:45:00 AM",
        //     "id": 525680389,
        //     "bannishCardCodes": [
        //         "69247929"
        //     ],
        //     "roundStartedTime": 1769068020000,
        //     "rubyReward": 1000,
        //     "tournamentStaredTime": 1769067900000,
        //     "status": "COMPLETED"
        // },
        // {
        //     "debugRoundCountdownTime": "Jan 20, 2026, 9:46:00 AM",
        //     "rubyFee": 10,
        //     "debugRoundStartedTime": "Jan 20, 2026, 9:47:00 AM",
        //     "type": "SERVER",
        //     "numberJoinRoomPlayers": 0,
        //     "roundIndex": 2,
        //     "limitNumberPlayers": 4,
        //     "numberRegisteredPlayers": 4,
        //     "name": "Test phong-20/01/2026",
        //     "roundCountdownTime": 1768902360000,
        //     "debugTournamentStaredTime": "Jan 20, 2026, 9:45:00 AM",
        //     "id": 206573665,
        //     "bannishCardCodes": [
        //         "69247929"
        //     ],
        //     "roundStartedTime": 1768902420000,
        //     "rubyReward": 1000,
        //     "tournamentStaredTime": 1768902300000,
        //     "status": "COMPLETED"
        // },
        // {
        //     "debugRoundCountdownTime": "Jan 19, 2026, 8:50:00 AM",
        //     "rubyFee": 10,
        //     "debugRoundStartedTime": "Jan 19, 2026, 8:51:00 AM",
        //     "type": "SERVER",
        //     "numberJoinRoomPlayers": 0,
        //     "roundIndex": 2,
        //     "limitNumberPlayers": 4,
        //     "numberRegisteredPlayers": 4,
        //     "name": "Test phong-19/01/2026",
        //     "roundCountdownTime": 1768812600000,
        //     "debugTournamentStaredTime": "Jan 19, 2026, 8:50:00 AM",
        //     "id": 868806828,
        //     "bannishCardCodes": [
        //         "69247929"
        //     ],
        //     "roundStartedTime": 1768812660000,
        //     "rubyReward": 1000,
        //     "tournamentStaredTime": 1768812600000,
        //     "status": "COMPLETED"
        // },
        // {
        //     "debugRoundCountdownTime": "Jan 19, 2026, 8:30:00 AM",
        //     "rubyFee": 10,
        //     "debugRoundStartedTime": "Jan 19, 2026, 8:31:00 AM",
        //     "type": "SERVER",
        //     "numberJoinRoomPlayers": 0,
        //     "roundIndex": 2,
        //     "limitNumberPlayers": 4,
        //     "numberRegisteredPlayers": 4,
        //     "name": "Test phong-19/01/2026",
        //     "roundCountdownTime": 1768811400000,
        //     "debugTournamentStaredTime": "Jan 19, 2026, 8:30:00 AM",
        //     "id": 1770846747,
        //     "bannishCardCodes": [
        //         "69247929"
        //     ],
        //     "roundStartedTime": 1768811460000,
        //     "rubyReward": 1000,
        //     "tournamentStaredTime": 1768811400000,
        //     "status": "COMPLETED"
        // },
        // {
        //     "debugRoundCountdownTime": "Jan 19, 2026, 8:20:00 AM",
        //     "rubyFee": 10,
        //     "debugRoundStartedTime": "Jan 19, 2026, 8:21:00 AM",
        //     "type": "SERVER",
        //     "numberJoinRoomPlayers": 0,
        //     "roundIndex": 1,
        //     "limitNumberPlayers": 4,
        //     "numberRegisteredPlayers": 2,
        //     "name": "Test phong-19/01/2026",
        //     "roundCountdownTime": 1768810800000,
        //     "debugTournamentStaredTime": "Jan 19, 2026, 8:21:00 AM",
        //     "id": 1232617908,
        //     "bannishCardCodes": [
        //         "69247929"
        //     ],
        //     "roundStartedTime": 1768810860000,
        //     "rubyReward": 1000,
        //     "tournamentStaredTime": 1768810860000,
        //     "status": "COMPLETED"
        // },
        // {
        //     "debugRoundCountdownTime": "Jan 19, 2026, 8:14:00 AM",
        //     "rubyFee": 10,
        //     "debugRoundStartedTime": "Jan 19, 2026, 8:15:00 AM",
        //     "type": "SERVER",
        //     "numberJoinRoomPlayers": 0,
        //     "roundIndex": 1,
        //     "limitNumberPlayers": 4,
        //     "numberRegisteredPlayers": 2,
        //     "name": "Test phong-19/01/2026",
        //     "roundCountdownTime": 1768810440000,
        //     "debugTournamentStaredTime": "Jan 19, 2026, 8:15:00 AM",
        //     "id": 1592703556,
        //     "bannishCardCodes": [
        //         "69247929"
        //     ],
        //     "roundStartedTime": 1768810500000,
        //     "rubyReward": 1000,
        //     "tournamentStaredTime": 1768810500000,
        //     "status": "COMPLETED"
        // },
    ]

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 4 }}>
                    <MDButton variant="gradient" color="primary" onClick={handleClickOpen}>
                        Tạo giải đấu mới
                    </MDButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <TextField sx={{ width: "40%" }} label="Tournament Name" id="fullWidth" />
                    <FormControl sx={{ width: "20%" }}>
                        <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Trạng thái"
                            onChange={handleChange}
                            sx={{ p: 1.5 }}
                        >
                            {status.map((s) => (
                                <MenuItem key={s.key} value={s.key} sx={{ color: s.color || 'inherit' }}>
                                    {s.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                {
                    tournamentsData.length === 0 ? (
                        <MDBox sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 14px 0 rgba(32, 40, 45, 0.08)',
                            p: 6,
                            textAlign: 'center',
                            height: '500px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                            <MDTypography
                                display="inline"
                                variant="h4"
                                textTransform="capitalize"
                                fontWeight="bold">
                                Không có giải đấu nào
                            </MDTypography>
                        </MDBox>
                    ) : <div style={{
                        display: 'grid',
                        gridAutoRows: 'auto',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(620px, 1fr))',
                        gap: '10px'
                    }} >
                        {tournamentsData.map((tournamentsDataItem) => ((
                            <>
                                <MDBox
                                    key={tournamentsDataItem.id}
                                    sx={{
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 14px 0 rgba(32, 40, 45, 0.08)',
                                        p: 2,
                                    }}>
                                    <MDBox sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}>
                                        <MDTypography
                                            display="inline"
                                            variant="h3"
                                            textTransform="capitalize"
                                            fontWeight="bold">
                                            {tournamentsDataItem.name}
                                        </MDTypography>
                                        <Stack direction={'row'} spacing={1}>
                                            <Chip label={tournamentsDataItem.status} color="success" variant="filled" />
                                            <Chip label={tournamentsDataItem.type} color="success" variant="outlined" />
                                        </Stack>
                                    </MDBox>
                                    <MDBox sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 3 }}>
                                        <MDBox>
                                            <Stack direction={'row'} spacing={1}>
                                                <MDTypography
                                                    variant="body2" component="p" color="text" fontWeight="bold">
                                                    Phí tham gia:
                                                </MDTypography>
                                                <MDTypography
                                                    variant="body2" component="p" color="text">
                                                    {tournamentsDataItem.rubyFee} Ruby
                                                </MDTypography>
                                            </Stack>
                                            <Stack direction={'row'} spacing={1}>
                                                <MDTypography
                                                    variant="body2" component="p" color="text" fontWeight="bold">
                                                    Phần thưởng:
                                                </MDTypography>
                                                <MDTypography
                                                    variant="body2" component="p" color="text">
                                                    {tournamentsDataItem.rubyReward} Ruby
                                                </MDTypography>
                                            </Stack>

                                            <Stack direction={'row'} spacing={1}>
                                                <MDTypography
                                                    variant="body2" component="p" color="text" fontWeight="bold">
                                                    Danh sách đăng ký:
                                                </MDTypography>
                                                <MDTypography
                                                    variant="body2" component="p" color="text">
                                                    {tournamentsDataItem.numberRegisteredPlayers}/{tournamentsDataItem.limitNumberPlayers}
                                                </MDTypography>
                                            </Stack>


                                        </MDBox>
                                        <MDBox>
                                            <Stack direction={'row'} spacing={1}>
                                                <MDTypography
                                                    variant="body2" component="p" color="text" fontWeight="bold">
                                                    Vòng đấu:
                                                </MDTypography>
                                                <MDTypography
                                                    variant="body2" component="p" color="text">
                                                    {tournamentsDataItem.roundIndex}
                                                </MDTypography>
                                            </Stack>

                                            <Stack direction={'row'} spacing={1}>
                                                <MDTypography
                                                    variant="body2" component="p" color="text" fontWeight="bold">
                                                    Số cards cấm sử dụng:
                                                </MDTypography>
                                                <MDTypography
                                                    variant="body2" component="p" color="text">
                                                    {tournamentsDataItem.bannishCardCodes.length}
                                                </MDTypography>
                                            </Stack>

                                            <Stack direction={'row'} spacing={1}>
                                                <MDTypography
                                                    variant="body2" component="p" color="text" fontWeight="bold">
                                                    Thời gian bắt đầu:
                                                </MDTypography>
                                                <MDTypography
                                                    variant="body2" component="p" color="text">
                                                    {formatTimestampFixed(tournamentsDataItem.tournamentStaredTime)}
                                                </MDTypography>
                                            </Stack>

                                        </MDBox>
                                    </MDBox>
                                    <MDBox sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1, cursor: 'pointer' }}>
                                        <ArrowForwardIcon sx={{ color: '#1976d2' }} />
                                        <MDTypography
                                            variant="body2" component="p" color="#1976d2" sx={{ cursor: 'pointer' }}>
                                            Xem chi tiết
                                        </MDTypography>
                                    </MDBox>

                                </MDBox>

                            </>
                        )))}
                    </div>
                }

            </MDBox>
            <Footer />
            <CreateTournaments open={open} handleClose={handleClose} />
        </DashboardLayout >
    );
}

export default Tables;
