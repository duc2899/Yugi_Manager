/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";

export default styled(Select)(({ theme, ownerState }) => {
    const { palette, functions, borders, typography } = theme;
    const { error, success, disabled } = ownerState;

    const {
        dark,
        transparent,
        grey,
        error: colorError,
        success: colorSuccess,
        background,
        text,
    } = palette;

    const { pxToRem } = functions;
    const { borderRadius } = borders;
    const { size } = typography;

    const errorStyles = () => ({
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: `${colorError.main} !important`,
        },
    });

    const successStyles = () => ({
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: `${colorSuccess.main} !important`,
        },
    });

    return {
        backgroundColor:  transparent.main,
        pointerEvents: disabled ? "none" : "auto",
        borderRadius: borderRadius.md,
        fontSize: size.sm,

        "& .MuiSelect-select": {
            padding: pxToRem(12),
            color: text.main,
            backgroundColor:  transparent.main,
            display: "flex !important",
            alignItems: "center",
            gap: pxToRem(10),
        },

        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[500],
        },

        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[600],
        },

        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[700],
        },

        "& .MuiSvgIcon-root": {
            color: grey[600],
        },

        ...(error && errorStyles()),
        ...(success && successStyles()),
    };
});