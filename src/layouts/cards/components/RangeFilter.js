import { Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

function RangeFilter({ title, value, onChange }) {
    const handleChange = (key, val) => {
        onChange({
            ...value,
            [key]: val === "" ? null : Number(val)
        });
    };

    return (
        <MDBox sx={{ mb: 3 }}>
            <MDTypography
                variant="h6"
                color="primary"
            >
                {title}
            </MDTypography>

            <Box sx={{ display: "flex", gap: 1 }}>
                <MDInput
                    size="small"
                    type="number"
                    placeholder="Min"
                    value={value.gte ?? ""}
                    onChange={(e) => handleChange("gte", e.target.value)}
                    fullWidth
                />
                <MDTypography>⇄</MDTypography>
                <MDInput
                    size="small"
                    type="number"
                    placeholder="Max"
                    value={value.lte ?? ""}
                    onChange={(e) => handleChange("lte", e.target.value)}
                    fullWidth
                />
            </Box>
        </MDBox>
    );
}

export default RangeFilter;