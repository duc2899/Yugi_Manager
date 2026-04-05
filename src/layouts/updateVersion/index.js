import { useEffect, useState } from "react";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";

import { useForm } from "react-hook-form";

import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { useAlert } from "context/AlertContext";
import adminAPI from "api/adminAPI";
import MDDialog from "components/MDDialog";
import MDInput from "components/MDInput";

const UpdateVersion = ({ open, handleClose }) => {
  const { showAlert } = useAlert();
  const [oldVersion, setOldVersion] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      version: "",
    },
  });

  const fetchData = async () => {
    try {
      const result = await adminAPI.getVersionClient();
      setOldVersion(result.data.version);

      // reset input version mới về rỗng khi mở dialog
      reset({ version: "" });
    } catch (error) {
      showAlert("Không lấy được version hiện tại", "error");
    }
  };

  useEffect(() => {
    if (open) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = async (data) => {
    try {
      await adminAPI.setVersionClient({ version: data.version });
      showAlert("Đã gửi yêu cầu cập nhật phiên bản", "success");
      handleClose();
    } catch (error) {
      showAlert(error?.errors?.[0]?.message || "Update version thất bại", "error");
    }
  };

  return (
    <MDDialog
      open={open}
      onClose={handleClose}
      title="Thay đổi phiên bản"
      content={
        <MDBox>
          <MDInput
            value={oldVersion || "Not found version"}
            label="Phiên bản hiện tại"
            fullWidth
            disabled
          />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton disableRipple>
              <Icon sx={(theme) => ({ fontSize: 15, color: theme.palette.text.secondary })}>
                arrow_downward
              </Icon>
            </IconButton>
          </div>

          <MDInput
            label="Phiên bản mới"
            fullWidth
            error={!!errors.version}
            {...register("version", {
              required: "Vui lòng nhập phiên bản mới",
            })}
          />
        </MDBox>
      }
      actions={
        <>
          <MDButton onClick={handleClose} color="error" disabled={isSubmitting}>
            Hủy
          </MDButton>

          <MDButton
            color="success"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Cập nhật
          </MDButton>
        </>
      }
    />
  );
};

export default UpdateVersion;