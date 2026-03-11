import { useEffect, useState } from 'react';
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
import { formatTimestampVN } from 'utils';
import MDButton from 'components/MDButton';
import CreateTournaments from './components/createTournaments';
import { getTournaments } from 'api/tournamentsAPI';


function Tables() {
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
    const [currentStatus, setCurrentStatus] = useState('');
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    const handleChangeStatus = (event) => {
        setCurrentStatus(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchData = async (page, limit) => {
        try {
            const response = await getTournaments({
                page: page,
                limit: limit,
            });

            setData(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchData(1, 10)
    }, [])

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3} sx={{

            }}>
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
                            value={currentStatus}
                            label="Trạng thái"
                            onChange={handleChangeStatus}
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
                    data.length === 0 ? (
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
                        gap: '10px',
                        maxHeight: "600px", overflowY: "scroll"
                    }} >
                        {data.map((tournamentsDataItem) => ((
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
                                                {tournamentsDataItem.registers.length}/{tournamentsDataItem.limitNumberPlayers}
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
                                                {formatTimestampVN(tournamentsDataItem.tournamentStartedTime)}
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
