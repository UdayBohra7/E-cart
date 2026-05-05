import { axios } from '@/lib/axios';
import { Product } from './product';
import { User } from './types/user';
import { useQuery, QueryKey } from '@tanstack/react-query';
import { QueryConfig } from '@/lib/react-query';

export interface OrderItem {
  id: string; // Virtual property added by mongoose
  _id: string;
  orderId: string;
  product: Product;
  buyer: User;
  seller: User;
  quantity: number;
  totalPrice: string;
  variant?: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  orderType: 'rent' | 'purchase';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingMethod: 'pick-up' | 'express';
  shippingPrice: string;
  trackingId?: string;
  toAddressId?: any; // Define Address type if needed
  fromAddressId?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string; // Virtual property added by mongoose
  _id: string;
  orderNumber: string; // Assuming 'WD' + timestamp
  buyer: User;
  orderItems: OrderItem[];
  totalAmount: string;
  transactionId?: string;
  status: "fulfilled" | "unfulfilled" | "partially-fulfilled";
  createdAt: string;
  updatedAt: string;
  product_details?: any;
  buyer_details?: any;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  pendingPayments: number;
  refunds: number;
  inProgress: number;
}

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export const getOrders = (params?: { search?: string; page?: number; limit?: number; startDate?: string; endDate?: string }): Promise<ApiResponse<{ results: Order[]; total: number; page: number; limit: number; totalPages: number }>> => {
  return axios.get('/orders', { params });
};

export const getOrderStats = (): Promise<ApiResponse<OrderStats>> => {
  return axios.get('/orders/stats');
};

export const getOrderById = (id: string): Promise<ApiResponse<Order>> => {
  return axios.get(`/orders/${id}`);
};

export const getOrderQueryOptions = (id: string) => ({
  queryKey: ['orders', id],
  queryFn: () => getOrderById(id),
  enabled: !!id,
});

type UseOrderOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getOrderById>;
};

export const useOrder = ({ id, queryConfig }: UseOrderOptions) => {
  return useQuery<ApiResponse<Order>, unknown, ApiResponse<Order>, QueryKey>(
    ['orders', id],
    () => getOrderById(id),
    queryConfig
  );
};

export const updateOrder = (id: string, data: any): Promise<ApiResponse<Order>> => {
  return axios.put(`/orders/${id}`, data);
};

export const deleteOrder = (id: string): Promise<ApiResponse<null>> => {
  return axios.delete(`/orders/${id}`);
};