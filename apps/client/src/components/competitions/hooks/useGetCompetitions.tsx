import { useQuery } from "@tanstack/react-query";
import { genToastProps, toast } from "../../../lib/utils/toast";
import { api, apiRoutes } from "../../../lib/api";
import type { GetAllCompetitions } from "@cronope/schemas";
import { minutes } from "../../../lib/utils";

const toastProps = genToastProps("use-get-competitions");

export const QK_COMPETITIONS = ["competitions"];

export const useGetCompetitions = () => {
  const queryFn = async () => {
    toast.loading("Cargando competencias...", toastProps);
    try {
      const { data: _data } = await api.get<GetAllCompetitions>(apiRoutes.get.competitions);
      const { message, success, data } = _data;
      if (!success || !data) {
        toast.error(message, toastProps);
        return null;
      }
      toast.success("Competencias cargadas", toastProps);
      return data;
    } catch (_) {
      return null;
    }
  };

  const query = useQuery({
    queryFn,
    queryKey: QK_COMPETITIONS,
    staleTime: 30 * minutes, // 30 minutes
    gcTime: 60 * minutes, // 30 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};
