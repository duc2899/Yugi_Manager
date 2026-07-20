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

    getAllAccountsDetail: async (params = {}) => {
        try {
            const response = await yugiClient.get("/admin/accounts/detail", { params });
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
    },
    toggleBanUser: async (data) => {
        try {
            const response = await yugiClient.post("/admin/toggle-ban", data);
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getAllDeck: async () => {
        try {
            const response = await yugiClient.get("/admin/get-decks");
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getDetailDeck: async (id) => {
        try {
            const response = await yugiClient.get(`/admin/get-deck/${id}`);
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    updateDeck: async (data) => {
        try {
            const response = await yugiClient.post("/admin/save-deck", data);
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    createDeck: async (data) => {
        try {
            const response = await yugiClient.post("/admin/create-deck", data);
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteDeck: async (data) => {
        try {
            const response = await yugiClient.post("/admin/delete-deck", data);
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getActivityLogs: async (params = {}) => {
        try {
            const response = await yugiClient.get("/admin/get-logs", { params });
            return response.data
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
}

export default adminAPI;