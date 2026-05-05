import { axios } from "@/lib/axios"
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { useQuery } from "@tanstack/react-query";

export const getNotifications = (): Promise<any> => {
    return axios.get(`/notifications`)
};

export type QueryFnType = typeof getNotifications;

type NotificationValues = {
    config?: QueryConfig<QueryFnType>;
}

export const useNotificationList = ({ config }: NotificationValues) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: ['Notifications'],
        queryFn: () => getNotifications()
    })
}