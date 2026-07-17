import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// @mui
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

// icons
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDPagination from "components/MDPagination";
import MDSelectField from "components/MDSelectField";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API
import adminAPI from "../../api/adminAPI";
import { CircularProgress } from "@mui/material";
import { convertTimeVN } from "../../utils";
import MDButton from "../../components/MDButton";

// ===== CONST ACTION LIST =====
const ACTION_OPTIONS = [
    { label: "ALL", value: "ALL" },
    { label: "CREATE_DECK", value: "CREATE_DECK" },
    { label: "UPDATE_DECK", value: "UPDATE_DECK" },
    { label: "DELETE_DECK", value: "DELETE_DECK" },
    { label: "LOGIN", value: "LOGIN" },
    { label: "LOGOUT", value: "LOGOUT" },
    { label: "BAN_USER", value: "BAN_USER" },
    { label: "UNBAN_USER", value: "UNBAN_USER" },
    { label: "CHANGE_ROLE", value: "CHANGE_ROLE" },
    { label: "SET_VERSION", value: "SET_VERSION" },
];


const getActionColor = (action) => {
    if (!action) return "secondary";
    if (action.includes("CREATE")) return "success";
    if (action.includes("UPDATE")) return "info";
    if (action.includes("DELETE")) return "error";
    if (action.includes("LOGIN")) return "warning";
    if (action.includes("LOGOUT")) return "dark";
    if (action.includes("BAN")) return "error";
    if (action.includes("UNBAN")) return "success";
    return "secondary";
};

const getTargetIcon = (targetType) => {
    if (targetType === "DECK") return "style";
    if (targetType === "CARD") return "view_module";
    if (targetType === "USER") return "person";
    return "info";
};

