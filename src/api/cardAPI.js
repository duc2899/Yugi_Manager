import { yugiClient, ygoproClient } from "./axiosClient";

const cardApi = {
    getAllCards: async (params = {}) => {
        const response = await yugiClient.get(`/cards`, { params });
        return response.data;
    },
    checkExitCardById: async (cardId) => {
        const response = await ygoproClient.get(`/cardinfo.php`, { params: { id: cardId } });
        return response.data;
    }
}

export default cardApi;