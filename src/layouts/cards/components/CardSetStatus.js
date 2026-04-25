import { FormControlLabel, MenuItem, Radio, RadioGroup } from "@mui/material";

import MDBox from "components/MDBox";
import MDDialog from "components/MDDialog";
import CardImage from "./CardImage";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useState } from "react";
import MDSelectField from "../../../components/MDSelectField";

const CardSetStatus = ({ open, setOpen, lang, handleSetStatus }) => {

    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(open.card?.cardLimitStatus);
    const StatusChoosen = [
        {
            name: "Banned",
            status: 0
        },
        {
            name: "Limited",
            status: 1
        },
        {
            name: "Semi-Limited",
            status: 2
        },
        {
            name: "Default",
            status: 3
        }
    ]

    const STATUS_ACTIVATE = [
        {
            name: "Bật",
            key: 1
        },
        {
            name: "Tắt",
            key: 0
        },
    ]

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await handleSetStatus(open.card.code, selectedStatus);
            setOpen({ isOpen: false, card: null });
        } finally {
            setLoading(false);
        }
    };

    const inputBoxStyle = {
        padding: "0px", // ✅ loại bỏ padding mặc định
        "& .MuiInputBase-root": {
            padding: "10px 0px", // ✅ thêm padding cho input bên trong
        },
    };

    const menuProps = {
        PaperProps: {
            sx: (theme) => ({
                backgroundColor: theme.palette.background.card,
                color: theme.palette.text.main,
                maxHeight: 300,          // ✅ quan trọng
                overflowY: "auto",       // ✅ scroll
            }),
        },
    };


    return (
        <MDDialog
            open={open.isOpen}
            onClose={() => setOpen({ isOpen: false, card: null })}
            maxWidth="sm"
            title="Cập nhật trạng thái lá bài"
            content={
                <MDBox>
                    <MDBox sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <MDTypography fontWeight="bold">
                            {open.card.name}
                        </MDTypography>
                        <CardImage card={open.card} showStatus={false} width={140} />
                        <MDBox sx={{
                            overflowY: "scroll",
                            textOverflow: "ellipsis",
                            height: 120,
                            width: "100%",
                            padding: 1,
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: 1,
                        }}>
                            <MDTypography fontWeight="medium" variant="caption">
                                {lang === "en" ? open.card.desc : open.card.descVN}
                            </MDTypography>
                        </MDBox>
                    </MDBox>

                    <MDBox sx={{ marginTop: 3 }}>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(Number(e.target.value))}
                            sx={{
                                justifyContent: "center",
                            }}
                        >
                            {
                                StatusChoosen.map((status) => (
                                    <FormControlLabel
                                        key={status.status}
                                        value={status.status}
                                        control={<Radio />}
                                        label={status.name}
                                    />
                                ))
                            }
                        </RadioGroup>
                    </MDBox>

                    <MDBox sx={{ marginTop: 3 }}>
                        <MDBox sx={inputBoxStyle}>
                            <MDSelectField MenuProps={menuProps} value={1} fullWidth>
                                {STATUS_ACTIVATE.map((item) => (
                                    <MenuItem key={item.key} value={item.key}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </MDSelectField>
                        </MDBox>
                    </MDBox>
                </MDBox>
            }
            actions={
                <>
                    <MDButton
                        variant="outlined"
                        color="secondary"
                        onClick={() => setOpen({ isOpen: false, card: null })}

                    >
                        Hủy
                    </MDButton>
                    <MDButton
                        color="primary"
                        variant="gradient"
                        loading={loading}
                        disabled={loading}
                        onClick={handleConfirm}
                    >
                        Lưu
                    </MDButton>
                </>
            }
        />
    )
}

export default CardSetStatus;