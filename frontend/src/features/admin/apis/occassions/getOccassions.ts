import { axios } from "@/lib/axios";


export const getOccasions = async () => {
  const response = await axios.get('/occasions');
  return response.data;
};