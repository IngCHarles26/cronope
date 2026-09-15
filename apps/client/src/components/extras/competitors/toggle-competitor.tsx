import type { CompetitorType } from "@cronope/schemas";
import type { DialogProps } from "../../../lib/types/ui.interface";
import { ConfirmActionDialog } from "../../app/confirm-action";
import { UserCheck, UserX } from "lucide-react";
import { genToastProps, toast } from "../../../lib/utils/toast";
import { api, apiRoutes } from "../../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QK_COMPETITORS } from "./hooks/useGetCompetitors";

const toastProps = genToastProps("toggle-competitor");

export const ToggleBanCompetitor = ({
  data,
  open,
  setOpen,
  setData,
}: DialogProps<CompetitorType>) => {
  const { banned, id } = data;
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    toast.loading("Procesando...", toastProps);

    let reason = "";

    if (!banned) {
      reason = window.prompt("Ingrese el motivo del cambio") || "";
      if (!reason) return toast.error("Ingresa el motivo", toastProps);
    }

    try {
      const apiAns = await api.patch<boolean, { reason: string }>(
        apiRoutes.put.toggleCompetitor + id,
        { reason },
      );
      const { success, message } = apiAns.data;

      if (!success) return toast.error(message, toastProps);
      toast.success(message, toastProps);
      setOpen(false);
      setData(null);

      queryClient.setQueryData<CompetitorType[]>(QK_COMPETITORS, (oldData) => {
        if (!oldData) return undefined;
        const ix = oldData.findIndex((competitor) => competitor.id === id);
        if (ix === -1) return oldData;
        const newData = [...oldData];
        newData[ix] = { ...newData[ix], banned: !banned, banReason: !banned ? reason : "" };
        return newData;
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar la solicitud", toastProps);
    }
  };

  const [Icon, title] = banned ? [UserCheck, "habilitar"] : [UserX, "vetar"];

  return (
    <ConfirmActionDialog
      open={open}
      Icon={Icon}
      title={`${title} ${data.name}`}
      description={`Estas seguro de ${title} al competidor`}
      setOpen={setOpen}
      onClick={handleSubmit}
      color={banned ? "success" : "error"}
    />
  );
};
