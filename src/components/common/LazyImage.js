import { useEffect, useRef, useState } from "react";

const LazyImage = ({ src, alt, ...props }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            {
                root: null,       // viewport hoặc scroll parent
                rootMargin: "100px", // preload sớm 100px
            }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return (
        <img
            ref={ref}
            src={visible ? src : undefined}
            alt={alt}
            loading="lazy"
            {...props}
        />
    );
}

export default LazyImage;
