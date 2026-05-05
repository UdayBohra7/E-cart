import { axios } from '@/lib/axios';
import { User } from './types/user';

type ApiPromise = {
    code: number,
    message: string,
}

export const createUser = (data: any): Promise<Omit<ApiPromise, 'data'> & {
    data: User
}> => {
    return axios.post(`/users`, data);
};

export const getUserById = (id: string): Promise<Omit<ApiPromise, 'data'> & {
    data: User
}> => {
    return axios.get(`/users/${id}`);
};

export const updateUser = (id: string, data: any): Promise<Omit<ApiPromise, 'data'> & {
    data: User
}> => {
    return axios.put(`/users/${id}`, data);
};

export const blockUnblockUser = (id: string): Promise<Omit<ApiPromise, 'data'> & {
    data: User
}> => {
    return axios.put(`/users/${id}/block`);
};

export const deleteUser = (id: string): Promise<ApiPromise> => {
    return axios.delete(`/users/${id}`);
};

export const verifyUserIdentity = (id: string): Promise<Omit<ApiPromise, 'data'> & {
    data: User
}> => {
    return axios.put(`/users/${id}/verify-identity`);
};