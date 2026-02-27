import { yugiClient } from './axiosClient';
const authAPI = {
    login: async credentials => {
        const response = await yugiClient.post(
            '/auth/loginNormal',
            credentials
        );
        return response.data;
    },

    logout: async () => {
        const response = await yugiClient.post('/auth/logout');
        return response.data;
    },

    getProfile: async () => {
        const response = await yugiClient.get('/user/userInformation');
        return response.data;
    }
};
export default authAPI;
