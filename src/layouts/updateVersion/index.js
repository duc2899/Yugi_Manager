import { useEffect, useState } from "react";
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
import adminAPI from "api/adminAPI";


const UpdateVersion = ({ open, handleClose }) => {

    const { showAlert } = useAlert();
    const [oldVersion, setOldVersion] = useState("");
    const [newVersion, setNewVersion] = useState("");

    const fetchData = async () => {
        const result = await adminAPI.getVersionClient();
        setOldVersion(result.data.version);
    }
    useEffect(() => {
        fetchData()
    }, [])

    const handleSubmit = async () => {
        if (!newVersion) {
            showAlert("Vui lòng nhập phiên bản mới", "error");
            return;
        }
        try {
            await adminAPI.setVersionClient({ version: newVersion });
            showAlert("Đã gửi yêu cầu cập nhật phiên bản", "success");
            handleClose();
        } catch (error) {            
            showAlert(error.errors[0].message, "error");
        }
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
                            value={oldVersion || "Not found version"}
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
