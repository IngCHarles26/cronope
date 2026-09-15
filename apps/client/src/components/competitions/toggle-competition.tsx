import { ShieldBan, ShieldCheck } from "lucide-react";
import type { DialogProps } from "../../lib/types/ui.interface";
import { genToastProps, toast } from "../../lib/utils/toast";
import { ConfirmActionDialog } from "../app/confirm-action";
import { api, apiRoutes } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QK_COMPETITIONS } from "./hooks/useGetCompetitions";
import type { CompetitionType, GetAllCompetitions } from "@cronope/schemas";
import { manageErrorFront } from "../../lib/utils";

const toastProps = genToastProps("toggle=competition");

export const ToggleCompetition = ({
  open,
  setOpen,
  data,
  setData,
}: DialogProps<CompetitionType>) => {
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    toast.loading("Procesando...", toastProps);

    try {
      const apiAns = await api.patch<boolean, null>(apiRoutes.put.toggleCompetition + data.id);
      const { success, message } = apiAns.data;
      if (!success) return toast.error(message, toastProps);
      toast.success(message, toastProps);
      queryClient.setQueryData(QK_COMPETITIONS, (oldData: GetAllCompetitions) => {
        const { competitions } = oldData;
        const newCompetitions = competitions.map((item) =>
          item.id === data.id ? { ...item, status: !item.status } : item,
        );
        return oldData ? { ...oldData, competitions: newCompetitions } : {};
      });
      setOpen(null);
      setData(null);
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  const [Icon, title] = data.status ? [ShieldBan, "desactivar"] : [ShieldCheck, "activar"];

  return (
    <ConfirmActionDialog
      open={open}
      Icon={Icon}
      title={`${title} competencia ${data.name}`}
      description={`Estas seguro de ${title} la competencia`}
      onClick={handleSubmit}
      setOpen={setOpen}
      color={data.status ? "error" : "success"}
    />
  );
};
