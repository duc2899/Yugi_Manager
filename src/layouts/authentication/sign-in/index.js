import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// @mui material components
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import MuiLink from '@mui/material/Link';

// @mui icons
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';

// Custom components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';

// Layout
import BasicLayout from 'layouts/authentication/components/BasicLayout';

// Images
import bgImage from 'assets/images/bg-sign-in-basic.jpeg';
import { useAuth } from 'context/AuthContext';

// ✅ Validation schema
const schema = yup.object().shape({
    email: yup
        .string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
    password: yup.string().required('Vui lòng nhập mật khẩu')
});

function Basic() {
    const { login, user } = useAuth();
    const [rememberMe, setRememberMe] = useState(false);
    const handleSetRememberMe = () => setRememberMe(!rememberMe);
    // const { showAlert } = useAlert();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async data => {
        const success = await login(data);
        if (success) {
            // Login thành công, redirect hoặc làm gì đó
            console.log('User info:', user);
        }
    };

    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center">
                    <MDTypography
                        variant="h4"
                        fontWeight="medium"
                        color="white"
                        mt={1}>
                        Sign in
                    </MDTypography>
                    <Grid
                        container
                        spacing={3}
                        justifyContent="center"
                        sx={{ mt: 1, mb: 2 }}>
                        <Grid item xs={2}>
                            <MDTypography
                                component={MuiLink}
                                href="#"
                                variant="body1"
                                color="white">
                                <FacebookIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography
                                component={MuiLink}
                                href="#"
                                variant="body1"
                                color="white">
                                <GitHubIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <MDTypography
                                component={MuiLink}
                                href="#"
                                variant="body1"
                                color="white">
                                <GoogleIcon color="inherit" />
                            </MDTypography>
                        </Grid>
                    </Grid>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <MDBox mb={2}>
                            <MDInput
                                type="email"
                                label="Email"
                                fullWidth
                                {...register('email')}
                                error={!!errors.email}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="password"
                                label="Password"
                                fullWidth
                                {...register('password')}
                                error={!!errors.password}
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>
                            <Switch
                                checked={rememberMe}
                                onChange={handleSetRememberMe}
                            />
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="text"
                                onClick={handleSetRememberMe}
                                sx={{
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    ml: -1
                                }}>
                                &nbsp;&nbsp;Remember me
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton
                                type="submit"
                                variant="gradient"
                                color="info"
                                fullWidth
                                circular
                            >
                                Sign in
                            </MDButton>
                        </MDBox>
                    </form>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Basic;
