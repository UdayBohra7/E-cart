import { axios } from '@/lib/axios';

export interface Category {
    _id: string;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
};

export const getCategories = (): Promise<ApiResponse<Category[]>> => {
    return axios.get('/categories');
};

export const getCategoryById = (id: string): Promise<ApiResponse<Category>> => {
    return axios.get(`/categories/${id}`);
};

export const createCategory = (data: { name: string }): Promise<ApiResponse<Category>> => {
    return axios.post('/categories', data);
};

export const updateCategory = (id: string, data: { name: string }): Promise<ApiResponse<Category>> => {
    return axios.put(`/categories/${id}`, data);
};
