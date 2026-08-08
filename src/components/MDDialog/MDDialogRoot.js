/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";

export default styled(Dialog)(({ theme }) => {
    const { palette, functions, borders, boxShadows, typography } = theme;

    const { background, text, divider } = palette;
    const { pxToRem } = functions;
    const { borderRadius } = borders;
    const { xl } = boxShadows;
    const { fontWeightBold, size } = typography;

    return {
        "& .MuiDialog-paper": {
            backgroundColor: background.card,
            borderRadius: borderRadius.xl,
            border: `1px solid ${divider}`,
            boxShadow: xl,
        },
        // ===== HEADER =====
        "& .md-dialog-header": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${pxToRem(18)} ${pxToRem(20)}`,
        },

        "& .md-dialog-title": {
            fontSize: size.lg,
            fontWeight: fontWeightBold,
            color: text.main,
            lineHeight: 1.2,
        },

        "& .md-dialog-close": {
            color: text.main,
        },

        // ===== CONTENT =====
        "& .md-dialog-content": {
            padding: `${pxToRem(20)} ${pxToRem(20)}`,
            fontSize: size.sm,
            color: text.secondary,
        },

        // ===== ACTIONS =====
        "& .md-dialog-actions": {
            padding: `${pxToRem(16)} ${pxToRem(20)}`,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: pxToRem(8),
        },

        // ===== DIVIDER =====
        "& .MuiDivider-root": {
            borderColor: divider,
            opacity: 0.6,
        },

        // ===== BACKDROP =====
        "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0,0,0,0.55)",
        },
    };
});