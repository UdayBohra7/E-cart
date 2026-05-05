import { useQuery } from '@tanstack/react-query';
import { QueryConfig } from '@/lib/react-query';
import { getUsers } from './user';

interface GetUsersParams {
  search?: string;
  role?: string;
  sortBy?: string;
  limit?: number;
  page?: number;
}

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
