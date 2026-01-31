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


const UpdateVersion = ({ open, handleClose }) => {
    const WS_URL = process.env.REACT_APP_WS_URL;

    const wsRef = useRef(null);

    const { showAlert } = useAlert();
    const [wsResponse, setWsResponse] = useState(null);
    const [newVersion, setNewVersion] = useState("");

    useEffect(() => {
        if (!open) return;

        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {

            ws.send(JSON.stringify({
                id: "GET_CONFIG_VERSIONS"
            }));
        };

        ws.onmessage = (event) => {
            try {
                const res = JSON.parse(event.data);

                if (res.id === "GET_CONFIG_VERSIONS") {
                    setWsResponse(res.data);
                }
            } catch (e) {
                console.error("❌ parse error", e);
            }
        };

        ws.onerror = (err) => {
            console.error("❌ WS error", err);
        };

        ws.onclose = () => {
            console.log("🔌 WS closed");
        };

        return () => {
            ws.close();
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

        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            showAlert("WebSocket chưa sẵn sàng", "error");
            return;
        }

        const payload = {
            id: "TESTING_SET_CLIENT_VERSION",
            data: {
                version: newVersion
            }
        };

        wsRef.current.send(JSON.stringify(payload));

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
                            label="Phiên bản hiện mới"
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
