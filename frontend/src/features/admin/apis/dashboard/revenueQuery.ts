import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query';
import { ApiResponse } from '../types/response';
import { ChartData } from '../types/chart-data';

export const getRevenueChartDat = async (
  duration?: string,
): Promise<ApiResponse<ChartData>> => {
  const params = new URLSearchParams();

  if (duration) params.append('duration', duration);

  return axios.get(`/reports/revenue-chart${params.toString() ? `?${params.toString()}` : ''}`);
};

type QueryFnType = typeof getRevenueChartDat;

type ChartQuery = {
  config?: QueryConfig<QueryFnType>;
  duration?: string;
};

export const useRevenueChart = ({
  config,
  duration,
}: ChartQuery = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['Revenue-Chart', { duration }],
    queryFn: () => getRevenueChartDat(duration),
    keepPreviousData: true,
  });
};
