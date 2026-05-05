import { axios } from '@/lib/axios';

export interface Coupon {
  _id: string;
  name: string;
  code: string;
  discountPrice: number;
  activeDate: string;
  limit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export const getCoupons = (): Promise<ApiResponse<{ results: Coupon[]; total: number; page: number; limit: number; totalPages: number }>> => {
  return axios.get('/coupons');
};

export const getCouponById = (id: string): Promise<ApiResponse<Coupon>> => {
  return axios.get(`/coupons/${id}`);
};

export const createCoupon = (data: Partial<Coupon>): Promise<ApiResponse<Coupon>> => {
  return axios.post('/coupons', data);
};

export const updateCoupon = (id: string, data: Partial<Coupon>): Promise<ApiResponse<Coupon>> => {
  return axios.put(`/coupons/${id}`, data);
};

export const deleteCoupon = (id: string): Promise<ApiResponse<null>> => {
  return axios.delete(`/coupons/${id}`);
};