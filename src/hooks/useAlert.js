import { useSnackbar } from "notistack";

export const useAlert = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // để action close dùng được trong Provider
    window.snackbarClose = closeSnackbar;

    const showAlert = (message, variant = "info", options = {}) => {
        enqueueSnackbar(message, {
            variant, // success | error | warning | info | default
            ...options,
        });
    };

    return { showAlert };
};