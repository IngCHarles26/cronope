import type { DialogProps } from "../../lib/types/ui.interface";
import { ConfirmActionDialog } from "../app/confirm-action";
import { Trash2 } from "lucide-react";
import { genToastProps, toast } from "../../lib/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { api, apiRoutes } from "../../lib/api";
import { QK_COMPETITIONS } from "./hooks/useGetCompetitions";
import type { CompetitionType } from "@cronope/schemas";
import { manageErrorFront } from "../../lib/utils";

const toastProps = genToastProps("delete-competition");

export const DeleteCompetition = ({
  data,
  open,
  setOpen,
  setData,
}: DialogProps<CompetitionType>) => {
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    toast.loading("Eliminando competencia...", toastProps);
    try {
      const { data: apiData } = await api.delete<null>(apiRoutes.delete.competition + data.id);
      const { message, success } = apiData;
      if (!success) return toast.error(message, toastProps);

      queryClient.invalidateQueries({ queryKey: QK_COMPETITIONS });
      setData(null);
      toast.success(message, toastProps);
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  return (
    <ConfirmActionDialog
      open={open}
      setOpen={setOpen}
      title={`¿Estás seguro de eliminar - ${data.name}?`}
      description="Esta acción no se puede deshacer"
      onClick={handleSubmit}
      Icon={Trash2}
      color="error"
    />
  );
};
