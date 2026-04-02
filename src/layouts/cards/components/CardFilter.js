import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDSelectField from "components/MDSelectField";
import { TYPE_BY_CATEGORY, CARD_TYPE, TYPE_MONSTERS } from "config/card";
import useDebouncedFilterInputs from "hooks/useDebouncedFilterInputs";

export default function CardFilterBar({
    filter,
    setFilter,
    optionsCategory = [],
    optionsAttribute = [],
    optionsLimit = [],
}) {

    const { inputs, handleChangeDebounced } = useDebouncedFilterInputs(filter, setFilter, 600);

    const getOptionsTypeByCategory = (category) => {
        switch (category) {
            case CARD_TYPE.MONSTER:
                return TYPE_BY_CATEGORY.MONSTER;

            case CARD_TYPE.SPELL:
                return TYPE_BY_CATEGORY.SPELL;

            case CARD_TYPE.TRAP:
                return TYPE_BY_CATEGORY.TRAP;

            default:
                return [];
        }
    };

    const getOptionsType = (category) => {
        if (category === CARD_TYPE.MONSTER) return "monsterCategory";
        if (category === CARD_TYPE.SPELL) return "spellType";
        if (category === CARD_TYPE.TRAP) return "trapType";
        return null;
    }

    const optionsType = getOptionsTypeByCategory(filter.category);

    const handleChange = (field) => (e) => {
        const value = e.target.value;

        setFilter((prev) => {
            const next = {
                ...prev,
                [field]: value,
            };

            if(field === ""){
                next.monsterType = null;
                next.monsterCategory = null;
                next.monsterAttribute = null;
                next.atk = null;
                next.def = null;
                next.gte = null;
                next.lte = null;
                next.spellType = null;
                next.trapType = null;
            }

            if (field === "category" && value !== CARD_TYPE.MONSTER) {
                next.monsterType = null;
                next.monsterCategory = null;
                next.monsterAttribute = null;
                next.atk = null;
                next.def = null;
                next.gte = null;
                next.lte = null;
            }

            if (field === "category" && value !== CARD_TYPE.SPELL) {
                next.spellType = null;
            }

            if (field === "category" && value !== CARD_TYPE.TRAP) {
                next.trapType = null;
            }

            return next;
        });
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

    const inputBoxStyle = {
        width: "190px", // ✅ fix cứng chiều dài
        padding: "0px", // ✅ loại bỏ padding mặc định
        "& .MuiInputBase-root": {
            padding: "10px 12px", // ✅ thêm padding cho input bên trong
        },
    };

    return (
        <MDBox
            sx={(theme) => ({
                width: "100%",
                borderRadius: "12px",
                padding: "12px",
                border: `2px dashed ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.card,
            })}
        >
            <Grid container spacing={1}>
                {/* LEFT */}
                <Grid item xs={6} md={6}>
                    <MDBox display="flex" flexDirection="column" gap={1}>
                        <MDBox display="flex" alignItems="center" gap={1}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 90 }}>
                                Category:
                            </MDTypography>

                            <MDBox sx={inputBoxStyle}>
                                <MDSelectField value={filter.category} onChange={handleChange("category")} MenuProps={menuProps}>
                                    <MenuItem value="">(All)</MenuItem>
                                    {optionsCategory.map((item) => (
                                        <MenuItem key={item.key} value={item.key}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </MDSelectField>
                            </MDBox>
                            <MDBox sx={inputBoxStyle}>
                                <MDSelectField
                                    value={filter.monsterCategory || filter.spellType || filter.trapType || ""}
                                    onChange={handleChange(getOptionsType(filter.category))}
                                    MenuProps={menuProps}
                                    disabled={!filter.category} // nếu chưa chọn category thì disable
                                >
                                    <MenuItem value="">(All)</MenuItem>
                                    {optionsType.map((item) => (
                                        <MenuItem
                                            key={item.key}
                                            value={item.key}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            {
                                                item.icon &&
                                                <img
                                                    src={item.icon}
                                                    alt={item.name}
                                                    style={{ width: 18, height: 18, objectFit: "contain" }}
                                                />
                                            }
                                            <span>{item.name}</span>
                                        </MenuItem>
                                    ))}
                                </MDSelectField>
                            </MDBox>
                        </MDBox>

                        <MDBox display="flex" alignItems="center" gap={1}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 90 }}>
                                Attribute:
                            </MDTypography>

                            <MDBox sx={inputBoxStyle}>
                                <MDSelectField
                                    value={filter.monsterAttribute}
                                    onChange={handleChange("monsterAttribute")}
                                    MenuProps={menuProps}
                                    disabled={filter.category !== CARD_TYPE.MONSTER} // chỉ enable khi category là Monster
                                >
                                    <MenuItem value="">(All)</MenuItem>

                                    {optionsAttribute.map((item) => (
                                        <MenuItem
                                            key={item.key}
                                            value={item.key}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <img
                                                src={item.icon}
                                                alt={item.name}
                                                style={{ width: 18, height: 18, objectFit: "contain" }}
                                            />
                                            <span>{item.name}</span>
                                        </MenuItem>
                                    ))}
                                </MDSelectField>
                            </MDBox>
                        </MDBox>

                        <MDBox display="flex" alignItems="center" gap={1}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 90 }}>
                                Type:
                            </MDTypography>

                            <MDBox sx={inputBoxStyle}>
                                <MDSelectField value={filter.monsterType} onChange={handleChange("monsterType")} MenuProps={menuProps} disabled={filter.category !== CARD_TYPE.MONSTER}>
                                    <MenuItem value="">(All)</MenuItem>
                                    {TYPE_MONSTERS.map((item) => (
                                        <MenuItem
                                            key={item.key}
                                            value={item.key}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <img
                                                src={item.icon}
                                                alt={item.name}
                                                style={{ width: 18, height: 18, objectFit: "contain" }}
                                            />
                                            <span>{item.name}</span>
                                        </MenuItem>
                                    ))}
                                </MDSelectField>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                </Grid>

                {/* RIGHT */}
                <Grid item xs={3} md={3}>
                    <MDBox display="flex" flexDirection="column" gap={1}>
                        <MDBox display="flex" alignItems="center" gap={1}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 70 }}>
                                Limit:
                            </MDTypography>

                            <MDBox sx={inputBoxStyle}>
                                <MDSelectField value={filter.limit} MenuProps={menuProps}>
                                    <MenuItem value="">(All)</MenuItem>
                                    {optionsLimit.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </MDSelectField>
                            </MDBox>
                        </MDBox>

                        <MDBox display="flex" alignItems="center" gap={1}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 70 }}>
                                ATK:
                            </MDTypography>

                            <MDInput
                                value={inputs.atk || ""}
                                onChange={handleChangeDebounced("atk")}
                                placeholder="ATK"
                                disabled={filter.category !== CARD_TYPE.MONSTER}
                            />
                        </MDBox>

                        <MDBox display="flex" alignItems="center" gap={1}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 70 }}>
                                DEF:
                            </MDTypography>

                            <MDInput
                                value={inputs.def || ""}
                                onChange={handleChangeDebounced("def")}
                                placeholder="DEF"
                                disabled={filter.category !== CARD_TYPE.MONSTER}
                            />
                        </MDBox>
                    </MDBox>
                </Grid>

                <Grid item xs={3} md={3}>
                    <MDBox display="flex" flexDirection="column" gap={1}>
                        <MDBox display="flex" alignItems="center" gap={1}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 70 }}>
                                Level:
                            </MDTypography>

                            <MDInput
                                value={inputs.gte || ""}
                                onChange={handleChangeDebounced("gte")}
                                placeholder="Từ"
                                disabled={filter.category !== CARD_TYPE.MONSTER}
                            />
                            <MDTypography>⇄</MDTypography>
                            <MDInput
                                value={inputs.lte || ""}
                                onChange={handleChangeDebounced("lte")}
                                placeholder="Đến"
                                disabled={filter.category !== CARD_TYPE.MONSTER}
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" gap={1}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 70 }}>
                                Name:
                            </MDTypography>

                            <MDInput
                                value={inputs.name || ""}
                                onChange={handleChangeDebounced("name")}
                                placeholder="Tên"
                            />
                        </MDBox>
                    </MDBox>
                </Grid>
            </Grid>
        </MDBox>
    );
}