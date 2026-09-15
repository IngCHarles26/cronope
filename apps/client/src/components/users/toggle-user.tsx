import { ConfirmActionDialog } from "../app/confirm-action";
import { UserCheck, UserRoundX } from "lucide-react";
import { useToggleUserMutation } from "./hooks/useToggleUser";
import type { DialogProps } from "../../lib/types/ui.interface";
import type { UserWithRole } from "better-auth/client/plugins";

export const ToggleBanUser = ({
  data: user,
  open,
  setOpen,
  setData,
}: DialogProps<UserWithRole>) => {
  const { banned, name, id } = user;
  const action = banned ? "habilitar" : "vetar";

  const goodClose = () => {
    setOpen(null);
    setData(null);
  };

  const { mutate } = useToggleUserMutation(goodClose);

  return (
    <ConfirmActionDialog
      open={open}
      setOpen={setOpen}
      Icon={banned ? UserCheck : UserRoundX}
      title={`${action} usuario`}
      description={`¿Estás seguro de ${action} al usuario ${name}?`}
      color={banned ? "success" : "error"}
      onClick={async () => mutate({ banned: !!banned, userId: id })}
    />
  );
};
