import { useState } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import adminAPI from "api/adminAPI";
import { useAlert } from "hooks/useAlert";
import MailList from "./MailList";
import useRecipientSearch, { formatRecipient } from "./useRecipientSearch";

const emptyReward = () => ({ type: "RUBY", code: "", qty: 1 });

function Mailbox() {
  const { showAlert } = useAlert();
  const [recipientQuery, setRecipientQuery] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rewards, setRewards] = useState([emptyReward()]);
  const [submitting, setSubmitting] = useState(false);
  const [listAccount, setListAccount] = useState(null);
  const { options: recipientOptions, searching: searchingRecipients } =
    useRecipientSearch(recipientQuery);

  const updateReward = (index, field, value) => {
    setRewards((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const addRewardRow = () => setRewards((prev) => [...prev, emptyReward()]);

  const removeRewardRow = (index) => {
    setRewards((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSend = async () => {
    if (!recipients.length) {
      showAlert("Chọn ít nhất một người nhận", "warning");
      return;
    }
    if (!title.trim()) {
      showAlert("Title không được trống", "warning");
      return;
    }

    const normalizedRewards = [];
    for (const r of rewards) {
      const type = String(r.type || "").toUpperCase();
      const qty = Number(r.qty);
      if (!Number.isInteger(qty) || qty < 1) {
        showAlert("Số lượng phải lớn hơn hoặc bằng 1", "warning");
        return;
      }
      if (type === "CARD") {
        const code = String(r.code || "").trim();
        if (!code) {
          showAlert("Reward CARD cần code", "warning");
          return;
        }
        normalizedRewards.push({ type: "CARD", code, qty });
      } else {
        normalizedRewards.push({ type: "RUBY", qty });
      }
    }

    setSubmitting(true);
    try {
      await adminAPI.sendMail({
        accountIds: recipients.map((account) => account._id),
        title: title.trim(),
        body: body || "",
        rewards: normalizedRewards,
      });
      showAlert(
        recipients.length > 1
          ? `Gửi thư thành công cho ${recipients.length} người`
          : "Gửi thư thành công",
        "success"
      );
      setListAccount({ ...recipients[0], sentAt: Date.now() });
      setTitle("");
      setBody("");
      setRewards([emptyReward()]);
      setRecipients([]);
      setRecipientQuery("");
    } catch (error) {
      showAlert(error?.userMessage || error?.message || "Gửi thư thất bại", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
              <MDBox
                p={3}
                sx={{
                  height: "100%",
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MDTypography variant="h5" fontWeight="medium" mb={1}>
                  Gửi thư
                </MDTypography>

                <MDBox mb={2}>
                  <Autocomplete
                    multiple
                    options={recipientOptions}
                    value={recipients}
                    loading={searchingRecipients}
                    inputValue={recipientQuery}
                    filterSelectedOptions
                    filterOptions={(options) => options}
                    getOptionLabel={(option) => formatRecipient(option)}
                    isOptionEqualToValue={(option, value) => String(option._id) === String(value._id)}
                    onInputChange={(_, value, reason) => {
                      if (reason === "reset") {
                        setRecipientQuery("");
                        return;
                      }
                      if (reason === "input" || reason === "clear") {
                        setRecipientQuery(value);
                      }
                    }}
                    onChange={(_, value) => {
                      if (value.length > 50) {
                        showAlert("Tối đa 50 người nhận", "warning");
                        return;
                      }
                      setRecipients(value);
                      setRecipientQuery("");
                    }}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            key={key}
                            {...tagProps}
                            size="small"
                            label={formatRecipient(option)}
                            deleteIcon={<CloseIcon fontSize="small" />}
                          />
                        );
                      })
                    }
                    noOptionsText={
                      recipientQuery.trim() ? "Không tìm thấy" : "Nhập username hoặc id"
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Người nhận"
                        placeholder={recipients.length ? "" : "Tìm theo username hoặc id"}
                      />
                    )}
                    sx={{
                      "& .MuiAutocomplete-inputRoot": {
                        alignItems: "flex-start",
                        maxHeight: 140,
                        overflowY: "auto",
                      },
                    }}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <TextField
                    label="Nội dung"
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </MDBox>

                <MDTypography variant="button" fontWeight="medium" mb={2}>
                  Rewards
                </MDTypography>
                <MDBox sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 1, pt: 1 }}>
                  {rewards.map((reward, index) => (
                    <MDBox key={index} display="flex" gap={1} alignItems="center" mb={1}>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                          label="Type"
                          value={reward.type}
                          onChange={(e) => updateReward(index, "type", e.target.value)}
                          sx={{ p: 1.5 }}
                        >
                          <MenuItem value="RUBY">RUBY</MenuItem>
                          <MenuItem value="CARD">CARD</MenuItem>
                        </Select>
                      </FormControl>
                      {reward.type === "CARD" && (
                        <TextField
                          label="Card code"
                          value={reward.code}
                          onChange={(e) => updateReward(index, "code", e.target.value)}
                          sx={{ flex: 1, minWidth: 120 }}
                        />
                      )}
                      <TextField
                        type="number"
                        label="Qty"
                        value={reward.qty}
                        inputProps={{ min: 1, step: 1 }}
                        onChange={(e) => updateReward(index, "qty", e.target.value)}
                        sx={{ width: 110 }}
                      />
                      <IconButton onClick={() => removeRewardRow(index)} size="small">
                        <Icon>delete</Icon>
                      </IconButton>
                    </MDBox>
                  ))}
                </MDBox>
                <MDBox display="flex" gap={1} mt={1}>
                  <MDButton variant="outlined" color="info" size="small" onClick={addRewardRow}>
                    Thêm reward
                  </MDButton>
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={handleSend}
                    disabled={submitting}
                  >
                    {submitting ? "Đang gửi..." : "Gửi thư"}
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <MailList focusAccount={listAccount} />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Mailbox;
