import { useQuery } from "@tanstack/react-query";
import { authClient } from "../../../lib/auth-client";
import { minutes } from "../../../lib/utils";
import { genToastProps, toast } from "../../../lib/utils/toast";

const toastProps = genToastProps("use-get-users");

export const QK_USERS = ["users"];

export const useGetUsers = () => {
  const queryFn = async () => {
    toast.loading("Cargando usuarios...", toastProps);
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          sortBy: "email",
          sortDirection: "asc",
          filterField: "role",
          filterValue: "counter",
        },
      });
      if (error || !data) {
        toast.error("Error al cargar usuarios", toastProps);
        return null;
      }

      toast.success("Usuarios cargados", toastProps);
      return data.users;
    } catch (_) {
      return null;
    }
  };

  const query = useQuery({
    queryFn,
    queryKey: QK_USERS,
    staleTime: 5 * minutes,
    gcTime: 10 * minutes,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
};
