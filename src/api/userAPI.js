import axiosClient from './axiosClient';
const userAPI = {
    getAllUsers: async (params = {}) => {
        // params: { page: 1, limit: 10, ... }
        const response = await axiosClient.get('/admin/user/getAllUsers', { params });
        return response.data;
    },
    toggleBanUser: async (data) => {
        const response = await axiosClient.post('/admin/user/toogleBan', data);
        return response.data;
    },
    setRoleUser: async (data) => {
        const response = await axiosClient.post('/admin/user/setRoleUser', data);
        return response.data;
    },
    searchAdvanced: async (params = {}) => {
        const response = await axiosClient.get('/admin/user/searchAdvanced', { params });
        return response.data;
    },
};
export default userAPI;
