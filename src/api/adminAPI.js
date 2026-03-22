import { yugiClient } from './axiosClient';

const adminAPI = {
    getAllAccounts: async () => {
        try {
            const response = await yugiClient.get("/admin/accounts");
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getVersionClient: async () => {
        try {
            const response = await yugiClient.get("/admin/get-version-client");
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    setVersionClient: async (data) => {
        try {
            const response = await yugiClient.post("/admin/set-version-client", data);
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default adminAPI;