import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Typography,
    Select,
    MenuItem,
    Switch,
    Button,
    Box,
    Paper,
} from '@mui/material';
import userAPI from 'api/userAPI';
import { useAlert } from 'context/AlertContext';

const roles = ['admin', 'user'];

const DetailUser = ({
    visible,
    onClose,
    user,
    isEdit = false,
}) => {
    const { showAlert } = useAlert();
    const [role, setRole] = useState('');
    const [disabled, setDisabled] = useState(false);

    const handleRoleChange = async (event) => {
        try {
            const response = await userAPI.setRoleUser({
                userId: user._id,
                role: event.target.value,
            });
            showAlert(`Vai trò người dùng đã được cập nhật thành ${response.data.role}`, 'success');
            setRole(response.data.role);
            if (typeof user.onUpdate === 'function') {
                user.onUpdate({
                    ...user,
                    role: response.data.role,
                });
            }
        } catch (error) {
            showAlert(error.response?.data?.message || 'Lỗi khi cập nhật vai trò người dùng', 'error');
        }
    };

    const handleDisableChange = async (event) => {
        try {
            const response = await userAPI.toggleBanUser({
                userId: user._id,
                isBan: event.target.checked,
            });
            setDisabled(response.data.isDisabled);
            showAlert(`Trạng thái người dùng đã được cập nhật thành ${response.data.isDisabled ? 'bị vô hiệu hóa' : 'hoạt động'}`, 'success');
            // Cập nhật trạng thái user bên ngoài (nếu có hàm callback)
            if (typeof user.onUpdate === 'function') {
                user.onUpdate({
                    ...user,
                    isDisabled: response.data.isDisabled,
                });
            }

        } catch (error) {
            showAlert(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái người dùng', 'error');
        }
    };


    useEffect(() => {
        if (user) {
            setRole(user.role || '');
            setDisabled(user.isDisabled || false);
        }
    }, [user]);



    return (
        <Dialog open={visible} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thông tin người dùng</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Avatar
                        src={user?.avatar.url}
                        sx={{ width: 120, height: 120, mb: 2 }}
                    />
                </Box>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ minWidth: 100 }}>Full name</Typography>
                            <Typography variant="inherit" sx={{ ml: 2 }}>{user?.fullName}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ minWidth: 100 }}>Email</Typography>
                            <Typography variant="inherit" sx={{ ml: 2 }}>{user?.email}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ minWidth: 100 }}>Role</Typography>
                            <Select
                                value={roles.includes(role) ? role : ''}
                                onChange={handleRoleChange}
                                fullWidth
                                size="small"
                                sx={{ padding: "8px", ml: 2 }}
                                disabled={!isEdit}
                            >
                                {roles.map((r) => (
                                    <MenuItem key={r} value={r}>
                                        {r}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography variant="body2" sx={{ minWidth: 100 }}>Disable</Typography>
                            <Switch
                                checked={disabled}
                                onChange={handleDisableChange}
                                color="primary"
                                disabled={!isEdit}
                                sx={{ ml: 1 }}
                            />
                        </Box>
                    </Box>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Đóng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DetailUser;