import { useState } from "react";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDDialog from "components/MDDialog";
import MDTypography from "components/MDTypography";
import { useAlert } from 'hooks/useAlert';

const ModalConfirm = ({ open, setOpen, handleBanUnban, user }) => {
    const { showAlert } = useAlert();

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            if (!user) {
                return showAlert("Vui lòng đăng nhập", "error")
            }

            if (user._id === open.user._id) {
                return showAlert("Không thể tự ban chính mình", "error")
            }
            setLoading(true);
            await handleBanUnban(open.user);
            setOpen({ isOpen: false, user: null });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MDDialog
            open={open.isOpen}
            onClose={() => !loading && setOpen({ isOpen: false, user: null })}
            title={open.user?.isDisabled ? "Gỡ ban người dùng" : "Ban người dùng"}
            content={
                <MDBox>
                    <MDTypography variant="body2" color="text">
                        Bạn có chắc chắn muốn{" "}
                        <b>{open.user?.isDisabled ? "gỡ ban" : "ban"}</b>{" "}
                        user <b>{open.user?.username}</b> không?
                    </MDTypography>

                    <MDTypography variant="caption" color="text" sx={{ mt: 1, display: "block" }}>
                        {open.user?.isDisabled
                            ? "User sẽ có thể đăng nhập và hoạt động lại bình thường."
                            : "User sẽ bị khóa và không thể đăng nhập hoặc tham gia hoạt động."}
                    </MDTypography>
                </MDBox>
            }
            actions={
                <>
                    <MDButton
                        variant="outlined"
                        color="secondary"
                        disabled={loading}
                        onClick={() => setOpen({ isOpen: false, user: null })}
                    >
                        Hủy
                    </MDButton>

                    <MDButton
                        color={open.user?.isDisabled ? "success" : "error"}
                        variant="gradient"
                        loading={loading}
                        disabled={loading}
                        onClick={handleConfirm}
                    >
                        {open.user?.isDisabled ? "Gỡ ban" : "Ban"}
                    </MDButton>
                </>
            }
        />
    );
};

export default ModalConfirm;