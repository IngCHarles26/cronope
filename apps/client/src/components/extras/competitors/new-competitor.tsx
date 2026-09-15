import { useState } from "react";
import { type CompetitorType, type typeCompetitorSchema } from "@cronope/schemas";
import { CompetitorForm } from "./competitor-form";
import { genToastProps, toast } from "../../../lib/utils/toast";
import { manageErrorFront } from "../../../lib/utils";
import { api, apiRoutes } from "../../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QK_COMPETITORS } from "./hooks/useGetCompetitors";

const toastProps = genToastProps("new-competitor-form");

export const NewCompetitorForm = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (body: typeCompetitorSchema) => {
    toast.loading("Creando competidor...", toastProps);
    try {
      const { data: apiData } = await api.post<CompetitorType, typeCompetitorSchema>(
        apiRoutes.post.competitor,
        body,
      );
      const { success, message, data } = apiData;
      if (!success || !data) return toast.error(message, toastProps);
      queryClient.setQueryData(QK_COMPETITORS, (old: CompetitorType[] | undefined) => {
        if (!old) return [data];
        return [...old, data];
      });

      setOpen(false);
      toast.success(message, toastProps);
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  return <CompetitorForm open={open} setOpen={setOpen} onSubmit={handleSubmit} />;
};
