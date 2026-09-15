import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { DialogProps } from "../../lib/types/ui.interface";
import { cn, genCanDelete, manageErrorFront, style } from "../../lib/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import { genCompetitionKey, useGetCompetitionById } from "./hooks/useGetCompetitionById";
import {
  competitionCounterSchema,
  DB_convertString,
  parseLocalDate,
  type SelectInputType,
  type CompetitionType,
  type typeCompetitionCounterSchema,
} from "@cronope/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimerReset, Trash2 } from "lucide-react";
import { FormButton } from "../app/buttons/form-button";
import { useGetUsers } from "../users/hooks/useGetUsers";
import { AppDialogHeader } from "../app/dialog-header";
import { useEffect, useState } from "react";
import { SelectInputRHF } from "../app/inputs/select";
import { TextInputRHF } from "../app/inputs/text";
import { genToastProps, toast } from "../../lib/utils/toast";
import { PlusHeaderButton } from "../app/buttons/add-button-header";
import { api, apiRoutes } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCompetitions } from "./hooks/useGetCompetitions";

const toastProps = genToastProps("edit-counters");

export const EditCounters = ({ data, open, setOpen, setData }: DialogProps<CompetitionType>) => {
  const { id, name } = data;
  const { data: competitionData } = useGetCompetitionById(id);
  const { data: usersData } = useGetUsers();
  const { data: competitionsData } = useGetCompetitions();
  const allData = !competitionData || !usersData || !competitionsData;

  const [counterList, setCounterList] = useState<SelectInputType[]>([]);
  const queryClient = useQueryClient();

  const disabled = genCanDelete(data.startDate);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<typeCompetitionCounterSchema>({
    mode: "onChange",
    resolver: zodResolver(competitionCounterSchema),
    disabled,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "list" });
  const watchListCounters = useWatch({ control, name: "list" });

  useEffect(() => {
    if (!competitionData) return;

    if (competitionData.counters.length === 0)
      return reset({
        list: [{ userId: "", alias: "" }],
      });

    reset({
      list: competitionData.counters.map((counter) => ({
        userId: counter.userId,
        alias: counter.alias,
      })),
    });
  }, [open, competitionData]);

  useEffect(() => {
    if (allData) return;

    const startCompetition = parseLocalDate(data.startDate).getTime();
    const endCompetition = parseLocalDate(data.endDate, false).getTime();
    const calendar = competitionsData.counterCalendar;

    const filtered: SelectInputType[] = [];

    for (const user of usersData) {
      const userCalendar = calendar[user.id];
      const option = { value: user.id, label: user.name || "sin nombre" };

      if (!userCalendar) {
        filtered.push(option);
        continue;
      }

      let isOccupied = false;
      for (const { start, end, competition } of userCalendar) {
        if (competition === data.name) break;
        if (startCompetition <= end && endCompetition >= start) {
          isOccupied = true;
          break;
        }
      }

      if (!isOccupied) filtered.push(option);
    }

    setCounterList(filtered);
  }, [usersData, competitionsData, competitionData]);

  if (allData) return null;

  // _________________________________________________________________ onSubmit
  const onSubmit = async (body: typeCompetitionCounterSchema) => {
    let message = "No se pueden editar contadores de competencias que ya han iniciado";
    if (disabled) return toast.warning(message, toastProps);
    if (!competitionData) return toast.warning("No se pudo obtener la competencia", toastProps);

    if (body.list.length === competitionData.counters.length) {
      const isSame = body.list.every((counter, ix) => {
        const item = competitionData.counters[ix];
        return counter.userId === item.userId && counter.alias === DB_convertString(item.alias);
      });
      if (isSame) return toast.warning("No se detectaron cambios", toastProps);
    }

    toast.loading("Actualizando contadores...", toastProps);

    try {
      const { data: apiData } = await api.patch<boolean, typeCompetitionCounterSchema>(
        apiRoutes.put.updateCompetitionCounters + id,
        body,
      );

      const { success, message } = apiData;
      if (!success) return toast.error(message, toastProps);

      setOpen(false);
      setData(null);
      queryClient.invalidateQueries({ queryKey: genCompetitionKey(id) });
      toast.success(message, toastProps);
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn(style.dialog, "w-120 min-w-120")}>
        <AppDialogHeader
          Icon={TimerReset}
          title={`Contadores - ${name}`}
          description="Agrega o elimina contadores de la competencia"
          Component={
            counterList.length > fields.length && (
              <PlusHeaderButton
                tooltip="Agregar contador"
                onClick={() => append({ alias: "", userId: "" })}
                disabled={disabled}
              />
            )
          }
        />

        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={cn(style.divForm, "gap-2")}>
            {fields.map((field, index) => {
              const currentId = watchListCounters?.[index]?.userId;
              const countersOptions = counterList.filter((option) => {
                return (
                  option.value === currentId ||
                  !watchListCounters.some((c) => c.userId === option.value)
                );
              });

              return (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="h-full flex justify-center">
                    <p className="text-chart-2 font-bold mt-1.5">{`C${index + 1}:`}</p>
                  </div>
                  <SelectInputRHF
                    placeholder="selecciona contador"
                    options={countersOptions}
                    error={errors.list?.[index]?.userId}
                    register={register(`list.${index}.userId`)}
                    className="w-1/2"
                  />
                  <TextInputRHF
                    placeholder="alias"
                    error={errors.list?.[index]?.alias}
                    register={register(`list.${index}.alias`)}
                    className="w-1/2"
                  />
                  {fields.length > 1 && !disabled && (
                    <button onClick={() => remove(index)} className={style.formDeleteFieldButton}>
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {!disabled && <FormButton isSubmitting={isSubmitting} title="Guardar" />}
        </form>
      </DialogContent>
    </Dialog>
  );
};
