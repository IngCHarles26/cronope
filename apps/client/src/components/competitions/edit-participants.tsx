import type { DialogProps } from "../../lib/types/ui.interface";
import { cn, genCanDelete, manageErrorFront, style } from "../../lib/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import { AppDialogHeader } from "../app/dialog-header";
import { FormButton } from "../app/buttons/form-button";
import {
  ArrowDown01,
  ListOrdered,
  ListRestart,
  RouteOff,
  Trash2,
  UserMinus,
  UserRoundPlus,
} from "lucide-react";
import {
  competitionParticipantSchema,
  type CompetitionType,
  type typeCompetitionParticipantSchema,
} from "@cronope/schemas";
import { useFieldArray, useForm, useWatch, type FieldArrayWithId } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { genCompetitionKey, useGetCompetitionById } from "./hooks/useGetCompetitionById";
import { useGetTeams } from "../extras/teams/hooks/useGetTeams";
import { useGetCompetitors } from "../extras/competitors/hooks/useGetCompetitors";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { PlusHeaderButton } from "../app/buttons/add-button-header";
import { SelectInputRHF } from "../app/inputs/select";
import { genToastProps, toast } from "../../lib/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { api, apiRoutes } from "../../lib/api";
import { ConfirmActionDialog } from "../app/confirm-action";
import { TextInputRHF } from "../app/inputs/text";
import { HiddenInput } from "../app/inputs/hidden";
import { IconButton } from "../app/buttons/icon-button";

const toastProps = genToastProps("edit-participants");

