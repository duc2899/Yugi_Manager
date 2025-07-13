// src/api/axiosClient.js
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/v1/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Interceptors để xử lý request/response chung
axiosClient.interceptors.request.use(config => {
    const token = Cookies.get('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
