import React from "react";
import LazyImage from "components/common/LazyImage";
import { URL_IMAGE } from "config/constant";

const CardImage = ({
    card,
    width = 70,
    showStatus = true,
    style = {},
}) => {
    return (
        <div
            style={{
                position: "relative",
                width: `${width}px`,
                borderRadius: "6px",
                overflow: "hidden",
                ...style,
            }}
        >
            {/* IMAGE */}
            <LazyImage
                src={`${URL_IMAGE}${card._id}.jpg`}
                alt={card.name}
                style={{
                    width: `${width}px`,
                    height: "auto",
                    display: "block",
                    borderRadius: "6px",
                }}
            />

            {/* LOCK OVERLAY */}
            {card.activeStatus === 0 && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 5,
                    }}
                >
                    <span style={{ fontSize: "22px", color: "white" }}>🔒</span>
                </div>
            )}

            {/* STATUS UI */}
            {showStatus && (
                <>
                    {/* STATUS 3 */}
                    {card.cardLimitStatus === 3 && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "4px",
                                right: "4px",
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                background: "rgba(0,0,0,0.65)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "13px",
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            3
                        </div>
                    )}

                    {/* STATUS 0 */}
                    {card.cardLimitStatus === 0 && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "4px",
                                right: "4px",
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                background: "rgba(0,0,0,0.7)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "14px",
                                color: "red",
                                fontWeight: "bold",
                            }}
                        >
                            🚫
                        </div>
                    )}

                    {/* STATUS 1 & 2 */}
                    {(card.cardLimitStatus === 1 || card.cardLimitStatus === 2) && (
                        <div
                            style={{
                                position: "absolute",
                                bottom: "4px",
                                right: "4px",
                                width: "22px",
                                height: "22px",
                                borderRadius: "50%",
                                background: "black",       // nền đen
                                border: "2px solid red",   // viền đỏ
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "13px",
                                fontWeight: "bold",
                                color: "white",
                                boxSizing: "border-box",
                            }}
                        >
                            {card.cardLimitStatus}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CardImage;