import { useQuery, useQueryClient } from "@tanstack/react-query";
import { genToastProps, toast } from "../../../lib/utils/toast";
import { minutes } from "../../../lib/utils";
import { api, apiRoutes } from "../../../lib/api";
import type { ParticipantResult } from "@cronope/schemas";

const toastProps = genToastProps("use-get-competition-results-by-id");

const QK_RESULTS = ["competition-results"];

export const genResultsKey = (id: string) => [...QK_RESULTS, id];

const getCompetitionResultsById = async (id: string) => {
  try {
    const { data: apiData } = await api.get<ParticipantResult[]>(
      apiRoutes.get.competitionResults + id,
    );

    const { message, success, data } = apiData;

    if (!success || !data) {
      toast.error(message, toastProps);
      return null;
    }
    return data;
  } catch (err) {
    toast.error("Error al obtener los resultados de la competencia", toastProps);
    console.error(err);
    return null;
  }
};

export const useGetCompetitionResultsById = (id: string) => {
  const query = useQuery({
    queryKey: genResultsKey(id),
    queryFn: () => getCompetitionResultsById(id),
    staleTime: 15 * minutes,
    gcTime: 30 * minutes,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};

export const usePrefetchCompetitionReslutsById = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: genResultsKey(id),
      queryFn: () => getCompetitionResultsById(id),
      staleTime: 15 * minutes,
      gcTime: 30 * minutes,
    });
  };
};
