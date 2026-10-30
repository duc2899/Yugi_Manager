import { useState } from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import adminAPI from "api/adminAPI";
import { useAlert } from "hooks/useAlert";
import { convertTimeVN } from "utils";

const emptyReward = () => ({ type: "RUBY", code: "", qty: 1 });

function Mailbox() {
  const { showAlert } = useAlert();
  const [username, setUsername] = useState("");
  const [accountId, setAccountId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rewards, setRewards] = useState([emptyReward()]);
  const [submitting, setSubmitting] = useState(false);
  const [filterUsername, setFilterUsername] = useState("");
  const [mails, setMails] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

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
    if (!username.trim() && !accountId.trim()) {
      showAlert("Nhập username hoặc accountId", "warning");
      return;
    }
    if (!title.trim()) {
      showAlert("Title không được trống", "warning");
      return;
    }

    const normalizedRewards = rewards
      .map((r) => {
        const type = String(r.type || "").toUpperCase();
        const qty = Number(r.qty);
        if (type === "CARD") {
          return { type: "CARD", code: String(r.code || "").trim(), qty };
        }
        return { type: "RUBY", qty };
      })
      .filter((r) => r.qty > 0);

    for (const r of normalizedRewards) {
      if (r.type === "CARD" && !r.code) {
        showAlert("Reward CARD cần code", "warning");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        body: body || "",
        rewards: normalizedRewards,
      };
      if (accountId.trim()) payload.accountId = accountId.trim();
      if (username.trim()) payload.username = username.trim();

      await adminAPI.sendMail(payload);
      showAlert("Gửi thư thành công", "success");
      setTitle("");
      setBody("");
      setRewards([emptyReward()]);
      if (username.trim()) {
        setFilterUsername(username.trim());
        await loadMails(username.trim());
      }
    } catch (error) {
      showAlert(error?.userMessage || error?.message || "Gửi thư thất bại", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const loadMails = async (uname) => {
    const key = (uname ?? filterUsername).trim();
    if (!key) {
      showAlert("Nhập username để load thư", "warning");
      return;
    }
    setLoadingList(true);
    try {
      const res = await adminAPI.listMails({ username: key, page: 1, limit: 20 });
      setMails(res?.data || []);
    } catch (error) {
      showAlert(error?.userMessage || error?.message || "Load thư thất bại", "error");
    } finally {
      setLoadingList(false);
    }
  };

  const handleLoadMails = () => loadMails();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="medium" mb={2}>
                  Gửi thư
                </MDTypography>

                <MDBox mb={2}>
                  <MDInput
                    label="Username"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    label="Account ID (tuỳ chọn)"
                    fullWidth
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
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
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </MDBox>

                <MDTypography variant="button" fontWeight="medium" mb={1}>
                  Rewards
                </MDTypography>
                {rewards.map((reward, index) => (
                  <MDBox key={index} display="flex" gap={1} alignItems="center" mb={1}>
                    <FormControl size="small" sx={{ minWidth: 110 }}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        label="Type"
                        value={reward.type}
                        onChange={(e) => updateReward(index, "type", e.target.value)}
                      >
                        <MenuItem value="RUBY">RUBY</MenuItem>
                        <MenuItem value="CARD">CARD</MenuItem>
                      </Select>
                    </FormControl>
                    {reward.type === "CARD" && (
                      <TextField
                        size="small"
                        label="Card code"
                        value={reward.code}
                        onChange={(e) => updateReward(index, "code", e.target.value)}
                      />
                    )}
                    <TextField
                      size="small"
                      type="number"
                      label="Qty"
                      value={reward.qty}
                      onChange={(e) => updateReward(index, "qty", e.target.value)}
                      sx={{ width: 90 }}
                    />
                    <IconButton onClick={() => removeRewardRow(index)} size="small">
                      <Icon>delete</Icon>
                    </IconButton>
                  </MDBox>
                ))}
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
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="medium" mb={2}>
                  Danh sách thư
                </MDTypography>
                <MDBox display="flex" gap={1} mb={2}>
                  <MDInput
                    label="Username"
                    fullWidth
                    value={filterUsername}
                    onChange={(e) => setFilterUsername(e.target.value)}
                  />
                  <MDButton variant="gradient" color="dark" onClick={handleLoadMails}>
                    {loadingList ? "..." : "Load"}
                  </MDButton>
                </MDBox>
                {mails.length === 0 ? (
                  <MDTypography variant="caption" color="text">
                    Chưa có dữ liệu. Nhập username rồi bấm Load.
                  </MDTypography>
                ) : (
                  mails.map((mail) => (
                    <MDBox
                      key={String(mail._id)}
                      mb={1.5}
                      p={1.5}
                      borderRadius="md"
                      sx={{ border: "1px solid #e0e0e0" }}
                    >
                      <MDTypography variant="button" fontWeight="medium">
                        {mail.title}
                      </MDTypography>
                      <MDTypography variant="caption" display="block" color="text">
                        #{String(mail._id)} · {mail.status} ·{" "}
                        {mail.createdTime ? convertTimeVN(mail.createdTime) : "-"}
                      </MDTypography>
                      <MDTypography variant="caption" display="block">
                        {(mail.rewards || [])
                          .map((r) =>
                            r.type === "CARD"
                              ? `${r.type}:${r.code}x${r.qty}`
                              : `${r.type}x${r.qty}`
                          )
                          .join(", ") || "No rewards"}
                      </MDTypography>
                    </MDBox>
                  ))
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Mailbox;
