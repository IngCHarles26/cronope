import { parseLocalDate, type CompetitionType, type typeCompetitionSchema } from "@cronope/schemas";
import { useState } from "react";
import { genToastProps, toast } from "../../lib/utils/toast";
import { CompetitionForm } from "./competition-form";
import { api, apiRoutes } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QK_COMPETITIONS } from "./hooks/useGetCompetitions";
import { manageErrorFront } from "../../lib/utils";

const toastProps = genToastProps("new-competition");

export const NewCompetitionForm = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleSubmit = async (body: typeCompetitionSchema) => {
    const now = new Date();

    let message = "";
    const startDate = parseLocalDate(body.startDate);
    const endDate = parseLocalDate(body.endDate);

    message = "La fecha de inicio no puede ser anteriro a la de hoy";
    if (startDate < now) return toast.warning(message, toastProps);

    message = "La fecha de fin no puede ser anterior a la de hoy";
    if (endDate < now) return toast.warning(message, toastProps);

    message = "La fecha de fin no puede ser anterior a la de inicio";
    if (endDate < startDate) return toast.warning(message, toastProps);

    toast.loading("Creando competencia...", toastProps);

    try {
      const { data: apiData } = await api.post<CompetitionType, typeCompetitionSchema>(
        apiRoutes.post.competition,
        body,
      );
      const { success, message, data } = apiData;
      if (!success || !data) return toast.error(message, toastProps);
      setOpen(false);
      toast.success(message, toastProps);
      queryClient.invalidateQueries({ queryKey: QK_COMPETITIONS });
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  return <CompetitionForm open={open} setOpen={setOpen} onSubmit={handleSubmit} />;
};
