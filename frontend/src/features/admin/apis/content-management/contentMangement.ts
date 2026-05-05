import { axios } from "@/lib/axios"
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";

export const getContentManagementList = (): Promise<any> => {
    return axios.get(`/content-management`)
};

export type QueryFnType = typeof getContentManagementList;

type ContentManagementValues = {
    config?: QueryConfig<QueryFnType>;
}

export const useContentManagementList = ({ config }: ContentManagementValues) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: ['Content'],
        queryFn: () => getContentManagementList()
    })
}