import React from "react";
import { SnackbarProvider } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const AlertProvider = ({ children }) => {
    return (
        <SnackbarProvider
            maxSnack={4}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            action={(snackbarId) => (
                <IconButton
                    size="small"
                    onClick={() => window.snackbarClose(snackbarId)}
                >
                    <CloseIcon fontSize="small" style={{ color: "white" }} />
                </IconButton>
            )}
        >
            {children}
        </SnackbarProvider>
    );
};

export default AlertProvider;