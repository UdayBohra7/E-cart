import { axios } from "@/lib/axios";


export const getAdminUsers = async (search = "") => {
  const params: any = {};
  if (search && search.trim()) {
    params.search = search;
  }
  const response = await axios.get('/roles/users', { params });
  return response.data;
};