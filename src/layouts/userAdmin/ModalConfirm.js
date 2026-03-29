import MDBox from "components/MDBox"
import MDButton from "components/MDButton"
import MDDialog from "components/MDDialog"
import MDTypography from "components/MDTypography"


const ModalConfirm = ({ open, setOpen, handleBanUnban }) => {
    return (
        <MDDialog
            open={open.isOpen}
            onClose={() => setOpen({ isOpen: false, user: null })}
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
                        onClick={() => setOpen({ isOpen: false, user: null })}
                    >
                        Hủy
                    </MDButton>

                    <MDButton
                        color={open.user?.isDisabled ? "success" : "error"}
                        variant="gradient"
                        onClick={handleBanUnban}
                    >
                        {open.user?.isDisabled ? "Gỡ ban" : "Ban"}
                    </MDButton>
                </>
            }
        />
    )
}


export default ModalConfirm