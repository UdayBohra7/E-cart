import { axios } from "@/lib/axios";


export const createAccess = async (data : any) => {
  const response = await axios.post('/roles/assign', data);
  return response.data;
};