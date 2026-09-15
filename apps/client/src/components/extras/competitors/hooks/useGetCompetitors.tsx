import { useQuery } from "@tanstack/react-query";
import { genToastProps, toast } from "../../../../lib/utils/toast";
import { api, apiRoutes } from "../../../../lib/api";
import type { CompetitorType } from "@cronope/schemas";
import { minutes } from "../../../../lib/utils";

const toastProps = genToastProps("use-get-competitors");

export const QK_COMPETITORS = ["competitors"];

export const useGetCompetitors = () => {
  const queryFn = async () => {
    toast.loading("Cargando competidores...", toastProps);
    const { data: _data } = await api.get<CompetitorType[]>(apiRoutes.get.competitors);
    const { message, success, data } = _data;
    if (!success || !data) {
      toast.error(message, toastProps);
      return null;
    }
    toast.success("Competidores cargados", toastProps);
    return data;
  };

  const query = useQuery({
    queryFn,
    queryKey: QK_COMPETITORS,
    staleTime: 30 * minutes, // 30 minutes
    gcTime: 60 * minutes, // 60 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};
