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


const API_URL = process.env.REACT_APP_URL_API_YUGI;

console.log(API_URL);


export const yugiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - gắn token
yugiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor - chuẩn hóa lỗi
yugiClient.interceptors.response.use(
    response => response,
    error => {
        const data = error.response?.data;
        
        let message = 'Đã có lỗi xảy ra';

        if (data?.errors?.length > 0) {
            // Validation error - gộp tất cả message lại
            message = data.errors.map(e => e.message).join(', ');
        } else if (data?.message) {
            message = data.message;
        } else if (error.message) {
            message = error.message;
        }

        error.userMessage = message;

        return Promise.reject(error);
    }
);

