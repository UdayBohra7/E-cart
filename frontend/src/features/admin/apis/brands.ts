import { axios } from '@/lib/axios';

export interface Brand {
    _id: string;
    name: string;
    description?: string;
    logo?: string;
    createdAt?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
};

export const getBrands = (params?: any): Promise<ApiResponse<Brand[]>> => {
    return axios.get('/brands', { params });
};

export const getBrandById = (id: string): Promise<{ brand: Brand, code: number, message: string }> => {
    return axios.get(`/brands/${id}`);
};

export const createBrand = (data: FormData): Promise<ApiResponse<Brand>> => {
    return axios.post('/brands', data);
};

export const updateBrand = (id: string, data: FormData): Promise<ApiResponse<Brand>> => {
    return axios.put(`/brands/${id}`, data);
};

export const deleteBrand = (id: string): Promise<ApiResponse<null>> => {
    return axios.delete(`/brands/${id}`);
};
