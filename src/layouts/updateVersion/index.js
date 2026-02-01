import { useEffect, useRef, useState } from "react";
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField
} from "@mui/material";


import MDButton from "components/MDButton";
import MDBox from 'components/MDBox';
import { useAlert } from 'context/AlertContext';
import { io } from "socket.io-client";


const UpdateVersion = ({ open, handleClose }) => {
    const WS_URL = process.env.REACT_APP_WS_URL;

    const socketRef = useRef(null);

    const { showAlert } = useAlert();
    const [wsResponse, setWsResponse] = useState(null);
    const [newVersion, setNewVersion] = useState("");

    useEffect(() => {
        if (!open) return;

        const socket = io(WS_URL, {
            path: "/socket.io",
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("🔌 Socket connected");
            socket.emit("GET_CONFIG_VERSIONS");
        });

        socket.on("GET_CONFIG_VERSIONS", (data) => {
            console.log("📦 Version data:", data);
            setWsResponse(data);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });

        socket.on("connect_error", (err) => {
            console.error("❌ WS error", err.message);
        });

        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);





    const handleSubmit = () => {
        if (!newVersion) {
            showAlert("Vui lòng nhập phiên bản mới", "error");
            return;
        }

        if (newVersion === wsResponse?.currentVersion) {
            showAlert("Phiên bản mới không được trùng với phiên bản hiện tại", "error");
            return;
        }
        const socket = socketRef.current;
        if (!socket || !socket.connected) {
            showAlert("WebSocket chưa sẵn sàng", "error");
            return;
        }

        socket.emit("TESTING_SET_CLIENT_VERSION", { version: newVersion });

        showAlert("Đã gửi yêu cầu cập nhật phiên bản", "success");
        handleClose();
    };


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>Thay đổi phiên bản</DialogTitle>

            <DialogContent sx={{ pt: 4 }}>
                <DialogContentText>
                    <MDBox>
                        <TextField
                            disabled
                            value={wsResponse?.clientVersion || "Not found version"}
                            label="Phiên bản hiện tại"
                            fullWidth
                            margin="normal"
                        />

                        <div style={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <IconButton disableRipple>
                                <Icon sx={{ fontSize: 15, color: "gray" }}>
                                    arrow_downward
                                </Icon>
                            </IconButton>
                        </div>

                        <TextField
                            label="Phiên bản mới"
                            fullWidth
                            margin="normal"
                            value={newVersion}
                            onChange={(e) => setNewVersion(e.target.value)}
                        />


                    </MDBox>
                </DialogContentText>

                <DialogActions>
                    <MDButton onClick={handleClose} color="error">
                        Hủy
                    </MDButton>
                    <MDButton color="success" onClick={handleSubmit}>
                        Cập nhật
                    </MDButton>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateVersion;
