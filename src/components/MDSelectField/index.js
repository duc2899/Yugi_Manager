import { forwardRef } from "react";
import PropTypes from "prop-types";

// @mui material components
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

// Custom styles
import MDSelectRoot from "components/MDSelectField/MDSelectRoot";
import MDInputLabelRoot from "components/MDSelectField/MDInputLabelRoot";

const MDSelectField = forwardRef(
    (
        {
            label,
            value,
            onChange,
            children,
            error,
            success,
            disabled,
            helperText,
            fullWidth,
            ...rest
        },
        ref
    ) => (
        <FormControl fullWidth={fullWidth} disabled={disabled} error={error}>
            {label && (
                <MDInputLabelRoot ownerState={{ error, success }}>
                    {label}
                </MDInputLabelRoot>
            )}

            <MDSelectRoot
                {...rest}
                ref={ref}
                value={value}
                label={label}
                onChange={onChange}
                ownerState={{ error, success, disabled }}
            >
                {children}
            </MDSelectRoot>

            {helperText && (
                <FormHelperText sx={{ marginLeft: 0 }}>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    )
);

MDSelectField.defaultProps = {
    error: false,
    success: false,
    disabled: false,
    helperText: "",
    fullWidth: true,
};

MDSelectField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,

    error: PropTypes.bool,
    success: PropTypes.bool,
    disabled: PropTypes.bool,
    helperText: PropTypes.string,
    fullWidth: PropTypes.bool,
};

export default MDSelectField;