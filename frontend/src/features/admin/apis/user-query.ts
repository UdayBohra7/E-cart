import { useQuery } from '@tanstack/react-query';
import { QueryConfig } from '@/lib/react-query';
import { User } from './types/user';
import { axios } from '@/lib/axios';

interface GetUsersParams {
  search?: string;
  role?: string;
  sortBy?: string;
  limit?: number;
  page?: number;
}

interface GetUsersResponse {
  results: User[];
  limit: number;
  page: number;
  totalPages: number;
  totalResults: number;
}

export const getUsers = (params: GetUsersParams): Promise<GetUsersResponse> => {
  const { search, role, sortBy, limit, page } = params;

  const queryParams: Record<string, string | number> = {};
  if (search) queryParams.search = search;
  if (role) queryParams.role = role;
  if (sortBy) queryParams.sortBy = sortBy;
  if (limit) queryParams.limit = limit;
  if (page) queryParams.page = page;

  return axios.get('/users', { params: queryParams })
};

export const getUsersQueryOptions = (params: GetUsersParams) => ({
  queryKey: ['users', params],
  queryFn: () => getUsers(params),
});

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsers>;
  filters?: GetUsersParams;
};

export const useUsers = ({ queryConfig, filters }: UseUsersOptions = {}) => {
  const queryOptions = getUsersQueryOptions(filters || {});

  return useQuery({
    ...queryOptions,
    ...queryConfig,
  });
};
