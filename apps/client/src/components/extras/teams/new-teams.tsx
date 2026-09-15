import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { DatabasePlus, Plus, Trash2 } from "lucide-react";
import { cn, manageErrorFront, style } from "../../../lib/utils";
import { useFieldArray, useForm } from "react-hook-form";
import { newTeamsSchema, type TeamType, type typeNewTeamsSchema } from "@cronope/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDialogHeader } from "../../app/dialog-header";
import { FormButton } from "../../app/buttons/form-button";
import { TextInputRHF } from "../../app/inputs/text";
import { PlusHeaderButton } from "../../app/buttons/add-button-header";
import { genToastProps, toast } from "../../../lib/utils/toast";
import { api, apiRoutes } from "../../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QK_TEAMS } from "./hooks/useGetTeams";

const toastProps = genToastProps("new-teams-form");

export const NewTeamsForm = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
    control,
  } = useForm<typeNewTeamsSchema>({
    mode: "onChange",
    resolver: zodResolver(newTeamsSchema),
    defaultValues: { list: [{ name: "" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "list" });

  const onSubmit = async (data: typeNewTeamsSchema) => {
    toast.loading("Creando equipos...", toastProps);
    try {
      const { data: apiData } = await api.post<TeamType[], typeNewTeamsSchema>(
        apiRoutes.post.teams,
        data,
      );
      const { message, success, data: createdTeams } = apiData;

      if (!success || !createdTeams) return toast.error(message, toastProps);
      queryClient.setQueryData(QK_TEAMS, (old: TeamType[] | undefined) => {
        if (!old) return createdTeams;
        return [...old, ...createdTeams];
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
      <DialogTrigger className={cn(style.headerButton, "text-xs")}>
        <Plus className="size-4 2xl:size-5" />
      </DialogTrigger>
      <DialogContent className={cn(style.dialog, "w-90")}>
        <AppDialogHeader
          Icon={DatabasePlus}
          title="Nuevos equipos"
          description="Ingresa los datos de los nuevos equipos"
          Component={<PlusHeaderButton tooltip="Agregar" onClick={() => append({ name: "" })} />}
        />

        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={style.divForm}>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2">
                <TextInputRHF
                  className="flex-1"
                  placeholder={`nuevo equipo ${index + 1}`}
                  error={errors.list?.[index]?.name}
                  register={register(`list.${index}.name`)}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex size-9 shrink-0 items-center justify-center rounded border border-muted text-chart-1 transition-all hover:border-destructive/60 hover:text-destructive">
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <FormButton isSubmitting={isSubmitting} title="Crear" />
        </form>
      </DialogContent>
    </Dialog>
  );
};
