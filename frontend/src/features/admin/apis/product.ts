import { axios } from '@/lib/axios';


interface SelectedDaysAndPrices {
  days: string;
  price: number;
}

interface Variant {
  color?: string;
  quantity?: number;
  size?: string;
  sizingCountry?: string;
  sizeAndFitNotes?: string;
  sellingPrice?: number;
  cleaningPrice?: number;
  listingType?: 'rent' | 'purchase' | 'both';
  price?: string;
  selectedDaysAndPrices?: SelectedDaysAndPrices[];
  product: any;
}

export interface Product {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  designerName?: string;
  description?: string;
  images?: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  variants?: Variant[];
  listingType: 'rent' | 'purchase' | 'both';
  selectedDaysAndPrices?: Array<{
    days: string;
    price: number;
  }>;
  shippingOptions: 'pick-up' | 'express' | 'both';
  sellingPrice?: number;
  isInsuranceAvailable?: boolean;
  insurancePrice?: number;
  createdAt: string;
  updatedAt: string;
}

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export const getProducts = (params?: any): Promise<ApiResponse<{ results: Product[]; total: number; page: number; limit: number; totalPages: number }>> => {
  return axios.get('/products', { params });
};

export const getProductById = (id: string): Promise<ApiResponse<Product>> => {
  return axios.get(`/products/${id}`);
};

export const updateProduct = (id: string, data: any): Promise<ApiResponse<Product>> => {
  return axios.put(`/products/${id}`, data);
};

export const deleteProduct = (id: string): Promise<ApiResponse<null>> => {
  return axios.delete(`/products/${id}`);
};