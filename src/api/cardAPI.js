import axiosClient from "./axiosClient";

const cardApi = {
    getAllCards: async (params = {}) => {
        const response = await axiosClient.get(`/cardinfo.php`, { params });
        return response.data;
    },
    checkExitCardById: async (cardId) => {
        const response = await axiosClient.get(`/cardinfo.php`, { params: { id: cardId } });
        return response.data;
    }
}

export default cardApi;