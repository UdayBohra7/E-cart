import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';

export const getFaqs = async (
  search?: string,
  page?: number,
  limit?: number
): Promise<any> => {
  const params = new URLSearchParams();

  if (search) {
    params.append('search', search);
  }
  if (page !== undefined) {
    params.append('page', page.toString());
  }
  if (limit !== undefined) {
    params.append('limit', limit.toString());
  }

  return axios.get(`/content-management/faq${params.toString() ? `?${params.toString()}` : ''}`);
};

type QueryFnType = typeof getFaqs;

type FaqQuery = {
  config?: QueryConfig<QueryFnType>;
  search?: string;
  page?: number;
  limit?: number;
};

export const useFaqList = ({
  config,
  search,
  page = 1,
  limit = 10,
}: FaqQuery = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['faq-list', { search, page, limit }],
    queryFn: () => getFaqs(search, page, limit),
    keepPreviousData: true,
  });
};
