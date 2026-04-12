import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import DataTable from 'examples/Tables/DataTable';
// Data
import { useEffect, useMemo, useState } from 'react';
import userAPI from 'api/userAPI';
import MDAvatar from 'components/MDAvatar';
import MDBadge from 'components/MDBadge';
import MDButton from 'components/MDButton';
import DetailUser from './DetailUser';
import MDPagination from 'components/MDPagination';
import { convertTimeVN } from 'utils';
import { TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';

function Tables() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [textSearch, setTextSearch] = useState("")
    const [debouncedSearchText] = useDebounce(textSearch, 500);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [model, setModel] = useState({
        visible: false,
        isEdit: false,
        user: null
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
            };
            if (debouncedSearchText) {
                params.key = debouncedSearchText.trim();
            }

            const response = await userAPI.getAllAccounts(params);

            setUsers(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, pagination.limit, debouncedSearchText]);


    const rows = users.map((user) => ({
        code: (
            <MDTypography variant="button" color="text" fontWeight="medium">
                {user?.code || 'N/A'}
            </MDTypography>
        ),

        user: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
                <MDAvatar src={user.avatarImage} name={user.displayName} size="sm" />
                <MDBox ml={2} lineHeight={1}>
                    <MDTypography
                        display="block"
                        variant="button"
                        fontWeight="medium">
                        {user.displayName}
                    </MDTypography>
                    <MDTypography variant="caption">{user.username}</MDTypography>
                </MDBox>
            </MDBox>
        ),
        isDisabled: (
            <MDBox ml={-1}>
                <MDBadge
                    badgeContent={user.status === 'ACTIVED' ? 'Yes' : 'No'}
                    color={user.status === 'ACTIVED' ? 'success' : 'error'}
                    variant="gradient"
                    size="sm"
                />
            </MDBox>
        ),
        createdAt: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {convertTimeVN(user.createdTime)}
            </MDTypography>
        ),
        action: (
            <MDBox display="flex" justifyContent="flex-start" alignItems="center">
                <MDButton
                    variant="gradient"
                    color="info"
                    ml={1}
                    sx={{ mr: 1 }}
                    onClick={() => setModel({ visible: true, isEdit: false, user: user })}
                >
                    <InfoIcon />
                </MDButton>
                <MDButton
                    variant="gradient"
                    color="success"
                    onClick={() => setModel({ visible: true, isEdit: true, user: user })}
                >
                    <EditIcon />
                </MDButton>
            </MDBox>
        )
    }));

    const columns = [
        {
            Header: 'Người chơi',
            accessor: 'user',
            width: '10%',
            align: 'left'
        },
        { Header: 'code', accessor: 'code', align: 'center' },
        { Header: 'Hoạt động', accessor: 'isDisabled', align: 'center' },
        { Header: 'Ngày tạo tài khoản', accessor: 'createdAt', align: 'center' },
        { Header: 'Hành động', accessor: 'action', align: 'center' }
    ];

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

    // Generate pagination items
    const paginationItems = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
        paginationItems.push(
            <MDPagination item key={i} active={i === pagination.page} onClick={() => handlePageChange(i)}>
                {i}
            </MDPagination>
        );
    }

    const handleSearchText = (e) => {
        const val = e.target.value;
        if (val !== textSearch) {
            setTextSearch(val);
        }
    }

    const isSearching = useMemo(() => {
        return !!textSearch;
    }, [textSearch]);

    const handelResetFillter = () => {
        setTextSearch("")
        fetchData();
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info">
                                <MDTypography variant="h6" color="white">
                                    Danh sách người chơi
                                </MDTypography>
                            </MDBox>
                            <MDBox
                                mt={3}
                                py={1}
                                px={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2,
                                    width: '100%', // Luôn chiếm full width cha
                                }}
                            >
                                {/* Search Input - Full width trên mobile */}
                                <TextField
                                    fullWidth
                                    label="Tìm kiếm tên hoặc Code"
                                    size="small"
                                    value={textSearch}
                                    onChange={handleSearchText}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        minWidth: { sm: '200px' },
                                    }}
                                />

                                {isSearching &&
                                    <MDBox sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        minWidth: { sm: '200px' },
                                        flexGrow: { xs: 1, sm: 0 }
                                    }}>
                                        <MDButton variant="gradient" color="error" size="small" onClick={handelResetFillter} fullWidth>Reset</MDButton>
                                    </MDBox>
                                }
                            </MDBox>
                            <MDBox
                                pt={3}
                                sx={{
                                    maxHeight: "60vh",
                                    overflowY: "auto",
                                }}
                            >
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                    loading={loading}
                                />
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
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
            </MDBox>
            <Footer />
            {model.visible &&
                <DetailUser
                    visible={model.visible}
                    isEdit={model.isEdit}
                    user={{
                        ...model.user,
                        onUpdate: (updatedUser) => {
                            // Cập nhật cả model.user
                            setModel(prev => ({
                                ...prev,
                                user: {
                                    ...prev.user,
                                    ...updatedUser
                                }
                            }));

                            // Cập nhật danh sách users
                            setUsers((prevUsers) =>
                                prevUsers.map((u) =>
                                    u._id === updatedUser._id ? { ...u, ...updatedUser } : u
                                )
                            );
                        }
                    }}
                    onClose={() => setModel({
                        visible: false,
                        isEdit: false,
                        user: null
                    })}
                />
            }
        </DashboardLayout>
    );
}

export default Tables;
