import { axios } from "@/lib/axios"
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";


interface GetQueryManagementParams {
    type: "contact-us" | "help-&-support";
    sortBy?: string;
    limit?: number;
    page?: number;
    status?: string;
}

interface GetQueryManagementResponse {
    data: {
        results: any[];
        limit: number;
        page: number;
        totalPages: number;
        totalResults: number;
    }
}

export const getQueryManagementList = (params?: GetQueryManagementParams): Promise<GetQueryManagementResponse> => {
    const { sortBy, limit, page, type, status } = params || {};

    const queryParams: Record<string, string | number> = {};
    if (sortBy) queryParams.sortBy = sortBy;
    if (limit) queryParams.limit = limit;
    if (page) queryParams.page = page;
    if (type) queryParams.type = type;
    if (status) queryParams.status = status;
    return axios.get(`/app/query-management`, { params: queryParams });
};

export type QueryFnType = typeof getQueryManagementList;

type QueryManagementValue = {
    config?: QueryConfig<QueryFnType>;
    filters?: GetQueryManagementParams;
}

export const useQueryManagement = ({ config, filters }: QueryManagementValue) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: ['QueryManagement', filters],
        queryFn: () => getQueryManagementList(filters)
    })
}

export const getQueryManagementById = ({ queryId }: { queryId: string }): Promise<any> => {
    return axios.get(`/app/query-management/${queryId}`);
};

export type QueryByIdFnType = typeof getQueryManagementById;

type QueryManagementByIdValue = {
    config?: QueryConfig<QueryByIdFnType>;
    queryId: string;
}

export const useQueryManagementById = ({ config, queryId }: QueryManagementByIdValue) => {
    return useQuery<ExtractFnReturnType<QueryByIdFnType>>({
        ...config,
        queryKey: ['QueryManagement', queryId],
        queryFn: () => getQueryManagementById({ queryId }),
        enabled: !!queryId
    })
}