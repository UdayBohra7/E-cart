import { axios } from '@/lib/axios';

export interface Category {
    id: number;
    _id: string;
    name: string;
    description?: string;
}

const transformCategory = (category: any) => ({
    ...category,
    _id: category.id.toString(),
});

export const createCategory = async (data: any) => {
    const response = await axios.post(`/categories`, data);
    return transformCategory(response);
};

export const getCategoryById = async (id: string) => {
    const response = await axios.get(`/categories/${id}`);
    return transformCategory(response);
};

export const updateCategory = async (id: string, data: any) => {
    const response = await axios.patch(`/categories/${id}`, data);
    return transformCategory(response);
};

export const deleteCategory = async (id: string) => {
    return axios.delete(`/categories/${id}`);
};

export const getCategories = async (params: any) => {
    const response: any = await axios.get(`/categories`, { params });
    return {
        ...response,
        results: response.results.map(transformCategory),
    };
};
