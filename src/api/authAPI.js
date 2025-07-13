import axiosClient from './axiosClient';
const authAPI = {
    login: async credentials => {
        const response = await axiosClient.post(
            '/auth/loginNormal',
            credentials
        );
        return response.data;
    },

    logout: async () => {
        const response = await axiosClient.post('/auth/logout');
        return response.data;
    },

    getProfile: async () => {
        const response = await axiosClient.get('/user/userInformation');
        return response.data;
    }
};
export default authAPI;
