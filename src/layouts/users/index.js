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
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { ROLE_ACCOUNT } from 'config/constant';

function Tables() {
    const [users, setUsers] = useState([]);
    const [textSearch, setTextSearch] = useState("")
    const [currentRole, setCurrentRole] = useState('');
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

    const fetchUsers = async (page, limit) => {
        try {
            const response = await userAPI.getAllAccounts({
                page: page,
                limit: limit,
            });

            setUsers(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        const handleSearch = async () => {
            try {
                const response = await userAPI.searchAdvanced({
                    page: pagination.page,
                    limit: pagination.limit,
                    name: debouncedSearchText,
                    role: currentRole
                });
                setUsers(response.data.data);
                setPagination(response.data.pagination);
            } catch (error) {
                console.error('Search error:', error);
            }
        };

        const shouldSearch = !!currentRole || !!debouncedSearchText;
        if (shouldSearch) {
            handleSearch();
        } else {
            fetchUsers(pagination.page, pagination.limit);
        }
    }, [debouncedSearchText, pagination.page, pagination.limit, currentRole]);



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
        role: (
            <MDTypography variant="button" color="text" fontWeight="medium">
                {user?.role?.toUpperCase() || 'N/A'}
            </MDTypography>
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
            Header: 'user',
            accessor: 'user',
            width: '10%',
            align: 'left'
        },
        { Header: 'code', accessor: 'code', align: 'center' },
        { Header: 'role', accessor: 'role', align: 'center' },
        { Header: 'active', accessor: 'isDisabled', align: 'center' },
        { Header: 'created at', accessor: 'createdAt', align: 'center' },
        { Header: 'action', accessor: 'action', align: 'center' }
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

    // useEffect(() => {
    //     const handleSearch = async () => {
    //         try {
    //             const newPagination = { ...pagination, page: 1 };
    //             setPagination(newPagination);

    //             const response = await userAPI.searchAdvanced({
    //                 ...newPagination,
    //                 name: debouncedSearchText,
    //                 role: currentRole
    //             });
    //             setUsers(response.data.data);
    //             setPagination(response.data.pagination);
    //         } catch (error) {
    //             console.error('Search error:', error);
    //         }
    //     };

    //     // Kiểm tra điều kiện search trực tiếp
    //     const shouldSearch = !!currentRole || !!debouncedSearchText;
    //     if (shouldSearch) {
    //         handleSearch();
    //     }

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [debouncedSearchText, pagination.page, pagination.limit, currentRole]);


    const handleChangeRole = (event) => {
        setCurrentRole(event.target.value);
    };

    const isSearching = useMemo(() => {
        return !!currentRole || !!textSearch;
    }, [currentRole, textSearch]);

    const handelResetFillter = () => {
        setCurrentRole("")
        setTextSearch("")
        fetchUsers(pagination.page, pagination.limit);
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
                                    Users List
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
                                    label="Search name..."
                                    size="small"
                                    value={textSearch}
                                    onChange={handleSearchText}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        minWidth: { sm: '200px' },
                                    }}
                                />
                                {/* Payment Selector - Full width trên mobile */}
                                <MDBox sx={{
                                    width: { xs: '100%', sm: 'auto' },
                                    minWidth: { sm: '200px' },
                                    flexGrow: { xs: 1, sm: 0 }
                                }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            label="Role"
                                            value={currentRole || ''}
                                            onChange={handleChangeRole}
                                            sx={{
                                                '& .MuiSelect-select': {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                },
                                                padding: "8px"
                                            }}
                                            renderValue={(selected) => (
                                                <Box component="span" sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: 'inline-block',
                                                    width: '100%'
                                                }}>
                                                    {selected || 'Select method'}
                                                </Box>
                                            )}
                                        >
                                            {ROLE_ACCOUNT.map((role) => (
                                                <MenuItem
                                                    key={role}
                                                    value={role}
                                                    sx={{ minWidth: '200px' }}
                                                >
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        width: '100%'
                                                    }}>
                                                        <MDTypography variant="button" color="black">
                                                            {role}
                                                        </MDTypography>

                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </MDBox>

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
