import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Paper,
    Chip,
    Grid,
    IconButton,
    Tooltip,
} from '@mui/material';
import { useAlert } from 'context/AlertContext';
import MDBadge from 'components/MDBadge';
import MDBox from 'components/MDBox';
import { convertPriceVND } from 'utils';
import { convertTimeVN } from 'utils';
import MDButton from 'components/MDButton';
import billApi from 'api/billAPI';


const DetailBill = ({
    visible,
    onClose,
    data,
    isEdit = false,
}) => {
    const { showAlert } = useAlert();

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

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        showAlert("Copied Transaction ID", "success")
    };

    const handleConfirmBill = async () => {
        try {
            await billApi.confirmBill({ transactionId: data.transactionId });
            showAlert("Bill confirmed successfully", "success");
            if (typeof data.onUpdate === 'function') {
                data.onUpdate({
                    ...data,
                    status: "Paid",
                });
            }
            onClose();
        } catch (error) {
            console.error("Error confirming bill:", error);
            showAlert("Failed to confirm bill", "error");
        }
    }

    const handleCancelBill = async () => {
        try {
            await billApi.cancelBill({ billId: data._id });
            showAlert("Bill cancelled successfully", "success");
            if (typeof data.onUpdate === 'function') {
                data.onUpdate({
                    ...data,
                    status: "Cancelled",
                });
            }
            onClose();
        } catch (error) {
            console.error("Error cancelling bill:", error);
            showAlert("Failed to cancel bill", "error");
        }
    }

    return (
        <Dialog open={visible} onClose={onClose} maxWidth="sm" fullWidth >
            <DialogTitle>Detail Bill</DialogTitle>
            <DialogContent dividers>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {/* Sử dụng Grid container để căn chỉnh các item thẳng hàng */}
                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Transaction ID</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="inherit" sx={{ mr: 1 }}>
                                        {data.transactionId}
                                    </Typography>
                                    <Tooltip title="Copy">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleCopy(data.transactionId)}
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Created At</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="inherit">{convertTimeVN(data.createdAt)}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Email</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="inherit">{data.user.email}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Status</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <MDBox ml={-1}>
                                    <MDBadge
                                        badgeContent={data.status}
                                        color={getStatusColor(data.status)}
                                        variant="gradient"
                                        size="sm"
                                    />
                                </MDBox>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Plan</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="inherit">{data.plan.name + " - " + data.plan.type}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Action Plan</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="inherit">{data.action}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Payment Method</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="inherit">{data.paymentMethod.name}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Note</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="inherit">{data.note}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Original Price</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="inherit">
                                    {convertPriceVND(data.originalTotal, { showFull: true })}
                                </Typography>
                            </Grid>
                        </Grid>

                        {data.discount && <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Discount Code</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Chip
                                    label={data.discount.code}
                                    size="small"
                                    sx={{ mr: 1 }}
                                    color="primary"
                                />
                            </Grid>
                        </Grid>}

                        {data.discount &&
                            <Grid container alignItems="center">
                                <Grid item xs={4}>
                                    <Typography variant="body2">Discount</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="inherit" color={"red"}>
                                        {data.discount.type === 'percentage'
                                            ? `- ${convertPriceVND(data.originalTotal * data.discount.value)}`
                                            : `- ${convertPriceVND(data.discount.value)}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        }

                        <Grid container alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body2">Final Price</Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="inherit" color="green">
                                    {"+ " + convertPriceVND(data.finalTotal, { showFull: true })}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </DialogContent>
            <DialogActions sx={{ justifyContent: isEdit ? "space-between" : 'flex-end' }}>
                {/* Nhóm button bên trái */}
                {isEdit &&
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {(data.status === "Pending" || data.status === "WaitingPayment") && <MDButton variant="contained" color="error" size="small" onClick={handleCancelBill}>Cancel Bill</MDButton>}
                        {(data.status === "Pending" || data.status === "WaitingPayment" || data.status === "Failed") && <MDButton variant="contained" color="success" size="small" onClick={handleConfirmBill}>Confirm Bill</MDButton>}
                    </Box>
                }
                {/* Button đóng bên phải */}
                <Button
                    onClick={onClose}
                    variant="text"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default DetailBill;