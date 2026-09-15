import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Plus, UserPlus } from "lucide-react";
import { cn, manageErrorFront, style } from "../../lib/utils";
import { AppDialogHeader } from "../app/dialog-header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInputRHF } from "../app/inputs/text";
import { FormButton } from "../app/buttons/form-button";
import { newUserSchema, type typeNewUserSchema, type typeUserSchema } from "@cronope/schemas";
import { genToastProps, toast } from "../../lib/utils/toast";
import { api, apiRoutes } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QK_USERS } from "./hooks/useGetUsers";

const toastProps = genToastProps("new-user-form");

const NewUserForm = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
  } = useForm<typeNewUserSchema>({
    mode: "onChange",
    resolver: zodResolver(newUserSchema),
  });

  const onSubmit = async ({ user, password }: typeNewUserSchema) => {
    toast.loading("Creando usuario...", toastProps);

    try {
      const { data: apiData } = await api.post<boolean, typeUserSchema>(apiRoutes.post.user, {
        user,
        password,
      });
      const { message, success, data } = apiData;
      if (!success || !data) return toast.error(message, toastProps);

      queryClient.setQueryData(QK_USERS, (oldData: typeUserSchema[] | undefined) => {
        if (!oldData) return [data];
        return [...oldData, data];
      });
      reset();
      setOpen(false);
      toast.success(message, toastProps);
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={cn(style.headerButton)}>
        <Plus className="size-4 2xl:size-5" />
        nuevo usuario
      </DialogTrigger>

      <DialogContent className={cn(style.dialog, "w-90")}>
        <AppDialogHeader
          Icon={UserPlus}
          title="Nuevo usuario"
          description="Ingresa los datos del nuevo usuario"
        />
        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={style.divForm}>
            <TextInputRHF
              label="Usuario"
              placeholder="Nombre de usuario"
              error={errors.user}
              register={register("user")}
            />

            <TextInputRHF
              label="Contraseña"
              placeholder="Contraseña"
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

          <FormButton isSubmitting={isSubmitting} title="Crear" />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserForm;
