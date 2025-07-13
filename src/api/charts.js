import axiosClient from './axiosClient';
const chartApi = {
    getUserStats: async () => {
        const response = await axiosClient.get('/admin/chart/getUserStats');
        return response.data;
    },
};
export default chartApi;
