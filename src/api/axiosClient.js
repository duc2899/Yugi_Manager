import axios from 'axios';
import Cookies from 'js-cookie';
/**
 * YGOPRO API
 */
export const ygoproClient = axios.create({
    baseURL: "https://db.ygoprodeck.com/api/v7",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Local API
 */
console.log(process.env.REACT_APP_URL_API_YUGI);

export const yugiClient = axios.create({
    baseURL: process.env.REACT_APP_URL_API_YUGI,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptors để xử lý request/response chung
yugiClient.interceptors.request.use(config => {
    const token = Cookies.get('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

