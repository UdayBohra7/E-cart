import { axios } from '@/lib/axios';
import { Content } from '../types';

export const getContent = (): Promise<Content> => {
  return axios.get('/content-management');
};

export const updateContent = (data: Partial<Content>): Promise<Content> => {
  return axios.put('/content-management', data);
};
