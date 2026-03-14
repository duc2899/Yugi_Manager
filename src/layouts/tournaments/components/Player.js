import { Avatar } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const PlayerItem = ({ player, isWinner }) => {

    return (
        <MDBox
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: isWinner ? "#fff7e6" : "#fff",
                border: isWinner ? "1px solid #fbc02d" : "none",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                position: "relative"
            }}
        >
            <Avatar
                src={player.avatarImage}
                sx={{ width: 40, height: 40 }}
            />

            <MDTypography
                variant="body2"
                fontWeight={isWinner ? "bold" : "regular"}
            >
                {player.displayName || `Player ${player.playerId}`}
            </MDTypography>

            {/* Cup winner */}
            {isWinner && (
                <EmojiEventsIcon
                    sx={{
                        color: "#fbc02d",
                        marginLeft: "auto"
                    }}
                />
            )}

            {/* Player ID góc phải dưới */}
            <MDTypography
                sx={{
                    position: "absolute",
                    bottom: 6,
                    right: 10,
                    fontSize: 11,
                    color: "#999"
                }}
            >
                #{player.playerId}
            </MDTypography>
        </MDBox>
    );
};

export default PlayerItem;