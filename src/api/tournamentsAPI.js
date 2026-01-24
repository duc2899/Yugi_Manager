import axios from "axios";

const API_URL = "https://admin.yugimaster.com/test-tournament";

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const createTournament = async (data) => {
    try {
        const response = await axiosClient.post(`/createTournament`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};