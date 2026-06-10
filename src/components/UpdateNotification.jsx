import React from "react";
import useUpdater from "../hooks/useUpdateer";

const styles = {
  updateNotification: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#1f1f1f",
    color: "#ffffff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.5)",
    zIndex: 9999,
    width: "300px",
    fontFamily: "sans-serif",
    border: "1px solid #333",
  },
  progressBarBg: {
    backgroundColor: "#333",
    borderRadius: "4px",
    width: "100%",
    height: "8px",
    marginTop: "8px",
    overflow: "hidden",
  },
  progressBarFill: {
    backgroundColor: "#00adb5",
    height: "100%",
    transition: "width 0.2s ease-in-out",
  },
  updateBtn: {
    backgroundColor: "#00adb5",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default function UpdateNotification() {
  const { updateInfo, handleRestart } = useUpdater();

  if (updateInfo.status === "idle" || updateInfo.status === "error")
    return null;

  return (
    <div style={styles.updateNotification}>
      <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "bold" }}>
        {updateInfo.status === "available"
          ? "🔄 Đang tải bản cập nhật..."
          : "🎉 Đã tải xong bản mới!"}
      </p>

      <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#ccc" }}>
        Phiên bản: <b>v{updateInfo.version}</b>
      </p>

      <div style={styles.progressBarBg}>
        <div
          style={{
            ...styles.progressBarFill,
            width:
              updateInfo.status === "downloaded"
                ? "100%"
                : `${updateInfo.percent}%`,
            backgroundColor:
              updateInfo.status === "downloaded" ? "#4caf50" : "#00adb5",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "6px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#aaa" }}>
          {updateInfo.status === "downloaded"
            ? "Hoàn tất 100%"
            : `Đã tải: ${updateInfo.percent}%`}
        </span>
      </div>

      {updateInfo.status === "downloaded" && (
        <button
          onClick={handleRestart}
          style={{ ...styles.updateBtn, marginTop: "12px", width: "100%" }}
        >
          Khởi động lại để cập nhật
        </button>
      )}
    </div>
  );
}
