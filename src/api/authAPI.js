import { yugiClient } from './axiosClient';
const authAPI = {
    register: async data => {
        const response = await yugiClient.post('/auth/register', data);
        return response.data;
    },

    login: async credentials => {
        const response = await yugiClient.post(
            '/auth/login',
            credentials
        );
        return response.data;
    },

    logout: async () => {
        const response = await yugiClient.get('/auth/logout');
        return response.data;
    },

    getProfile: async () => {
        const response = await yugiClient.get('/auth/profile');
        return response.data;
    },
    
    uploadAvatar: async formData => {
        const response = await yugiClient.post('/auth/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    changePassword: async data => {
        const response = await yugiClient.post('/auth/change-password', data);
        return response.data;
    }
};
export default authAPI;
