import { useEffect, useState } from "react";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";

import { useForm } from "react-hook-form";

import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { useAlert } from 'hooks/useAlert';
import adminAPI from "api/adminAPI";
import MDDialog from "components/MDDialog";
import MDInput from "components/MDInput";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const UpdateVersion = ({ open, handleClose }) => {
  const { showAlert } = useAlert();
  const [data, setData] = useState([]);
  const [oldVersion, setOldVersion] = useState({
    type: "",
    version: ""
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      version: "",
      type: ""
    },
  });

  const fetchData = async () => {
    try {
      const result = await adminAPI.getVersionClient();

      setData(result.data);

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
      if (!oldVersion.type) {
        showAlert("Vui lòng chọn Loại", "warning");
        return
      }
      await adminAPI.setVersionClient({ version: data.version, type: oldVersion.type });
      showAlert("Cập nhật phiên bản thành công", "success");
      handleClose();
    } catch (error) {
      showAlert(error?.errors?.[0]?.message || "Update version thất bại", "error");
    }
  };

  const handelChangeViewVersion = (e) => {
    const value = e.target.value
    setOldVersion({
      type: value._id,
      version: value.data.version
    })
  }

  const getLangVersion = (key) => {
    switch (key) {
      case "CLIENT_VERSION_DEV":
        return "DEV"
      case "CLIENT_VERSION":
        return "LIVE"
      default:
        return "Not found Type"
    }
  }


  return (
    <MDDialog
      open={open}
      onClose={handleClose}
      title="Thay đổi phiên bản"
      content={
        <MDBox>
          <FormControl
            sx={{
              width: "100%",
              marginBottom: "30px"
            }}
          >
            <InputLabel>Loại</InputLabel>

            <Select
              // value={filter.type}
              label="Loại"
              onChange={handelChangeViewVersion}
              sx={{ pt: 1.5, pb: 1.5 }}
            >
              {data.map((s) => (
                <MenuItem key={s._id} value={s}>
                  {getLangVersion(s._id)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <MDInput
            value={oldVersion.version || "Not found version"}
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