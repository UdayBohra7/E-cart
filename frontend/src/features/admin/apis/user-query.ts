import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./user";

export const useUsers = ({ filters, queryConfig }: any) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    ...queryConfig,
  });
};
