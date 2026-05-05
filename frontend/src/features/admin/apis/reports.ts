import { axios } from "@/lib/axios";

export const getDashboardStats = async () => {
  const response = await axios.get('/reports/dashboard');
  return response.data;
};

export const getRecentCustomers = async () => {
    const response = await axios.get('/reports/recent-customers');
    return response.data;
};

export const getSalesReport = async () => {
    const response = await axios.get('/reports/sales-report');
    return response.data;
};

export const getWeeklyOrderStats = async (days) => {
    const response = await axios.get(`/reports/weekly-order-stats?days=${days}`);
    return response.data;
};
