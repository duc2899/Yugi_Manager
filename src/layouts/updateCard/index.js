
import { Controller, useForm } from "react-hook-form";
import { Divider, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { useAlert } from 'hooks/useAlert';
import MDDialog from "components/MDDialog";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import cardApi from "api/cardAPI";
import { useState } from "react";

const UpdateCard = ({ open, handleClose }) => {
  const { showAlert } = useAlert();
  const [syncResult, setSyncResult] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      sheetUrl: "",
      type: "",
    },
  });

  const TYPES = [
    { name: "Trạng thái hoạt động", value: "ACTIVATE_STATUS" },
    { name: "Trạng thái cấm", value: "LIMIT_STATUS" },
  ]

  const onSubmit = async (data) => {
    try {
      // Tách gid từ URL
      const gidMatch = data.sheetUrl.match(/gid=(\d+)/);
      const gid = gidMatch ? gidMatch[1] : null;

      const payload = {
        ...data,
        gid,
      };
      const response = await cardApi.syncStatus(payload);
      setSyncResult(response.data)

      reset();
      showAlert("Cập nhật thành công", "success");

    } catch (error) {
      showAlert(error?.errors?.[0]?.message || "Cập nhật thất bại", "error");
    }
  };



  return (
    <>
      <MDDialog
        open={open}
        onClose={handleClose}
        title="Cập nhật dữ liệu thẻ bài"
        content={
          <MDBox>
            <FormControl
              sx={{ width: "100%", marginBottom: "30px" }}
              error={!!errors.type}
            >
              <InputLabel>Loại</InputLabel>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Vui lòng chọn loại" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Loại"
                    sx={{ pt: 1.5, pb: 1.5 }}
                  >
                    {TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.type && <MDTypography color="error" fontSize="13px" fontWeight="light" ml={1.5}>
                {errors.type.message}
              </MDTypography>}
            </FormControl>

            <MDInput
              label="Link sheet"
              fullWidth
              error={!!errors.sheetUrl}
              helperText={errors.sheetUrl?.message}
              {...register("sheetUrl", {
                required: "Vui lòng nhập link sheet",
                pattern: {
                  value: /^https:\/\/docs\.google\.com\/spreadsheets\/.+/,
                  message: "Vui lòng nhập link Google Sheets hợp lệ",
                },
                validate: (value) => {
                  const gidMatch = value.match(/gid=(\d+)/);
                  if (!gidMatch) return "Link sheet phải chứa gid (chọn đúng sheet tab)";
                  return true;
                },
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
      <MDDialog
        open={!!syncResult}
        onClose={() => setSyncResult(null)}
        title="Kết quả đồng bộ"
        content=
        {syncResult && (
          <MDBox sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 300 }}>
            <MDTypography variant="body2">
              <b>Tab:</b> {syncResult.tab} &nbsp;|&nbsp; <b>Type:</b> {syncResult.type}
            </MDTypography>

            <Divider />

            {[
              { label: "Tổng", value: syncResult.summary?.total, color: "inherit" },
              { label: "Cập nhật", value: syncResult.summary?.updated, color: "success" },
              { label: "Bỏ qua", value: syncResult.summary?.skipped, color: "warning" },
              { label: "Không tìm thấy", value: syncResult.summary?.notFound, color: "info" },
              { label: "Lỗi", value: syncResult.summary?.errors, color: "error" },
            ].map(({ label, value, color }) => (
              <MDBox key={label} sx={{ display: "flex", justifyContent: "space-between" }}>
                <MDTypography variant="body2">{label}</MDTypography>
                <MDTypography variant="body2" color={color} fontWeight="bold">
                  {value}
                </MDTypography>
              </MDBox>
            ))}
          </MDBox>)}

        actions={
          <MDButton onClick={() => { setSyncResult(null); handleClose(); }} color="primary">
            Đóng
          </MDButton>
        }
      />
    </>
  );
};

export default UpdateCard;