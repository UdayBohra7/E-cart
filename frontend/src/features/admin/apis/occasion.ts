
import { axios } from '@/lib/axios';

export interface Occasion {
    _id: string;
    title: string;
    description: string;
    image: string;
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
};

export const getOccasions = (): Promise<ApiResponse<Occasion[]>> => {
    return axios.get('/occasions');
};

export const getOccasionById = (id: string): Promise<ApiResponse<Occasion>> => {
    return axios.get(`/occasions/${id}`);
};

export const createOccasion = (data: { title: string; description: string; image: string }): Promise<ApiResponse<Occasion>> => {
    return axios.post('/occasions', data);
};

export const updateOccasion = (id: string, data: { title?: string; description?: string; image?: string }): Promise<ApiResponse<Occasion>> => {
    return axios.put(`/occasions/${id}`, data);
};
