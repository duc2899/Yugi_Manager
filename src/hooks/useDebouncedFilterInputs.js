import { useEffect, useRef, useState } from "react";

export default function useDebouncedFilterInputs(filter, setFilter, delay = 500) {
    const [inputs, setInputs] = useState(filter);
    const timersRef = useRef({});

    // Sync inputs khi filter bị reset từ ngoài
    useEffect(() => {
        setInputs(filter);
    }, [filter]);

    const handleChangeDebounced = (field) => (e) => {
        const value = e.target.value;

        // update UI ngay lập tức
        setInputs((prev) => ({
            ...prev,
            [field]: value,
        }));

        // clear timer cũ
        if (timersRef.current[field]) {
            clearTimeout(timersRef.current[field]);
        }

        // debounce update filter
        timersRef.current[field] = setTimeout(() => {
            setFilter((prev) => ({
                ...prev,
                [field]: value,
            }));
        }, delay);
    };

    return { inputs, handleChangeDebounced, setInputs };
}