import axiosClient from './axiosClient';
const billApi = {
    getAllBills: async (params = {}) => {
        const response = await axiosClient.get('/admin/bill/getAllBills', { params });
        return response.data;
    },
    searchAdvanced: async (params = {}) => {
        const response = await axiosClient.get('/admin/bill/searchAdvanced', { params });
        return response.data;
    },
    getTotalPaidAmount: async () => {
        const response = await axiosClient.get('/admin/bill/getTotalPaidAmount');
        return response.data;
    },
    getPaymentMethod: async () => {
        const response = await axiosClient.get('/payment/getAllMethods');
        return response.data;
    },
    confirmBill: async (data) => {
        const response = await axiosClient.post('/admin/bill/confirmBill', data);
        return response.data;
    },
    cancelBill: async (data) => {
        const response = await axiosClient.post('/admin/bill/cancelBill', data);
        return response.data;
    },

    getChartDataBill: async () => {
        const response = await axiosClient.get('/admin/chart/getChartDataBill');
        return response.data;
    }
};
export default billApi;
