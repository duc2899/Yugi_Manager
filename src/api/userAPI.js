import { yugiClient } from './axiosClient';
const userAPI = {
    getAllAccounts: async (params = {}) => {
        // params: { page: 1, limit: 10, ... }
        const response = await yugiClient.get('/accounts', { params });
        return response.data;
    },
};
export default userAPI;
