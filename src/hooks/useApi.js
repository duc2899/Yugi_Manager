import { useEffect, useState, useCallback } from "react";

export const useApi = (apiFunc, deps = [], options = {}) => {
    const { auto = true, defaultData = null } = options;

    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(auto);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);

            const res = await apiFunc(...args);
            setData(res);

            return res;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        if (auto) fetchData();
    }, [fetchData, auto]);

    return { data, loading, error, refetch: fetchData, setData };
};