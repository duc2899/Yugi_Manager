import axios from "axios";
import { yugiClient } from "./axiosClient";

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

export const getTournaments = async (params = {}) => {
    try {
        const response = await yugiClient.get("/tournaments", { params })
        return response.data
    } catch (error) {
        throw error.response?.data || error.message;
    }
}