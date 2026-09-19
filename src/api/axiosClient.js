import axios from 'axios';
import { getDataEnv } from '../utils'; // sửa đúng path import ở dự án bạn
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

// Request interceptor - gắn data env (live/dev)
yugiClient.interceptors.request.use(config => {
    const dataEnv = getDataEnv()
    config.headers['x-data-env'] = dataEnv;
    return config;
});

yugiClient.interceptors.response.use(
    response => {
        // Server trả HTTP 200 nhưng body báo lỗi (status: false)
        if (response.data?.status === false) {
            const error = new Error(response.data.message || 'Đã có lỗi xảy ra');
            error.response = response; // giả lập giống cấu trúc AxiosError để xử lý thống nhất
            return Promise.reject(error);
        }
        return response;
    },
    (error) => { // chỉ 1 tham số, bỏ "response" thừa
        const data = error.response?.data;

        console.log('Error response data:', data); // log đúng chỗ chứa payload server trả về

        let message = 'Đã có lỗi xảy ra';

        if (data?.errors?.length > 0) {
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

