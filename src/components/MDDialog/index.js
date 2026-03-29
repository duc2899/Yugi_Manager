import { forwardRef } from "react";
import PropTypes from "prop-types";

// @mui material components
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Custom styles for MDDialog
import MDDialogRoot from "components/MDDialog/MDDialogRoot";

const MDDialog = forwardRef(
    (
        {
            open,
            onClose,
            title,
            content,
            actions,
            maxWidth,
            fullWidth,
            hideCloseIcon,
            ...rest
        },
        ref
    ) => (
        <MDDialogRoot
            {...rest}
            ref={ref}
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            ownerState={{ maxWidth, fullWidth }}
        >
            {/* HEADER */}
            {(title || !hideCloseIcon) && (
                <Box className="md-dialog-header">
                    <Typography className="md-dialog-title">{title}</Typography>

                    {!hideCloseIcon && (
                        <IconButton className="md-dialog-close" onClick={onClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            )}

            <Divider />

            {/* CONTENT */}
            <Box className="md-dialog-content">{content}</Box>

            {/* ACTIONS */}
            {actions && (
                <>
                    <Divider />
                    <Box className="md-dialog-actions">{actions}</Box>
                </>
            )}
        </MDDialogRoot>
    )
);

// Setting default values for the props of the MDDialog
MDDialog.defaultProps = {
    title: "",
    content: null,
    actions: null,
    maxWidth: "xs",
    fullWidth: true,
    hideCloseIcon: false,
};

// Typechecking props for the MDDialog
MDDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,

    title: PropTypes.node,
    content: PropTypes.node,
    actions: PropTypes.node,

    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    fullWidth: PropTypes.bool,
    hideCloseIcon: PropTypes.bool,
};

export default MDDialog;