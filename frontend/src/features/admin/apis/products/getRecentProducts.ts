import { axios } from "@/lib/axios";


export const getRecentProducts = async () => {
  const response = await axios.get('/products/dashboard/recent');
  return response.data;
};