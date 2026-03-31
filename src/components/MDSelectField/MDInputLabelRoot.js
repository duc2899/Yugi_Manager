import InputLabel from "@mui/material/InputLabel";
import { styled } from "@mui/material/styles";

export default styled(InputLabel)(({ theme, ownerState }) => {
    const { palette } = theme;
    const { error, success } = ownerState;

    const { text, error: colorError, success: colorSuccess } = palette;

    return {
        color: error
            ? colorError.main
            : success
                ? colorSuccess.main
                : text.secondary,

        "&.Mui-focused": {
            color: error
                ? colorError.main
                : success
                    ? colorSuccess.main
                    : text.main,
        },
    };
});