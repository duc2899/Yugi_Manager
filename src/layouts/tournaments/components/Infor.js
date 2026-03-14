const { Stack } = require("@mui/material");
const { default: MDTypography } = require("components/MDTypography");

const Info = ({ label, value }) => (
    <Stack direction="row" spacing={1} sx={{
        color: "black"
    }}>
        <MDTypography fontWeight="bold">
            {label}:
        </MDTypography>

        <MDTypography>
            {value}
        </MDTypography>
    </Stack>
);

export default Info