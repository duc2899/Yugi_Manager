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

/**
 * Local API
 */
export const yugiClient = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});
// Interceptors để xử lý request/response chung
// axiosClient.interceptors.request.use(config => {
//     const token = Cookies.get('access_token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

