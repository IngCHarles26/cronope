import { useQuery } from "@tanstack/react-query";
import { api, apiRoutes } from "../../../lib/api";
import type { CompetitionLiveInfo } from "@cronope/schemas";
import { manageErrorFront } from "../../../lib/utils";

export const QK_TODAY_COMPETITION = ["today-competition"];

export const useGetTodayCompetition = () => {
  const queryFn = async () => {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    try {
      const { data } = await api.get<CompetitionLiveInfo>(apiRoutes.get.todayCompetition);
      return data.data;
    } catch (error) {
      return null;
    }
  };

  return useQuery({
    queryFn,
    queryKey: QK_TODAY_COMPETITION,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
