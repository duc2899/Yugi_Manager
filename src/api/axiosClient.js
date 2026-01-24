// src/api/axiosClient.js
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
    baseURL: 'https://db.ygoprodeck.com/api/v7',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptors để xử lý request/response chung
// axiosClient.interceptors.request.use(config => {
//     const token = Cookies.get('access_token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default axiosClient;
