import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "../../../lib/auth-client";
import { QK_USERS } from "./useGetUsers";
import { genToastProps, toast } from "../../../lib/utils/toast";

const toastProps = genToastProps("use-toggle-user");

export const useToggleUserMutation = (reset: () => void) => {
  const queryClient = useQueryClient();

  const mutationFn = async ({ banned, userId }: { banned: boolean; userId: string }) => {
    toast.loading(banned ? "Habilitando usuario..." : "Vetando usuario...", toastProps);
    const { banUser, unbanUser } = authClient.admin;
    const action = banned ? unbanUser : banUser;
    await action({ userId });
  };

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success("Usuario actualizado correctamente", toastProps);
      queryClient.invalidateQueries({ queryKey: QK_USERS });
      reset();
    },
    onError: () => toast.error("Error al cambiar el estado del usuario", toastProps),
  });

  return mutation;
};
