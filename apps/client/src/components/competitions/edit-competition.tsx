import {
  parseLocalDate,
  reverseInputString,
  type CompetitionType,
  type typeCompetitionSchema,
  type typeCompetitionSchemaPartial,
} from "@cronope/schemas";
import type { DialogProps } from "../../lib/types/ui.interface";
import { CompetitionForm } from "./competition-form";
import { genToastProps, toast } from "../../lib/utils/toast";
import { api, apiRoutes } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { QK_COMPETITIONS, useGetCompetitions } from "./hooks/useGetCompetitions";
import { useGetCompetitionById } from "./hooks/useGetCompetitionById";
import { manageErrorFront } from "../../lib/utils";

const toastProps = genToastProps("edit-competition");

export const EditCompetition = ({ data, open, setData, setOpen }: DialogProps<CompetitionType>) => {
  const competitionId = data.id;
  const { data: competitionsData } = useGetCompetitions();
  const { data: countersData } = useGetCompetitionById(competitionId);

  const queryClient = useQueryClient();

  if (!competitionsData || !countersData) return null;

  const handleSubmit = async (body: typeCompetitionSchema) => {
    let message = "No se pueden editar competencias sin la información completa";

    if (!competitionsData || !countersData) return toast.warning(message, toastProps);

    const diff: typeCompetitionSchemaPartial = {};
    for (const _key in body) {
      const key = _key as keyof typeCompetitionSchema;
      if (body[key] !== data[key]) diff[key] = body[key];
    }

    if (Object.keys(diff).length === 0)
      return toast.warning("No se detectaron cambios", toastProps);

    // Validacion de contadores si la fecha de inicio cambia
    if (body.startDate !== data.startDate) {
      const newStart = parseLocalDate(body.startDate).getTime();

      for (const { id, alias } of countersData.counters) {
        const counterCalendar = competitionsData.counterCalendar[id];
        if (!counterCalendar) continue;

        const conflict = counterCalendar.find(({ start, end, competition }) => {
          if (competition === data.name) return false;
          return start <= newStart && newStart <= end;
        });

        if (conflict) {
          const nameCompetition = conflict.competition;
          const dateCompetition = reverseInputString(body.startDate);

          message = `El contador ${alias} esta ocupado el ${dateCompetition} en ${nameCompetition}`;
          return toast.warning(message, toastProps);
        }
      }

      diff.startDate = body.startDate;
    }

    // Validacion de contadores si la fecha de fin cambia
    if (body.endDate !== data.endDate) {
      const newEnd = parseLocalDate(body.endDate).getTime();

      for (const { alias, userId } of countersData.counters) {
        const counterCalendar = competitionsData.counterCalendar[userId];
        if (!counterCalendar) continue;

        const conflict = counterCalendar.find(({ start, end, competition }) => {
          if (competition === data.name) return false;
          return start <= newEnd && newEnd <= end;
        });

        if (conflict) {
          const nameCompetition = conflict.competition;
          const dateCompetition = reverseInputString(body.endDate);
          message = `El contador ${alias} esta ocupado el ${dateCompetition} en ${nameCompetition}`;
          return toast.warning(message, toastProps);
        }
      }

      diff.endDate = body.endDate;
    }

    toast.loading("Editando competencia...", toastProps);

    try {
      const { data: apiData } = await api.patch<boolean, typeCompetitionSchemaPartial>(
        apiRoutes.put.editCompetition + competitionId,
        diff,
      );

      const { success, message } = apiData;
      if (!success) return toast.error(message, toastProps);
      setOpen(null);
      setData(null);
      queryClient.invalidateQueries({ queryKey: QK_COMPETITIONS });
      toast.success(message, toastProps);
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  const { id, status, createdAt, ...rest } = data;

  return (
    <CompetitionForm open={open} setOpen={setOpen} onSubmit={handleSubmit} defaultValues={rest} />
  );
};