export const EditParticipants = ({
  data,
  open,
  setOpen,
  setData,
}: DialogProps<CompetitionType>) => {
  const { id: competitionId } = data;
  const { data: competitionData } = useGetCompetitionById(competitionId);
  const { data: teamsData } = useGetTeams();
  const { data: competitorsData } = useGetCompetitors();

  const categoriesList = useMemo(() => {
    if (!competitionData) return [];
    return competitionData.categories.map((c) => ({
      value: c.id.toString(),
      label: c.name.toUpperCase(),
    }));
  }, [competitionData]);

  const teamsList = useMemo(() => {
    if (!teamsData) return [];
    return teamsData.map((t) => ({ value: t.id, label: t.name.toUpperCase() }));
  }, [teamsData]);

  const competitorsList = useMemo(() => {
    if (!competitorsData) return [];
    return competitorsData.map((c) => ({
      value: c.id,
      label: `${c.lastName}, ${c.name}`,
    }));
  }, [competitorsData]);

  const [currentCategory, setcurrentCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [current, setCurrent] = useState<null | number>(null);
  const disabled = genCanDelete(data.startDate);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setValue,
  } = useForm<typeCompetitionParticipantSchema>({
    mode: "onChange",
    resolver: zodResolver(competitionParticipantSchema),
    disabled,
  });

  useEffect(() => {
    if (!competitionData) return;

    const { participants } = competitionData;
    if (participants.length === 0)
      return reset({
        list: [{ competitorId: "", categoryId: "", teamId: "" }],
      });

    reset({
      list: participants.map((p) => ({
        competitorId: p.competitorId,
        categoryId: p.categoryId,
        teamId: p.teamId || "",
        order: p.order || "",
        dorsal: p.dorsal || "",
      })),
    });
  }, [competitionData]);

  const { append, remove, fields: listFields } = useFieldArray({ control, name: "list" });
  const listParticipants = useWatch({ control, name: "list" });
  const categoriesSelected = useMemo(() => {
    if (!listParticipants) return [];
    return categoriesList.filter((c) => listParticipants.some((p) => p.categoryId === c.value));
  }, [categoriesList, listParticipants]);

  if (!competitionData || !teamsData || !competitorsData) return null;

  // _________________________________________________________ onSubmit
  const onSubmit = async (body: typeCompetitionParticipantSchema) => {
    if (body.list.length === competitionData.participants.length) {
      const isSame = body.list.every((p) => {
        const old = competitionData.participants.find((el) => el.competitorId === p.competitorId);
        if (!old) return false;
        return (
          p.competitorId === old.competitorId &&
          p.categoryId === old.categoryId &&
          p.teamId === old.teamId &&
          p.order === old.order &&
          p.dorsal === old.dorsal
        );
      });

      if (isSame) return toast.warning("No se detectaron cambios", toastProps);
    }

    toast.loading("Actualizando participantes...", toastProps);
    try {
      const { data: apiData } = await api.patch<boolean, typeCompetitionParticipantSchema>(
        apiRoutes.put.updateCompetitionParticipants + competitionId,
        body,
      );
      const { success, message } = apiData;
      if (!success) return toast.error(message, toastProps);

      queryClient.invalidateQueries({ queryKey: genCompetitionKey(competitionId) });
      setOpen(null);
      setData(null);
      toast.success(message, toastProps);
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  const handleResetDorsal = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();
    let ix = -1;
    for (const { categoryId } of listParticipants) {
      ix++;
      if (currentCategory && categoryId !== currentCategory) continue;
      setValue(`list.${+ix}.dorsal`, "");
    }
  };
  const handleGenDorsal = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();

    const maxDorsal = listParticipants.length;
    const dorsals = new Set(
      listParticipants.reduce((ac, { dorsal }) => {
        if (dorsal && +dorsal < maxDorsal) ac.push(+dorsal);
        return ac;
      }, [] as number[]),
    );

    let currentDorsal = 1;
    let ix = -1;

    for (const { dorsal } of listParticipants) {
      ix++;
      if (dorsal && +dorsal <= maxDorsal) continue;
      while (dorsals.has(currentDorsal)) currentDorsal++;

      setValue(`list.${ix}.dorsal`, `${currentDorsal}`);
      dorsals.add(currentDorsal);
    }
  };
  const handleResetOrder = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();
    let ix = -1;
    for (const { categoryId } of listParticipants) {
      ix++;
      if (currentCategory && categoryId !== currentCategory) continue;
      setValue(`list.${ix}.order`, "");
    }
  };
  const handleGenOrder = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();
    const maxOrders: Record<string, number> = {};
    const currentOrder: Record<string, number> = {};

    for (const { categoryId } of listParticipants) {
      if (!maxOrders[categoryId]) {
        maxOrders[categoryId] = 0;
        currentOrder[categoryId] = 1;
      }
      maxOrders[categoryId]++;
    }

    const orders: Record<string, Set<number>> = {};
    for (const { categoryId, order } of listParticipants) {
      if (!orders[categoryId]) orders[categoryId] = new Set();
      if (order && +order <= maxOrders[categoryId]) orders[categoryId].add(+order);
    }

    let ix = -1;
    for (const { categoryId, order } of listParticipants) {
      ix++;
      if (order && +order <= maxOrders[categoryId]) continue;
      while (orders[categoryId].has(currentOrder[categoryId])) currentOrder[categoryId]++;

      setValue(`list.${ix}.order`, `${currentOrder[categoryId]}`);
      orders[categoryId].add(currentOrder[categoryId]);
    }
  };

  return (
    <>
      {current && (
        <ConfirmActionDialog
          Icon={UserMinus}
          title="Eliminar participante"
          description="¿Estás seguro de que deseas eliminar este participante?"
          setOpen={(_: boolean) => setCurrent(null)}
          open={current !== null}
          onClick={async () => {
            remove(current);
            setCurrent(null);
          }}
          color="error"
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(style.dialog, "w-180 min-w-180 max-h-[80dvh] overflow-y-auto gap-0")}>
          <AppDialogHeader
            Icon={UserRoundPlus}
            title={`participantes - ${data.name}`}
            description="Agrega o elimina participantes de la competencia"
            Component={
              <PlusHeaderButton
                tooltip="Agregar"
                onClick={() =>
                  append({ competitorId: "", categoryId: "", teamId: "", dorsal: "", order: "" })
                }
                disabled={disabled}
              />
            }
          />
          {categoriesSelected.length > 0 && (
            <div className="w-full flex items-center gap-2 py-0 mt-2 mb-0 text-xs">
              <p className="text-chart-2 uppercase font-semibold">Categoria: </p>
              {categoriesSelected.map(({ value, label }) => (
                <button
                  key={value}
                  className={cn(
                    style.dialogButton,
                    currentCategory === value && "bg-primary text-white border-primary",
                  )}
                  onClick={() =>
                    value === currentCategory ? setcurrentCategory(null) : setcurrentCategory(value)
                  }>
                  {label}
                </button>
              ))}
            </div>
          )}
          <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={cn(style.divForm, "gap-2")}>
              {genFilteredField(listFields, currentCategory).map(({ field, index }) => {
                const currentCompetitorId = listParticipants?.[index]?.competitorId;
                const competitorOptions = competitorsList.filter(
                  (option) =>
                    option.value === currentCompetitorId ||
                    !listParticipants.some((p) => p.competitorId === option.value),
                );

                return (
                  <div key={field.id} className="flex items-start gap-2">
                    <TextInputRHF
                      placeholder="# 00"
                      error={errors.list?.[index]?.dorsal}
                      register={register(`list.${index}.dorsal`)}
                      className="w-13"
                    />

                    <TextInputRHF
                      placeholder="Orden"
                      error={errors.list?.[index]?.order}
                      register={register(`list.${index}.order`)}
                      className="w-16"
                    />

                    <SelectInputRHF
                      placeholder="participante"
                      options={competitorOptions}
                      error={errors.list?.[index]?.competitorId}
                      register={register(`list.${index}.competitorId`)}
                      className="w-[40%]"
                    />

                    <SelectInputRHF
                      placeholder="categoría"
                      options={categoriesList}
                      error={errors.list?.[index]?.categoryId}
                      register={register(`list.${index}.categoryId`)}
                      className="w-[20%]"
                    />

                    <SelectInputRHF
                      placeholder="sin equipo"
                      options={teamsList}
                      error={errors.list?.[index]?.teamId}
                      register={register(`list.${index}.teamId`)}
                      className="w-[20%]"
                      canEmpty
                    />

                    {listFields.length > 1 && !disabled && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (listParticipants[index].competitorId) {
                            setCurrent(index);
                          } else {
                            remove(index);
                          }
                        }}
                        className={style.formDeleteFieldButton}>
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <HiddenInput error={errors.help} register={register("help")} />
            {!disabled && (
              <div className="flex items-center ">
                <div className="flex gap-2 mr-auto">
                  <IconButton
                    Icon={ListRestart}
                    tooltip="Resetear dorsal"
                    onClickForm={handleResetDorsal}
                  />
                  <IconButton
                    Icon={ListOrdered}
                    tooltip="Generar dorsal"
                    onClickForm={handleGenDorsal}
                  />
                  <IconButton
                    Icon={RouteOff}
                    tooltip="Resetear orden"
                    onClickForm={handleResetOrder}
                  />
                  <IconButton
                    Icon={ArrowDown01}
                    tooltip="Generar orden"
                    onClickForm={handleGenOrder}
                  />
                </div>
                <FormButton title="Guardar" isSubmitting={isSubmitting} />
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

type ParticipantFieldItem = FieldArrayWithId<
  typeCompetitionParticipantSchema,
  "list",
  "id" // nombre de la clave interna que react-hook-form asigna (por defecto 'id')
>;
const genFilteredField = (fields: ParticipantFieldItem[], currentCategory: string | null) => {
  const ans = [];
  let index = -1;
  for (const field of fields) {
    index++;
    if (currentCategory && field.categoryId && field.categoryId !== currentCategory) continue;

    ans.push({ field, index });
  }
  return ans;
};