const ActivityLogs = () => {
    const [page, setPage] = useState(1);
    const [action, setAction] = useState("ALL");
    const [listUsers, setListUsers] = useState([]);

    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ["activityLogs", page, limit, action],
        queryFn: () =>
            adminAPI.getActivityLogs({
                page,
                limit,
                ...(action !== "ALL" && { action }),
            }),
        keepPreviousData: true,
    });
    const logs = data?.data?.data || [];
    const pagination = data?.data?.pagination || { page: 1, totalPages: 1 };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        setPage(newPage);
    };

    const handleChangeAction = (value) => {
        setPage(1);
        setAction(value);
    };

    const paginationItems = useMemo(() => {
        const items = [];
        for (let i = 1; i <= pagination.totalPages; i++) {
            items.push(
                <MDPagination
                    key={i}
                    item
                    active={page === i}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </MDPagination>
            );
        }
        return items;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pagination.totalPages]);

    const inputBoxStyle = {
        width: "190px", // ✅ fix cứng chiều dài
        padding: "0px", // ✅ loại bỏ padding mặc định
        "& .MuiInputBase-root": {
            padding: "10px 0px", // ✅ thêm padding cho input bên trong
        },
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />

            <MDBox mb={2}>
                <MDTypography variant="h4" fontWeight="bold">
                    Lịch sử hoạt động
                </MDTypography>
                <MDTypography variant="button" color="text">
                    Theo dõi lịch sử hoạt động admin/user
                </MDTypography>
            </MDBox>

            {/* FILTER */}
            <Card style={{ padding: "16px", marginBottom: "16px" }}>
                <MDBox display="flex" alignItems="center" gap={2}>
                    <MDBox display="flex" alignItems="center" gap={4}>
                        <MDTypography variant="button" fontWeight="bold" sx={{ width: 70 }}>
                            Hành động:
                        </MDTypography>

                        <MDBox sx={inputBoxStyle}>
                            <MDSelectField
                                value={action}
                                onChange={(e) => handleChangeAction(e.target.value)}
                            >
                                {ACTION_OPTIONS.map((item) => (
                                    <MenuItem key={item.value} value={item.value}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </MDSelectField>
                        </MDBox>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" gap={1}>
                        <MDTypography variant="button" fontWeight="bold" sx={{ width: 70 }}>
                            Người dùng:
                        </MDTypography>

                        <MDBox sx={inputBoxStyle}>
                            <MDSelectField
                                value={"ALL"}
                                onChange={(e) => handleChangeAction(e.target.value)}
                            >
                                {listUsers.map((item) => (
                                    <MenuItem key={item.value} value={item.value}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </MDSelectField>
                        </MDBox>
                        <MDButton size="small">@</MDButton>
                    </MDBox>
                </MDBox>
            </Card>

            {/* LOGS */}
            <MDBox display="flex" flexDirection="column" gap={2} sx={{
                height: "calc(100vh - 350px)",
                overflowY: "auto",
                pr: 1,

            }}>
                {isLoading ? (
                    <Card style={{ padding: "30px" }}>
                        <MDBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="120px"
                        >
                            <CircularProgress
                                size={50}
                                thickness={3}
                                sx={{
                                    color: "primary.main",
                                    "& .MuiCircularProgress-circle": {
                                        strokeLinecap: "round",
                                    },
                                }}
                            />
                        </MDBox>
                    </Card>
                ) : logs.length === 0 ? (
                    <Card style={{ padding: "20px", textAlign: "center" }}>
                        <MDTypography variant="button" color="text">
                            Không có activity log nào.
                        </MDTypography>
                    </Card>
                ) : (
                    logs.map((log) => (
                        <Card
                            key={log._id}
                            style={{
                                padding: "16px",
                                borderRadius: "14px",
                            }}
                        >
                            <MDBox display="flex" justifyContent="space-between" alignItems="center">
                                <MDBox display="flex" gap={1} alignItems="center" flexWrap="wrap">
                                    <Icon fontSize="small">{getTargetIcon(log.targetType)}</Icon>

                                    <MDTypography variant="button" fontWeight="bold" color="info">
                                        {log.username}
                                    </MDTypography>

                                    <MDTypography variant="button" color="text" fontWeight="regular">
                                        thực hiện
                                    </MDTypography>

                                    <Chip
                                        size="small"
                                        label={log.action}
                                        color={getActionColor(log.action)}
                                        style={{ fontWeight: "bold" }}
                                    />

                                    {log.targetName && (
                                        <MDTypography variant="button" fontWeight="bold" color="dark">
                                            {log.targetName}
                                        </MDTypography>
                                    )}
                                </MDBox>

                                <MDTypography variant="caption" color="text" fontWeight="bold">
                                    {convertTimeVN(log.createdAt)}
                                </MDTypography>
                            </MDBox>

                            <Divider style={{ margin: "12px 0" }} />

                            <MDTypography variant="button" color="text" fontWeight="bold">
                                {log.message}
                            </MDTypography>

                            <MDBox display="flex" gap={1} mt={1} flexWrap="wrap">
                                {log.targetType && (
                                    <Chip size="small" label={`Target: ${log.targetType}`} variant="outlined" />
                                )}

                                {log.ip && (
                                    <Tooltip title="IP Address">
                                        <Chip
                                            size="small"
                                            label={`IP: ${log.ip}`}
                                            variant="outlined"
                                            sx={{
                                                color: "text.primary",
                                                borderColor: "divider",
                                                backgroundColor: "transparent",
                                            }}
                                        />
                                    </Tooltip>
                                )}

                                {log.metadata?.deckType && (
                                    <Chip size="small" label={`DeckType: ${log.metadata.deckType}`} variant="outlined" />
                                )}
                            </MDBox>
                        </Card>
                    ))
                )}
            </MDBox>

            {/* PAGINATION */}
            <MDBox display="flex" justifyContent="center" mt={2}>
                <MDPagination size="small">
                    <MDPagination item onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                        <KeyboardArrowLeftIcon />
                    </MDPagination>

                    {paginationItems}

                    <MDPagination
                        item
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === pagination.totalPages}
                    >
                        <KeyboardArrowRightIcon />
                    </MDPagination>
                </MDPagination>
            </MDBox>

            <Footer />
        </DashboardLayout>
    );
};

export default ActivityLogs;