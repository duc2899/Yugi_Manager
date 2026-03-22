// components/IconFilterGroup.jsx
import { Box, Tooltip } from '@mui/material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';


function IconFilterGroup({
    title,
    data,
    selected,
    onSelect,
    onReset,
    icons
}) {
    const isSelectd = data.some(item => selected.includes(item.name));

    return (
        <>
            <MDBox
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1
                }}
            >
                <MDTypography
                    variant="h6"
                    color="primary"
                >
                    {title}
                </MDTypography>

                {isSelectd && (
                    <MDButton
                        size="small"
                        color= "primary"
                        variant="text"
                        onClick={onReset}
                        sx={{
                            fontSize: "11px",
                            minWidth: "auto",
                            p: 0.5,
                        }}

                    >
                        Reset
                    </MDButton>
                )}
            </MDBox>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    mb: 3,
                    flexWrap: "wrap"
                }}
            >
                {data.length > 0 ? (
                    data.map((item) => {
                        const isActive = (selected || []).includes(item.name);

                        return (
                            <Tooltip key={item.key} title={item.name} arrow>
                                <MDButton
                                    onClick={() => onSelect(item.name)}
                                    size="small"
                                    color={isActive ? "primary" : "light"}
                                    variant="gradient"
                                    sx={(theme) => ({
                                        p: 1,
                                        minWidth: 40,
                                        height: 40,
                                        borderRadius: 2,

                                        // ✅ ACTIVE
                                        backgroundColor: isActive
                                            ? theme.palette.warning.main
                                            : theme.palette.background.default,

                                        transition: "all 0.2s ease",

                                        "&:hover": {
                                            backgroundColor: isActive
                                                ? theme.palette.warning.dark
                                                : theme.palette.action.hover
                                        }
                                    })}
                                >
                                    {item.name === "ALL" || !icons || !icons[item.key] ? (
                                        item.name
                                    ) : (
                                        <img
                                            src={icons[item.key]}
                                            alt={item.name}
                                            style={{ width: 24, height: 24 }}
                                        />
                                    )}
                                </MDButton>
                            </Tooltip>
                        );
                    })
                ) : (
                    <MDTypography
                        variant="body2"
                        sx={(theme) => ({
                            color: theme.palette.text.secondary
                        })}
                    >
                        No data available
                    </MDTypography>
                )}
            </Box>
        </>
    );
}

export default IconFilterGroup;
