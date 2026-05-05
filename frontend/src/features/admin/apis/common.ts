
import { axios } from '@/lib/axios';

type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
};

export const uploadFile = (file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post('/upload-file', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
