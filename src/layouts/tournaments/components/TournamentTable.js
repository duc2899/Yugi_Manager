import { Chip, CircularProgress, Stack } from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "react-router-dom";


import MDBox from "components/MDBox";
import MDTypography from 'components/MDTypography';
import MDPagination from 'components/MDPagination';
import { formatTimestampVN } from "utils";
import { getStatusInfo } from "utils";


const TournamentTable = ({ data, pagination, setPagination, loading }) => {
    const navigate = useNavigate();

    // Generate pagination items
    const paginationItems = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
        paginationItems.push(
            <MDPagination item key={i} active={i === pagination.page} onClick={() => handlePageChange(i)}>
                {i}
            </MDPagination>
        );
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

    const goToDetail = (id) => {
        navigate(`/tournaments/${id}`);
    };
    return (
        <>
            {
                loading ? (
                    <MDBox sx={{
                        borderRadius: '8px',
                        p: 6,
                        textAlign: 'center',
                        height: 'fit-content',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <CircularProgress
                            size={50}
                            thickness={3}
                            sx={{
                                color: "primary.main",
                                "& .MuiCircularProgress-circle": {
                                    strokeLinecap: "round",
                                },
                            }}
                        />
                    </MDBox>
                ) : data.length === 0 ? (
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
                ) : <div style={{ display: 'grid', gridAutoRows: 'auto', gridTemplateColumns: 'repeat(auto-fit, minmax(620px, 1fr))', gap: '10px', maxHeight: "600px", overflowY: "scroll" }} >
                    {data.map((tournamentsDataItem) => ((
                        <MDBox
                            key={tournamentsDataItem._id}
                            sx={{
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
                                    <Chip label={getStatusInfo(tournamentsDataItem.status, "name")} variant="filled" sx={{
                                        backgroundColor: getStatusInfo(tournamentsDataItem.status, "color"),
                                        color: "#fff"
                                    }} />
                                    <Chip label={tournamentsDataItem.type} variant="outlined" />
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
                                    variant="body2" component="p" color="#1976d2" sx={{ cursor: 'pointer' }} onClick={() => goToDetail(tournamentsDataItem._id)}>
                                    Xem chi tiết
                                </MDTypography>
                            </MDBox>

                        </MDBox>
                    )))}
                </div>
            }
            <MDBox display="flex" justifyContent="center" mt={2}>
                <MDPagination size="small">
                    <MDPagination item onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
                        <KeyboardArrowLeftIcon />
                    </MDPagination>
                    {paginationItems}
                    <MDPagination item onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>
                        <KeyboardArrowRightIcon />
                    </MDPagination>
                </MDPagination>
            </MDBox>
        </>
    )
}

export default TournamentTable;