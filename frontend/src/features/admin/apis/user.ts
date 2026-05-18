import { axios } from '@/lib/axios';
import { User } from './types/user';

const transformUser = (user: any): User => ({
    ...user,
    _id: user.id.toString(), // Map Prisma numeric ID to string _id
});

export const createUser = async (data: any): Promise<User> => {
    const response = await axios.post(`/users`, data);
    return transformUser(response);
};

export const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get(`/users/${id}`);
    return transformUser(response);
};

export const updateUser = async (id: string, data: any): Promise<User> => {
    const response = await axios.patch(`/users/${id}`, data);
    return transformUser(response);
};

export const deleteUser = async (id: string): Promise<void> => {
    return axios.delete(`/users/${id}`);
};

export const getUsers = async (params: any): Promise<{ results: User[], totalPages: number, totalResults: number }> => {
    const response: any = await axios.get(`/users`, { params });
    return {
        ...response,
        results: response.results.map(transformUser),
    };
};

export const blockUnblockUser = async (id: string): Promise<any> => {
    return axios.post(`/users/${id}/block`);
};

export const verifyUserIdentity = async (id: string): Promise<any> => {
    return axios.post(`/users/${id}/verify-identity`);
};