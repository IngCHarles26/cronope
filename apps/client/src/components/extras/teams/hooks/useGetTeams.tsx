import { useQuery } from "@tanstack/react-query";
import { genToastProps, toast } from "../../../../lib/utils/toast";
import { api, apiRoutes } from "../../../../lib/api";
import type { TeamType } from "@cronope/schemas";
import { minutes } from "../../../../lib/utils";

const toastProps = genToastProps("use-get-teams");

export const QK_TEAMS = ["teams"];

export const useGetTeams = () => {
  const queryFn = async () => {
    toast.loading("Cargando equipos...", toastProps);
    try {
      const { data: _data } = await api.get<TeamType[]>(apiRoutes.get.teams);
      const { message, success, data } = _data;
      if (!success || !data) {
        toast.error(message, toastProps);
        return null;
      }
      toast.success("Equipos cargados", toastProps);
      return data;
    } catch (_) {
      return null;
    }
  };

  const query = useQuery({
    queryFn,
    queryKey: QK_TEAMS,
    staleTime: 30 * minutes, // 30 minutes
    gcTime: 60 * minutes, // 60 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};
