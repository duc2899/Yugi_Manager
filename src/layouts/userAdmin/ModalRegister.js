import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDDialog from "components/MDDialog";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { useForm } from "react-hook-form";

const ModalRegister = ({ open, setOpen, handelRegister }) => {
    const schema = yup.object().shape({
        username: yup.string().min(3, 'Username phải có ít nhất 3 ký tự').max(20, 'Username không được quá 20 ký tự').required('Vui lòng nhập username'),
        password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').max(15, 'Mật khẩu không được quá 15 ký tự').required('Vui lòng nhập mật khẩu'),
        fullName: yup.string().min(3, 'Tên đầy đủ phải có ít nhất 3 ký tự').max(50, 'Tên đầy đủ không được quá 50 ký tự').required('Vui lòng nhập tên đầy đủ'),
    });

    const {
        register,
        handleSubmit,
        clearErrors,
        reset,
        formState: { errors }

    } = useForm({
        resolver: yupResolver(schema)
    });

    const hadleClose = () => {
        clearErrors();
        reset();
        setOpen({ isOpen: false, data: { fullName: "", username: "", password: "" } })
    }

    const onSubmit = data => {
        handelRegister(data);
    }

    return (
        <MDDialog
            open={open.isOpen}
            onClose={hadleClose}
            title="Tạo tài khoản mới"
            content={
                <MDBox>
                    <form>
                        <MDBox display="flex" alignItems="center" gap={1}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 90 }}>
                                Tên đầy đủ:
                            </MDTypography>
                            <MDInput
                                fullWidth
                                {...register('fullName')}
                                error={!!errors.fullName}
                                placeholder="Tên đầy đủ"
                                helperText={errors.fullName ? errors.fullName.message : ''}
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" gap={1} sx={{ mt: 2 }}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 90 }}>
                                Tên đăng nhập:
                            </MDTypography>

                            <MDInput
                                fullWidth
                                {...register('username')}
                                error={!!errors.username}
                                placeholder="Tên đăng nhập"
                                helperText={errors.username ? errors.username.message : ''}
                            />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" gap={1} sx={{ mt: 2 }}>
                            <MDTypography variant="button" fontWeight="bold" sx={{ width: 90 }}>
                                Mật khẩu:
                            </MDTypography>

                            <MDInput
                                fullWidth
                                {...register('password')}
                                error={!!errors.password}
                                placeholder="Mật khẩu"
                                type="password"
                                helperText={errors.password ? errors.password.message : ''}
                            />
                        </MDBox>
                    </form>
                </MDBox>
            }

            actions={
                <>
                    <MDButton
                        variant="outlined"
                        color="secondary"
                        onClick={hadleClose}
                    >
                        Hủy
                    </MDButton>
                    <MDButton
                        color="primary"
                        variant="gradient"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Tạo tài khoản
                    </MDButton>
                </>
            }
        >

        </MDDialog>
    );
}

export default ModalRegister;