import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../../lib/auth-client";
import { minutes } from "../../../lib/utils";

export const QK_SESSION = ["session"];

export const useGetSession = () => {
  const queryFn = async () => {
    try {
      return await getSession();
    } catch (_) {
      return null;
    }
  };

  const query = useQuery({
    queryFn,
    queryKey: QK_SESSION,
    staleTime: 5 * minutes,
    gcTime: 10 * minutes,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};
