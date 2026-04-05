import axios from 'axios';
/**
 * YGOPRO API
 */
export const ygoproClient = axios.create({
    baseURL: "https://db.ygoprodeck.com/api/v7",
    headers: {
        "Content-Type": "application/json",
    },
});


export const yugiClient = axios.create({
    baseURL: process.env.REACT_APP_URL_API_YUGI,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptors để xử lý request/response chung
yugiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

