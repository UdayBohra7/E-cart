import { axios } from '@/lib/axios';

const transformProduct = (product: any) => ({
    ...product,
    _id: product.id.toString(),
});

export const createProduct = async (data: any) => {
    const response = await axios.post(`/products`, data);
    return transformProduct(response);
};

export const getProductById = async (id: string) => {
    const response = await axios.get(`/products/${id}`);
    return transformProduct(response);
};

export const updateProduct = async (id: string, data: any) => {
    const response = await axios.patch(`/products/${id}`, data);
    return transformProduct(response);
};

export const deleteProduct = async (id: string) => {
    return axios.delete(`/products/${id}`);
};

export const getProducts = async (params: any) => {
    const response: any = await axios.get(`/products`, { params });
    return {
        ...response,
        results: response.results.map(transformProduct),
    };
};