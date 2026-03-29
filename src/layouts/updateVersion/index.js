import { useEffect, useState } from "react";
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

import MDButton from "components/MDButton";
import MDBox from 'components/MDBox';
import { useAlert } from 'context/AlertContext';
import adminAPI from "api/adminAPI";
import MDDialog from "components/MDDialog";
import MDInput from "components/MDInput";


const UpdateVersion = ({ open, handleClose }) => {

    const { showAlert } = useAlert();
    const [oldVersion, setOldVersion] = useState("");
    const [newVersion, setNewVersion] = useState("");

    const fetchData = async () => {
        const result = await adminAPI.getVersionClient();
        setOldVersion(result.data.version);
    }

    useEffect(() => {
        if (open) fetchData()
    }, [open])

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
        <MDDialog
            open={open}
            onClose={handleClose}
            title="Thay đổi phiên bản"
            content={
                <MDBox>
                    <MDInput
                        value={oldVersion || "Not found version"}
                        label="Phiên bản hiện tại"
                        fullWidth
                    />

                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <IconButton disableRipple>
                            <Icon sx={(theme) => ({ fontSize: 15, color: theme.palette.text.secondary })}>
                                arrow_downward
                            </Icon>
                        </IconButton>
                    </div>

                    <MDInput
                        label="Phiên bản mới"
                        fullWidth
                        value={newVersion}
                        onChange={(e) => setNewVersion(e.target.value)}
                    />
                </MDBox>
            }
            actions={
                <>
                    <MDButton onClick={handleClose} color="error">
                        Hủy
                    </MDButton>
                    <MDButton color="success" onClick={handleSubmit}>
                        Cập nhật
                    </MDButton>
                </>
            }
        />
    );
};

export default UpdateVersion;
