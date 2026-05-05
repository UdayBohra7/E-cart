import { axios } from "@/lib/axios";


export const addNewProduct = async (data : any) => {
  const response = await axios.post('/products', data);
  return response.data;
};