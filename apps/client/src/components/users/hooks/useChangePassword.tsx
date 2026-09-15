import { useMutation, useQueryClient } from "@tanstack/react-query";
import { genToastProps, toast } from "../../../lib/utils/toast";
import { authClient } from "../../../lib/auth-client";
import { QK_USERS } from "./useGetUsers";

const toastProps = genToastProps("use-change-password");

export const useChangePasswordMutation = (resset: () => void) => {
  const queryClient = useQueryClient();

  const mutationFn = async ({ userId, password }: { userId: string; password: string }) => {
    toast.loading("Cambiando contraseña...", toastProps);
    return await authClient.admin.setUserPassword({ userId, newPassword: password });
  };

  const mutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (!data.data) return toast.error("Error al cambiar la contraseña", toastProps);
      resset();
      queryClient.invalidateQueries({ queryKey: QK_USERS });
      toast.success("Contraseña cambiada correctamente", toastProps);
    },
    onError: () => toast.error("Error al cambiar la contraseña", toastProps),
  });

  return mutation;
};
