import { useDebounce } from 'use-debounce';
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
import billApi from 'api/billAPI';
import MDBadge from 'components/MDBadge';
import MDButton from 'components/MDButton';
import DetailBill from './DetailBill';
import MDPagination from 'components/MDPagination';
import { convertTimeVN } from 'utils';
import { PAYMENT_METHODS } from 'config/constant';
import { convertPriceVND } from 'utils';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { STATUS_BILL } from 'config/constant';
import MasterCard from 'examples/Cards/MasterCard';
import DefaultInfoCard from 'examples/Cards/InfoCards/DefaultInfoCard';

function Tables() {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [model, setModel] = useState({
        visible: false,
        isEdit: false,
        bill: null
    });
    const [methods, setMethods] = useState([])
    const [currentMethod, setCurrentMethod] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPaidAmount, setTotalPaidAmount] = useState({
        totalAmount: 0,
        count: 0
    })

    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const handleChangeMethod = (event) => {
        setCurrentMethod(event.target.value);
    };
    const handleChangeStatus = (event) => {
        setCurrentStatus(event.target.value);
    };

    const fetchBills = async (page, limit) => {
        try {
            const response = await billApi.getAllBills({
                page: page,
                limit: limit,
            });
            setData(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Get All Bils
    useEffect(() => {
        fetchBills(pagination.page, pagination.limit);
    }, [pagination.page, pagination.limit]);

    // Get All payment methods
    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const response = await billApi.getPaymentMethod();
                setMethods(response.data)
                // if (response.data.length > 0) {
                //     setCurrentMethod(response.data[0]); // ✅ Set giá trị đầu tiên
                // }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        const fetchTotalPaidAmount = async () => {
            try {
                const response = await billApi.getTotalPaidAmount();
                setTotalPaidAmount({
                    totalAmount: response.data.totalAmount,
                    count: response.data.count
                })
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchMethods()
        fetchTotalPaidAmount()
    }, [])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: newPage }));
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Pending') {
            return 'infor';
        }
        if (status === 'WaitingPayment') {
            return 'warning';
        }
        if (status === 'Paid') {
            return 'success';
        }
        return 'error';
    };

    const getCurrentPaymentMethod = (paymentMethod) => {
        const foundMethod = PAYMENT_METHODS.find(
            method => method.name.toLowerCase() === paymentMethod.toLowerCase()
        );

        return foundMethod.image || {
            name: paymentMethod,
            image: (
                <div style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                    fontSize: '10px'
                }}>
                    N/A
                </div>
            )
        };
    };

    // Gọi search khi thay đổi filter
    useEffect(() => {
        const handleSearch = async (page, limit) => {
            try {
                const response = await billApi.searchAdvanced({
                    page,
                    limit,
                    transactionId: debouncedSearchTerm,
                    paymentMethod: currentMethod?._id || '',
                    status: currentStatus
                });
                setData(response.data.data);
                setPagination(response.data.pagination);
            } catch (error) {
                console.error('Search error:', error);
            }
        };

        // Kiểm tra điều kiện search trực tiếp
        const shouldSearch = !!currentStatus || !!currentMethod || !!debouncedSearchTerm;
        if (shouldSearch) {
            handleSearch(pagination.page, pagination.limit);
        }

    }, [debouncedSearchTerm, currentStatus, pagination.page, pagination.limit, currentMethod]);



    // Cập nhật các hàm xử lý input
    const handleSearchTermChange = (e) => {
        const val = e.target.value;
        if (val !== searchTerm) {
            setSearchTerm(val);
        }
    };

    const handelResetFillter = () => {
        setCurrentMethod("")
        setCurrentStatus("")
        setSearchTerm("")
        fetchBills(pagination.page, pagination.limit);
    }

    const rows = data.map((bill) => ({
        transactionId: (
            <MDTypography variant="button" color="text" fontWeight="medium">
                {bill.transactionId}
            </MDTypography>
        ),
        plan: (<MDTypography variant="button" color="text" fontWeight="medium">
            {bill.plan.name?.toUpperCase() + "-" + bill.plan.type?.toUpperCase() || 'N/A'}
        </MDTypography>
        ),
        status: (
            <MDBox ml={-1}>
                <MDBadge
                    badgeContent={bill.status}
                    color={getStatusColor(bill.status)}
                    variant="gradient"
                    size="sm"
                />
            </MDBox>
        ),
        paymentMethod: getCurrentPaymentMethod(bill.paymentMethod.name),
        createdAt: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {convertTimeVN(bill.createdAt)}
            </MDTypography>
        ),
        originalTotal: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {convertPriceVND(bill.originalTotal, { showFull: true })}
            </MDTypography>
        ),
        finalTotal: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {convertPriceVND(bill.finalTotal, { showFull: true })}
            </MDTypography>
        ),
        action: (
            <MDBox display="flex" justifyContent="flex-start" alignItems="center">
                <MDButton
                    variant="gradient"
                    color="info"
                    iconOnly
                    ml={1}
                    sx={{ mr: 1 }}
                    onClick={() => setModel({ visible: true, isEdit: false, bill: bill })}
                >
                    <InfoIcon />
                </MDButton>
                <MDButton
                    variant="gradient"
                    color="success"
                    iconOnly
                    onClick={() => setModel({ visible: true, isEdit: true, bill: bill })}
                >
                    <EditIcon />
                </MDButton>
            </MDBox>
        )
    }));

    const columns = [
        {
            Header: 'transaction Id',
            accessor: 'transactionId',
            align: 'center'
        },
        { Header: 'Plan', accessor: 'plan', align: 'center' },
        { Header: 'status', accessor: 'status', align: 'center' },
        { Header: 'paymentMethod', accessor: 'paymentMethod', align: 'center' },
        { Header: 'original price', accessor: 'originalTotal', align: 'center' },
        { Header: 'final price', accessor: 'finalTotal', align: 'center' },
        { Header: 'created at', accessor: 'createdAt', align: 'center' },
        { Header: 'action', accessor: 'action', align: 'center' }
    ];

    // Generate pagination items
    const paginationItems = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
        paginationItems.push(
            <MDPagination item key={i} active={i === pagination.page} onClick={() => handlePageChange(i)}>
                {i}
            </MDPagination>
        );
    }

    const isSearching = useMemo(() => {
        return !!currentStatus || !!currentMethod || !!searchTerm;
    }, [currentStatus, currentMethod, searchTerm]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12} xl={6}>
                        <MasterCard
                            number={103867444056}
                            holder="BUI QUANG DUC"
                            expires="11/22"
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <DefaultInfoCard
                            icon="account_balance"
                            title="salary"
                            description={totalPaidAmount.count + " bills"}
                            value={convertPriceVND(totalPaidAmount.totalAmount, { showFull: true })}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={3}>
                        <DefaultInfoCard
                            icon="paypal"
                            title="paypal"
                            description="Freelance Payment"
                            value="$455.00"
                        />
                    </Grid>

                </Grid>
                <Grid container spacing={6} sx={{
                    marginTop: "20px"
                }}>
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
                                    Bill List
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
                                <MDBox sx={{
                                    width: { xs: '100%', sm: 'auto' },
                                    minWidth: { sm: '200px' },
                                    flexGrow: { xs: 1, sm: 0 }
                                }}>
                                    <TextField
                                        fullWidth
                                        label="Search name..."
                                        size="small"
                                        value={searchTerm}
                                        onChange={handleSearchTermChange}
                                        sx={{
                                            width: { xs: '100%', sm: 'auto' },
                                            minWidth: { sm: '200px' },
                                        }}
                                    />
                                </MDBox>
                                {/* Payment Selector - Full width trên mobile */}
                                <MDBox sx={{
                                    width: { xs: '100%', sm: 'auto' },
                                    minWidth: { sm: '200px' },
                                    flexGrow: { xs: 1, sm: 0 }
                                }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Payment</InputLabel>
                                        <Select
                                            label="Payment"
                                            value={currentMethod || ''}
                                            onChange={handleChangeMethod}
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
                                                    {selected?.name || 'Select method'}
                                                </Box>
                                            )}
                                        >
                                            {methods.map((method) => (
                                                <MenuItem
                                                    key={method._id}
                                                    value={method}
                                                    sx={{ minWidth: '200px' }}
                                                >
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        width: '100%'
                                                    }}>
                                                        <MDTypography variant="button" color="black">
                                                            {method.name}
                                                        </MDTypography>
                                                        {method.isActive ? (
                                                            <DoneIcon color="success" sx={{ ml: 2 }} />
                                                        ) : (
                                                            <ClearIcon color="error" sx={{ ml: 2 }} />
                                                        )}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </MDBox>
                                {/* Status Selector - Full width trên mobile */}
                                <MDBox sx={{
                                    width: { xs: '100%', sm: 'auto' },
                                    minWidth: { sm: '200px' },
                                    flexGrow: { xs: 1, sm: 0 }
                                }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            label="Status"
                                            value={currentStatus || ''}
                                            onChange={handleChangeStatus}
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
                                                    {selected || 'Select Status'}
                                                </Box>
                                            )}
                                        >
                                            {STATUS_BILL.map((status) => (
                                                <MenuItem
                                                    key={status}
                                                    value={status}
                                                    sx={{ minWidth: '200px' }}
                                                >
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        width: '100%'
                                                    }}>
                                                        <MDTypography variant="button" color="black">
                                                            {status}
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
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={true}
                                    isLoading={true}
                                    entriesPerPage={false}
                                    showTotalEntries={true}
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
                <DetailBill
                    visible={model.visible}
                    isEdit={model.isEdit}
                    data={{
                        ...model.bill,
                        onUpdate: (updateData) => {
                            // Cập nhật cả model.user
                            setModel(prev => ({
                                ...prev,
                                bill: {
                                    ...prev.bill,
                                    ...updateData
                                }
                            }));

                            // Cập nhật danh sách users
                            setData((preDatas) =>
                                preDatas.map((u) =>
                                    u._id === updateData._id ? { ...u, ...updateData } : u
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
