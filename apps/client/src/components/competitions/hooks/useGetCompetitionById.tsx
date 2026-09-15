import { useQuery, useQueryClient } from "@tanstack/react-query";
import { minutes } from "../../../lib/utils";
import { genToastProps, toast } from "../../../lib/utils/toast";
import { api, apiRoutes } from "../../../lib/api";
import type { DetailCompetitionType } from "@cronope/schemas";
import { QK_COMPETITIONS } from "./useGetCompetitions";

const toastProps = genToastProps("use-get-competition-by-id");

export const genCompetitionKey = (id: string) => [...QK_COMPETITIONS, id];

const getCompetitionById = async (id: string) => {
  try {
    const { data: apiData } = await api.get<DetailCompetitionType>(
      `${apiRoutes.get.competitions}/${id}`,
    );
    const { message, success, data } = apiData;
    if (!success || !data) {
      toast.warning(message, toastProps);
      return null;
    }
    return data;
  } catch (err) {
    console.error(err);
    toast.error("Error al obtener la competencia", toastProps);
    return null;
  }
};

export const useGetCompetitionById = (id: string) => {
  const query = useQuery({
    queryKey: genCompetitionKey(id),
    queryFn: () => getCompetitionById(id),
    staleTime: 15 * minutes,
    gcTime: 30 * minutes,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};

export const usePrefetchCompetitionById = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: genCompetitionKey(id),
      queryFn: () => getCompetitionById(id),
      staleTime: 15 * minutes,
      gcTime: 30 * minutes,
    });
  };
};
