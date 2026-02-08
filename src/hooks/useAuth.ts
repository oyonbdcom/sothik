import { useGetCurrentUserQuery } from "@/redux/api/authApi";
import { useMemo } from "react";

export const useAuth = () => {
  const { data, isLoading, isError, refetch } = useGetCurrentUserQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false,
    }
  );

   
  const user = useMemo(() => data?.user || null, [data]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isError,
    refetch,
  };
};
