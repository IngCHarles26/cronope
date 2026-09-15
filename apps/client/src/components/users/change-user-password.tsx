import { cn, style } from "../../lib/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDialogHeader } from "../app/dialog-header";
import { UserKey } from "lucide-react";
import { changePassSchema, type typeChangePassword } from "./types.interface";
import { TextInputRHF } from "../app/inputs/text";
import { useChangePasswordMutation } from "./hooks/useChangePassword";
import { FormButton } from "../app/buttons/form-button";
import type { DialogProps } from "../../lib/types/ui.interface";
import type { UserWithRole } from "better-auth/client/plugins";

export const ChangeUserPassword = ({ data, open, setOpen, setData }: DialogProps<UserWithRole>) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<typeChangePassword>({
    mode: "onChange",
    resolver: zodResolver(changePassSchema),
  });

  const goodClose = () => {
    reset();
    setOpen(null);
    setData(null);
  };
  const { isPending, mutate } = useChangePasswordMutation(goodClose);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(style.dialog, "w-90")}>
        <AppDialogHeader
          Icon={UserKey}
          title="Cambiar contraseña"
          description={`Cambiar la contraseña del usuario ${data.name}`}
        />
        <form
          onSubmit={handleSubmit((info) => mutate({ userId: data.id, password: info.password }))}
          className={style.form}>
          <div className={style.divForm}>
            <TextInputRHF
              label="Nueva contraseña"
              placeholder="Nueva contraseña"
              error={errors.password}
              register={register("password")}
            />
            <TextInputRHF
              label="Confirmar contraseña"
              placeholder="Confirmar contraseña"
              error={errors.confirmPassword}
              register={register("confirmPassword")}
            />
          </div>

          <FormButton isSubmitting={isPending} title="Guardar" />
        </form>
      </DialogContent>
    </Dialog>
  );
};
