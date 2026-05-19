import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./user";
import { User } from "./types/user";

export const useUsers = ({ filters, queryConfig }: any) => {
  return useQuery<{ results: User[], totalPages: number, totalResults: number }>({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    ...queryConfig,
  });
};
