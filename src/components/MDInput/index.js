import { forwardRef } from 'react';

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// Custom styles for MDInput
import MDInputRoot from 'components/MDInput/MDInputRoot';

const MDInput = forwardRef(({ error, success, helperText, disabled, ...rest }, ref) => (
    <MDInputRoot
        {...rest}
        ref={ref}
        helperText={helperText}
        ownerState={{ error, success, disabled, helperText }}
    />
));

// Setting default values for the props of MDInput
MDInput.defaultProps = {
    error: false,
    success: false,
    disabled: false,
    helperText: ''
};

// Typechecking props for the MDInput
MDInput.propTypes = {
    error: PropTypes.bool,
    success: PropTypes.bool,
    disabled: PropTypes.bool,
    helperText: PropTypes.string
};

export default MDInput;
