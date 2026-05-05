import { axios } from '@/lib/axios';

export type PlatformSetting = {
    _id: string;
    platformFeePercentage: number;
    insurancePrice: number;
    createdAt: string;
    updatedAt: string;
};

export const getPlatformSettings = (): Promise<{
    data: PlatformSetting;
    code: number;
    message: string;
}> => {
    return axios.get('/platform-settings');
};

export const updatePlatformSettings = (data: {
    platformFeePercentage?: number;
    insurancePrice?: number;
}): Promise<{
    data: PlatformSetting;
    code: number;
    message: string;
}> => {
    return axios.put('/platform-settings', data);
};
