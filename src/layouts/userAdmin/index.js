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
import adminAPI from 'api/adminAPI';
import MDBadge from 'components/MDBadge';
import MDButton from 'components/MDButton';
import MDPagination from 'components/MDPagination';
import { convertTimeVN } from 'utils';
import { Switch, TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { useAuth } from 'context/AuthContext';
import MDAvatar from 'components/MDAvatar';
import ModalConfirm from './ModalConfirm';
import { useAlert } from 'context/AlertContext';
import ModalRegister from './ModalRegister';
import authAPI from 'api/authAPI';

function AccountsAdmin() {
    const { user } = useAuth();
    const { showAlert } = useAlert();

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


    const [openConfirm, setOpenConfirm] = useState({
        isOpen: false,
        user: null
    });

    const [openRegister, setOpenRegister] = useState({
        isOpen: false,
        data: {
            fullName: "",
            username: "",
            password: "",
        }
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

            const response = await adminAPI.getAllAccounts(params);

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

    const handelBanUnBan = async () => {
        try {
            if (!openConfirm.user) {
                showAlert("Không tìm thấy user này", "error")
            }
            const data = await adminAPI.toggleBanUser({ _id: openConfirm.user._id });
            showAlert(
                data.data.isDisabled ? "Ban user thành công!" : "Gỡ ban user thành công!", ""
            );
            fetchData()
        } catch (error) {
            showAlert(error.message, "error")
        }
    }

    const handelRegister = async (data) => {
        try {
            const res = await authAPI.register(data);
            if (res.success) {
                showAlert("Tạo tài khoản thành công!")
                setOpenRegister({ isOpen: false, data: { fullName: "", username: "", password: "" } })
                fetchData();
                return
            }
            showAlert(res.message, "error")
        } catch (error) {
            showAlert(error.message, "error")
        }

    }

    const rows = users.map((u) => ({
        _id: (
            <MDTypography variant="button" color={u._id === user._id ? "primary" : "text"} fontWeight="medium">
                {u._id || 'N/A'}
            </MDTypography>
        ),

        role: (
            <MDBox ml={-1}>
                <MDBadge
                    badgeContent={u.role}
                    color={u.role === "admin" ? 'primary' : 'secondary'}
                    variant="gradient"
                    size="sm"
                />
            </MDBox>
        ),

        user: (
            <MDBox display="flex" alignItems="center" lineHeight={1}>
                <MDAvatar
                    src={u?.avatar || ""}
                    alt="Avatar"
                    size="xs"
                    sx={{
                        bgcolor: !u?.avatar ? "primary.main" : undefined,
                        pt: 0.3
                    }}
                >
                    {!u?.avatar && u?.username?.charAt(0).toUpperCase()}
                </MDAvatar>

                <MDBox ml={2} lineHeight={1}>
                    <MDTypography
                        display="block"
                        variant="button"
                        fontWeight="medium">
                        {u.fullName}
                    </MDTypography>
                    <MDTypography variant="caption">{u.username}</MDTypography>
                </MDBox>
            </MDBox>
        ),
        isDisabled: (
            <MDBox ml={-1}>
                <Switch checked={!u.isDisabled} onClick={() => setOpenConfirm({
                    user: u,
                    isOpen: true
                })} />
            </MDBox>
        ),
        createdAt: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {convertTimeVN(u.createdTime)}
            </MDTypography>
        ),
        lastedLogin: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {convertTimeVN(u.lastedLogin)}
            </MDTypography>
        ),
        action: (
            <MDBox display="flex" justifyContent="flex-start" alignItems="center">
                <MDButton
                    variant="gradient"
                    color="info"
                    ml={1}
                    sx={{ mr: 1 }}
                // onClick={() => setModel({ visible: true, isEdit: false, user: user })}
                >
                    <InfoIcon />
                </MDButton>
                <MDButton
                    variant="gradient"
                    color="success"
                // onClick={() => setModel({ visible: true, isEdit: true, user: user })}
                >
                    <EditIcon />
                </MDButton>
            </MDBox>
        )
    }));

    const columns = [
        { Header: 'code', accessor: '_id', align: 'center', width: "10%" },
        {
            Header: 'Tên',
            accessor: 'user',
            align: 'left'
        },
        { Header: 'Role', accessor: 'role', align: 'center' },
        { Header: 'Hoạt động', accessor: 'isDisabled', align: 'center' },
        { Header: 'Ngày tạo tài khoản', accessor: 'createdAt', align: 'center' },
        { Header: 'Lần hoạt động cuổi', accessor: 'lastedLogin', align: 'center' },
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
                                    Danh sách tài khoản
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
                                    justifyContent: 'space-between',
                                    width: '100%', // Luôn chiếm full width cha
                                }}
                            >
                                {/* Search Input - Full width trên mobile */}
                                <MDBox
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 2,
                                    }}
                                >
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
                                <MDButton variant="gradient" color="primary" size="small" onClick={() => setOpenRegister({
                                    isOpen: true, data: {
                                        fullName: "",
                                        username: "",
                                        password: "",
                                    }
                                })}>
                                    Tạo Tài khoản
                                </MDButton>
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
            <ModalConfirm open={openConfirm} setOpen={setOpenConfirm} handleBanUnban={handelBanUnBan} />
            <ModalRegister open={openRegister} setOpen={setOpenRegister} handelRegister={handelRegister} />
        </DashboardLayout>
    );
}

export default AccountsAdmin;
