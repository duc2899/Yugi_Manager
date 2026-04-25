import { useState, useCallback } from "react";

export const useCardHover = ({
    previewWidth = 680,
    previewHeight = 350,
    offset = 20,
    scale = 1.1,
} = {}) => {
    const [hoverCard, setHoverCard] = useState(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const onMouseEnter = useCallback(
        (card, e) => {
            
            setHoverCard(card);

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            let x = mouseX + offset;
            let y = mouseY + offset;

            // flip ngang
            if (mouseX + previewWidth + offset > window.innerWidth) {
                x = mouseX - previewWidth - offset;
            }

            // flip dọc
            if (mouseY + previewHeight + offset > window.innerHeight) {
                y = mouseY - previewHeight - offset;
            }

            setPos({ x, y });

            if (e?.currentTarget) {
                e.currentTarget.style.transform = `scale(${scale})`;
            }
        },
        [previewWidth, previewHeight, offset, scale]
    );

    const onMouseLeave = useCallback((e) => {
        setHoverCard(null);

        if (e?.currentTarget) {
            e.currentTarget.style.transform = "scale(1)";
        }
    }, []);

    return {
        hoverCard,
        pos,
        onMouseEnter,
        onMouseLeave,
        setHoverCard,
    };
};