import { type CompetitorType, type typeCompetitorSchema } from "@cronope/schemas";
import type { DialogProps } from "../../../lib/types/ui.interface";
import { CompetitorForm } from "./competitor-form";
import { manageErrorFront } from "../../../lib/utils";
import { genToastProps, toast } from "../../../lib/utils/toast";
import { api, apiRoutes } from "../../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QK_COMPETITORS } from "./hooks/useGetCompetitors";

const toastProps = genToastProps("edit-competitor-form");

export const EditCompetitorForm = ({
  data,
  open,
  setData,
  setOpen,
}: DialogProps<CompetitorType>) => {
  const queryClient = useQueryClient();

  const handleSubmit = async (body: typeCompetitorSchema) => {
    if (!data) return toast.error("No se pudo obtener el competidor a editar", toastProps);
    const { id } = data;
    toast.loading("Editando competidor...", toastProps);

    try {
      const { data: dataResponse } = await api.patch<CompetitorType, typeCompetitorSchema>(
        apiRoutes.put.competitor + id,
        body,
      );
      const { success, message, data: updatedData } = dataResponse;
      if (!success || !updatedData) return toast.error(message, toastProps);
      setOpen(false);
      setData(null);
      queryClient.setQueryData(QK_COMPETITORS, (oldData: CompetitorType[] | undefined) => {
        if (!oldData) return [updatedData];
        return oldData.map((competitor) =>
          competitor.id === updatedData.id ? updatedData : competitor,
        );
      });
      toast.success(message, toastProps);
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  return (
    data && (
      <CompetitorForm
        defaultValues={{ ...data }}
        open={open}
        setOpen={setOpen}
        onSubmit={handleSubmit}
      />
    )
  );
};
