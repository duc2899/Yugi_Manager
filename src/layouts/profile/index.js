import { useState, useRef, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import { Icon, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import authAPI from "api/authAPI";
import { useAlert } from "hooks/useAlert";
import { useForm } from "react-hook-form";
import MDInput from "components/MDInput";

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const [showPasswords, setShowPasswords] = useState({
        old: false, new: false, confirm: false,
    });
    const [changingPass, setChangingPass] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset: resetPassForm,
        formState: { errors },
    } = useForm({
        defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    });
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await authAPI.getProfile(); // thay bằng API thực tế
                setUser(res.data);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewAvatar(URL.createObjectURL(file));
    };

    const handleCancel = () => {
        setPreviewAvatar(null);
        setSelectedFile(null);
        fileInputRef.current.value = "";
    };

    const handleSave = async () => {
        if (!selectedFile) return;
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append("avatar", selectedFile);
            const res = await authAPI.uploadAvatar(formData); // thay bằng API thực tế
            setUser(res.data);
            setPreviewAvatar(null);
            setSelectedFile(null);
        } catch (error) {
            showAlert(error.userMessage || "Upload avatar thất bại", "error");
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    };

    const toggleShow = (field) =>
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

    const onChangePassword = async (data) => {
        try {
            setChangingPass(true);
            await authAPI.changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            showAlert("Đổi mật khẩu thành công", "success");
            resetPassForm();
        } catch (error) {
            showAlert(error.userMessage || "Đổi mật khẩu thất bại", "error");
        } finally {
            setChangingPass(false);
        }
    };

    const passwordField = (name, label, showKey) => (
        <MDBox>
            <MDInput
                label={label}
                type={showPasswords[showKey] ? "text" : "password"}
                fullWidth
                helperText={errors[name]?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => toggleShow(showKey)} edge="end" size="small" sx={{ color: "inherit" }}>
                                <Icon sx={{ fontSize: 18 }}> 
                                    {showPasswords[showKey] ? "visibility_off" : "visibility"}
                                </Icon>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                {...register(name, {
                    required: `Vui lòng nhập ${label.toLowerCase()}`,
                    ...(name === "newPassword" && {
                        minLength: { value: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
                    }),
                    ...(name === "confirmPassword" && {
                        validate: (val) =>
                            val === watch("newPassword") || "Mật khẩu xác nhận không khớp",
                    }),
                })}
            />
        </MDBox>
    );

    const isAdmin = user?.role === "admin";

    if (loading) return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </MDBox>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox sx={{ maxWidth: 900, margin: "2rem auto", px: 2 }}>

                {/* Avatar + tên — center */}
                <MDBox sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, mb: 4 }}>
                    <MDBox sx={{ position: "relative" }}>
                        <MDAvatar
                            src={previewAvatar || user?.avatar}
                            alt={user?.fullName}
                            sx={{ width: 96, height: 96, fontSize: 32 }}
                        >
                            {!user?.avatar && user?.fullName?.charAt(0).toUpperCase()}
                        </MDAvatar>
                        <MDBox
                            onClick={() => fileInputRef.current.click()}
                            sx={{
                                position: "absolute", bottom: 0, right: 0,
                                width: 28, height: 28, borderRadius: "50%",
                                bgcolor: "background.paper",
                                border: "1px solid", borderColor: "divider",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "grey.100" },
                            }}
                        >
                            <Icon sx={{ fontSize: 16 }}>photo_camera</Icon>
                        </MDBox>
                        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
                    </MDBox>

                    <MDTypography variant="h5" fontWeight="medium">{user?.fullName}</MDTypography>
                    <MDTypography variant="body2" color="text">@{user?.username}</MDTypography>

                    <MDBox
                        sx={{
                            display: "inline-flex", alignItems: "center", gap: 0.5,
                            px: 1.5, py: 0.5, borderRadius: 2,
                            bgcolor: isAdmin ? "rgba(83,74,183,0.12)" : "grey.200",
                            color: isAdmin ? "#3C3489" : "text.secondary",
                        }}
                    >
                        <Icon sx={{ fontSize: 15 }}>{isAdmin ? "shield" : "person"}</Icon>
                        <MDTypography variant="caption" fontWeight="medium" sx={{ color: "inherit" }}>
                            {isAdmin ? "Admin" : "Normal"}
                        </MDTypography>
                    </MDBox>

                    {/* Save/Cancel avatar */}
                    {previewAvatar && (
                        <MDBox sx={{ display: "flex", gap: 1 }}>
                            <MDButton size="small" onClick={handleCancel} disabled={saving}>Hủy</MDButton>
                            <MDButton size="small" color="info" onClick={handleSave} loading={saving}>Lưu ảnh</MDButton>
                        </MDBox>
                    )}
                </MDBox>

                {/* 2 cột */}
                <MDBox sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>

                    {/* Trái — Thông tin */}
                    <MDBox sx={{ flex: 1, borderRight: "0.5px solid", borderColor: "divider", pr: 3 }}>
                        <MDTypography variant="h6" fontWeight="medium" mb={2}>
                            Thông tin tài khoản
                        </MDTypography>
                        <MDBox sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            {[
                                { icon: "person_outline", label: "Họ tên", value: user?.fullName },
                                { icon: "schedule", label: "Đăng nhập lần cuối", value: formatDate(user?.lastedLogin) },
                                { icon: "calendar_today", label: "Ngày tạo", value: formatDate(user?.createdTime) },
                                {
                                    icon: user?.isDisabled ? "block" : "check_circle",
                                    label: "Trạng thái",
                                    value: (
                                        <MDBox
                                            sx={{
                                                display: "inline-flex", alignItems: "center", gap: 0.5,
                                                px: 1.5, py: 0.25, borderRadius: 2,
                                                bgcolor: user?.isDisabled ? "rgba(211,47,47,0.1)" : "rgba(46,125,50,0.1)",
                                                color: user?.isDisabled ? "error.main" : "success.main",
                                            }}
                                        >
                                            <MDTypography variant="caption" fontWeight="medium" sx={{ color: "inherit" }}>
                                                {user?.isDisabled ? "Vô hiệu hóa" : "Đang hoạt động"}
                                            </MDTypography>
                                        </MDBox>
                                    ),
                                },
                            ].map(({ icon, label, value }) => (
                                <MDBox key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <MDBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Icon sx={{ fontSize: 17, color: "inherit" }}>{icon}</Icon>
                                        <MDTypography variant="body2" color="text">{label}</MDTypography>
                                    </MDBox>
                                    {typeof value === "string"
                                        ? <MDTypography variant="body2" fontWeight="medium">{value}</MDTypography>
                                        : value
                                    }
                                </MDBox>
                            ))}
                        </MDBox>
                    </MDBox>

                    {/* Phải — Đổi mật khẩu */}
                    <MDBox sx={{ flex: 1, pl: 0 }}>
                        <MDTypography variant="h6" fontWeight="medium" mb={2}>
                            Đổi mật khẩu
                        </MDTypography>
                        <MDBox
                            component="form"
                            onSubmit={handleSubmit(onChangePassword)}
                            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                        >
                            {passwordField("oldPassword", "Mật khẩu cũ", "old")}
                            {passwordField("newPassword", "Mật khẩu mới", "new")}
                            {passwordField("confirmPassword", "Xác nhận mật khẩu", "confirm")}
                            <MDBox sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <MDButton type="submit" color="info" size="small" loading={changingPass}>
                                    Cập nhật mật khẩu
                                </MDButton>
                            </MDBox>
                        </MDBox>
                    </MDBox>

                </MDBox>
            </MDBox>
        </DashboardLayout>
    );
}

export default ProfilePage;