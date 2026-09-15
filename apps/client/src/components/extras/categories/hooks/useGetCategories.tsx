import { useQuery } from "@tanstack/react-query";
import { genToastProps, toast } from "../../../../lib/utils/toast";
import { api, apiRoutes } from "../../../../lib/api";
import type { SimpleCategoryType } from "@cronope/schemas";
import { minutes } from "../../../../lib/utils";

const toastProps = genToastProps("use-get-categories");

export const QK_CATEGORIES = ["categories"];

export const useGetCategories = () => {
  const queryFn = async () => {
    toast.loading("Cargando categorias...", toastProps);
    try {
      const { data: _data } = await api.get<SimpleCategoryType[]>(apiRoutes.get.categories);
      const { message, success, data } = _data;
      if (!success || !data) {
        toast.error(message, toastProps);
        return null;
      }
      toast.success("Categorias cargadas", toastProps);
      return data;
    } catch (_) {
      return null;
    }
  };

  const query = useQuery({
    queryFn,
    queryKey: QK_CATEGORIES,
    staleTime: 30 * minutes, // 30 minutes
    gcTime: 60 * minutes, // 60 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};
