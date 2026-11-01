import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import adminAPI from "api/adminAPI";
import { useAlert } from "hooks/useAlert";
import { convertTimeVN } from "utils";
import useRecipientSearch, { formatRecipient } from "./useRecipientSearch";

const STATUS_LABEL = {
  UNREAD: "Chưa đọc",
  READ: "Đã đọc",
  CLAIMED: "Đã nhận",
};

const rewardRows = (rewards) =>
  (rewards || []).map((reward) => {
    if (reward.type === "CARD") {
      return {
        rewardName: reward.rewardName || "Thẻ bài",
        itemName: reward.itemName || reward.code || "Không rõ thẻ",
        qty: reward.qty,
      };
    }
    return {
      rewardName: reward.rewardName || "Ruby",
      itemName: reward.itemName || "Ruby",
      qty: reward.qty,
    };
  });

function MailList({ focusAccount }) {
  const { showAlert } = useAlert();
  const [recipientQuery, setRecipientQuery] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [mails, setMails] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [recallingId, setRecallingId] = useState("");

  const selectedLabel = recipient ? formatRecipient(recipient) : "";
  const { options, searching } = useRecipientSearch(
    recipientQuery,
    Boolean(recipient) && recipientQuery.trim() === selectedLabel
  );

  const loadMails = async (accountId) => {
    if (!accountId) {
      setMails([]);
      return;
    }
    setLoadingList(true);
    try {
      const res = await adminAPI.listMails({ accountId, page: 1, limit: 20 });
      setMails(res?.data.data || []);
    } catch (error) {
      showAlert(error?.userMessage || error?.message || "Load thư thất bại", "error");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (!focusAccount?._id) return;
    setRecipient(focusAccount);
    setRecipientQuery(formatRecipient(focusAccount));
    loadMails(focusAccount._id);
    // Reload when a mail is sent to this account.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusAccount]);

  const handleRecall = async (mail) => {
    const ok = window.confirm(`Thu hồi thư "${mail.title}"? Thư chưa nhận sẽ bị xóa.`);
    if (!ok) return;
    setRecallingId(String(mail._id));
    try {
      await adminAPI.recallMail(mail._id);
      showAlert("Thu hồi thư thành công", "success");
      setMails((prev) => prev.filter((item) => String(item._id) !== String(mail._id)));
    } catch (error) {
      showAlert(error?.userMessage || error?.message || "Thu hồi thư thất bại", "error");
    } finally {
      setRecallingId("");
    }
  };

  return (
    <Card sx={{ height: "calc(100vh - 200px)", display: "flex", flexDirection: "column" }}>
      <MDBox
        p={3}
        sx={{ height: "100%", minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <MDTypography variant="h5" fontWeight="medium" mb={2}>
          Danh sách thư
        </MDTypography>
        <MDBox mb={2}>
          <Autocomplete
            options={options}
            value={recipient}
            loading={searching}
            inputValue={recipientQuery}
            filterOptions={(items) => items}
            getOptionLabel={(option) => formatRecipient(option)}
            isOptionEqualToValue={(option, value) => String(option._id) === String(value._id)}
            onInputChange={(_, value, reason) => {
              if (reason === "input" || reason === "clear" || reason === "reset") {
                setRecipientQuery(value);
              }
            }}
            onChange={(_, value) => {
              setRecipient(value);
              setRecipientQuery(value ? formatRecipient(value) : "");
              loadMails(value?._id);
            }}
            noOptionsText={recipientQuery.trim() ? "Không tìm thấy" : "Nhập username hoặc id"}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Người chơi"
                placeholder={recipient ? "" : "Tìm theo username hoặc id"}
              />
            )}
          />
        </MDBox>

        <MDBox sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 1 }}>
          {loadingList ? (
            <MDTypography variant="caption" color="text">
              Đang tải thư...
            </MDTypography>
          ) : mails.length === 0 ? (
            <MDTypography variant="caption" color="text">
              {recipient ? "Người chơi này chưa có thư." : "Chọn một người chơi để xem thư."}
            </MDTypography>
          ) : (
            mails.map((mail) => {
              const rows = rewardRows(mail.rewards);
              const claimed = mail.status === "CLAIMED";
              return (
                <MDBox
                  key={String(mail._id)}
                  mb={1.5}
                  p={1.5}
                  borderRadius="md"
                  sx={{ border: "1px solid #e0e0e0" }}
                >
                  <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                    <MDBox>
                      <MDTypography variant="button" fontWeight="medium">
                        {mail.title}
                      </MDTypography>
                      <MDTypography variant="caption" display="block" color="text">
                        {STATUS_LABEL[mail.status] || mail.status} ·{" "}
                        {mail.createdTime ? convertTimeVN(mail.createdTime) : "-"}
                      </MDTypography>
                    </MDBox>
                    {claimed ? (
                      <MDTypography variant="caption" color="success" fontWeight="medium">
                        Đã nhận
                      </MDTypography>
                    ) : (
                      <MDButton
                        variant="outlined"
                        color="error"
                        size="small"
                        disabled={recallingId === String(mail._id)}
                        onClick={() => handleRecall(mail)}
                      >
                        {recallingId === String(mail._id) ? "..." : "Thu hồi"}
                      </MDButton>
                    )}
                  </MDBox>

                  {mail.body ? (
                    <MDTypography variant="caption" display="block" mt={0.5} fontWeight="medium">
                      {mail.body}
                    </MDTypography>
                  ) : null}

                  <MDBox mt={1}>
                    <MDBox display="flex" gap={1} mb={0.5}>
                      <MDTypography variant="caption" fontWeight="medium" sx={{ width: 90 }}>
                        Phần thưởng
                      </MDTypography>
                      <MDTypography variant="caption" fontWeight="medium" sx={{ flex: 1 }}>
                        Vật phẩm
                      </MDTypography>
                      <MDTypography variant="caption" fontWeight="medium" sx={{ width: 72, textAlign: "center" }}>
                        Số lượng
                      </MDTypography>
                    </MDBox>
                    {rows.length === 0 ? (
                      <MDTypography variant="caption" color="text">
                        Không có phần thưởng
                      </MDTypography>
                    ) : (
                      rows.map((row, index) => (
                        <MDBox key={`${mail._id}-${index}`} display="flex" gap={1}>
                          <MDTypography variant="caption" sx={{ width: 90 }}>
                            {row.rewardName}
                          </MDTypography>
                          <MDTypography variant="caption" sx={{ flex: 1 }}>
                            {row.itemName}
                          </MDTypography>
                          <MDTypography variant="caption" sx={{ width: 72, textAlign: "center" }}>
                            {row.qty}
                          </MDTypography>
                        </MDBox>
                      ))
                    )}
                  </MDBox>
                </MDBox>
              );
            })
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default MailList;
