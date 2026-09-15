import { DB_convertString, type TeamType, type typeEditTeamSchema } from "@cronope/schemas";
import type { DialogProps } from "../../../lib/types/ui.interface";
import { Dialog, DialogContent } from "../../ui/dialog";
import { cn, style } from "../../../lib/utils";
import { AppDialogHeader } from "../../app/dialog-header";
import { FilePen } from "lucide-react";
import { TextInput } from "../../app/inputs/text";
import { useEffect, useState } from "react";
import { AsyncButton } from "../../app/buttons/async-button";
import { genToastProps, toast } from "../../../lib/utils/toast";
import { api, apiRoutes } from "../../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QK_TEAMS } from "./hooks/useGetTeams";

const toastProps = genToastProps("edit-team-form");

export const EditTeamForm = ({ data, open, setData, setOpen }: DialogProps<TeamType>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!data) return;
    setName(data.name);
  }, [data]);

  const handleClick = async () => {
    if (!data || isSubmitting) return;
    const newName = DB_convertString(name);
    if (!newName) return toast.error("El nombre no puede estar vacío", toastProps);

    toast.loading("Editando equipo...", toastProps);
    setIsSubmitting(true);
    try {
      const { data: apiData } = await api.patch<boolean, typeEditTeamSchema>(
        apiRoutes.put.team + data.id,
        { name: newName },
      );
      const { message, success } = apiData;
      if (!success) return toast.error(message, toastProps);

      toast.success(message, toastProps);
      setOpen(false);
      setData(null);
      queryClient.setQueryData(QK_TEAMS, (oldData: TeamType[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((team) => (team.id === data.id ? { ...team, name: newName } : team));
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al editar el equipo", toastProps);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    data && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={cn(style.dialog, "w-90")}>
          <AppDialogHeader
            Icon={FilePen}
            description="Ingresa el nuevo nombre de equipo"
            title="Editar nombre"
          />
          <div className={style.form}>
            <div className={style.divForm}>
              <TextInput placeholder="nuevo nombre" value={name} onChange={setName} />
            </div>
            <div className="flex items-center justify-end mb-0 mt-4">
              <AsyncButton
                isSubmitting={isSubmitting}
                onClick={handleClick}
                title="Guardar"
                className={cn(style.formButton, "ml-auto")}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};
