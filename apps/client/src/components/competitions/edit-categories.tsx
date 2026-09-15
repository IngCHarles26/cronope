import type { DialogProps } from "../../lib/types/ui.interface";
import {
  competitionCategoriesSchema,
  parseLocalDate,
  type CompetitionType,
  type SelectInputType,
  type typeCompetitionCategoriesSchema,
} from "@cronope/schemas";
import { Dialog, DialogContent } from "../ui/dialog";
import { cn, days, genCanDelete, manageErrorFront, style } from "../../lib/utils";
import { AppDialogHeader } from "../app/dialog-header";
import { ChartBarStacked, Trash2 } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusHeaderButton } from "../app/buttons/add-button-header";
import { FormButton } from "../app/buttons/form-button";
import { SelectInputRHF } from "../app/inputs/select";
import { TextAreaInputRHF } from "../app/inputs/text-area";
import { genCompetitionKey, useGetCompetitionById } from "./hooks/useGetCompetitionById";
import { useGetCategories } from "../extras/categories/hooks/useGetCategories";
import { useEffect, useMemo, useState } from "react";
import { genToastProps, toast } from "../../lib/utils/toast";
import { HiddenInput } from "../app/inputs/hidden";
import { api, apiRoutes } from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";

const toastProps = genToastProps("edit-categories");

export const EditCategories = ({ data, open, setOpen, setData }: DialogProps<CompetitionType>) => {
  const { id: competitionId, name, startDate, endDate } = data;
  const { data: competitionData } = useGetCompetitionById(competitionId);
  const { data: categoriesData } = useGetCategories();

  const queryClient = useQueryClient();
  const durationList = useMemo(() => {
    const duration = genDuration(startDate, endDate);
    return genOptionsList(duration);
  }, [startDate, endDate]);

  const disabled = genCanDelete(startDate);
  const [categoryList, setcategoryList] = useState<SelectInputType[]>([]);

  const {
    reset,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<typeCompetitionCategoriesSchema>({
    mode: "onChange",
    resolver: zodResolver(competitionCategoriesSchema),
    disabled,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "list" });
  const watchedCategoryList = useWatch({ control, name: "list" });
  const orderPerDay = useMemo(() => {
    if (!watchedCategoryList) return {};
    return genOrderPerDay(watchedCategoryList);
  }, [watchedCategoryList]);

  const handleDayChange = (index: number, day: string) => {
    if (!watchedCategoryList) return;

    watchedCategoryList.forEach((category, ix) => {
      if (ix === index || category.day !== day) return;
      setValue(`list.${ix}.order`, "");
    });
  };

  useEffect(() => {
    if (!competitionData) return;

    if (competitionData.categories.length === 0)
      return reset({
        list: [{ categoryId: "", day: "", description: "", order: "" }],
      });
    reset({
      list: competitionData.categories.map((category) => ({
        categoryId: category.categoryId,
        day: category.day,
        description: category.description,
        order: category.order,
      })),
    });
  }, [open, competitionData]);

  useEffect(() => {
    if (!categoriesData) return;

    setcategoryList(
      categoriesData.map((category) => ({
        value: category.id,
        label: category.name.toUpperCase(),
      })),
    );
  }, [categoriesData]);

  if (!competitionData || !categoriesData) return null;

  const onSubmit = async (body: typeCompetitionCategoriesSchema) => {
    let message = "No se puede editar categorías de una competencia que ya inició";
    if (disabled) return toast.warning(message, toastProps);

    message = "No se pudo obtener la competencia";
    if (!competitionData) return toast.warning(message, toastProps);

    if (body.list.length === competitionData.categories.length) {
      const isSame = body.list.every((c) => {
        const old = competitionData.categories.find((el) => el.categoryId === c.categoryId);
        if (!old) return false;
        return (
          c.categoryId === old.categoryId &&
          c.day === old.day &&
          c.description === old.description &&
          c.order === old.order
        );
      });
      if (isSame) return toast.warning("No se detectaron cambios", toastProps);
    }

    toast.loading("Actualizando categorías...", toastProps);

    try {
      const { data: apiData } = await api.patch<boolean, typeCompetitionCategoriesSchema>(
        apiRoutes.put.updateCompetitionCategories + competitionId,
        body,
      );
      const { success, message } = apiData;
      if (!success) return toast.error(message, toastProps);
      queryClient.invalidateQueries({ queryKey: genCompetitionKey(competitionId) });
      setOpen(null);
      setData(null);
      toast.success(message, toastProps);
    } catch (err) {
      manageErrorFront(toastProps, err);
    }
  };

  const moreThan1 = fields.length > 1;
  const moreThan4 = fields.length > 4;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          style.dialog,
          "w-100 min-w-100",
          moreThan1 && "w-200 min-w-200",
          moreThan4 && "w-300 min-w-300",
        )}>
        <AppDialogHeader
          Icon={ChartBarStacked}
          title={`Categorías - ${name}`}
          description="Agrega o retira categorias a la competencia"
          Component={
            categoryList.length > fields.length && (
              <PlusHeaderButton
                tooltip="Agregar Categoria"
                onClick={() => append({ categoryId: "", day: "", description: "", order: "" })}
                disabled={disabled}
              />
            )
          }
        />

        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          <div
            className={cn(style.divForm, moreThan1 && "grid-cols-2", moreThan4 && "grid-cols-3")}>
            {watchedCategoryList &&
              fields.map((field, index) => {
                const value = watchedCategoryList[index];
                if (!value) return null;

                const { categoryId, day, order } = value;

                const filteredCategories = categoryList.filter(
                  ({ value }) =>
                    value === categoryId ||
                    !watchedCategoryList.some((c) => c.categoryId === value),
                );

                const ordersPerDay = orderPerDay[day] || [];
                const filteredOrders = ordersPerDay.filter(
                  ({ value }) =>
                    value === order ||
                    !watchedCategoryList.some((c) => c.order === value && c.day === day),
                );

                return (
                  <div key={field.id} className="rounded p-2 border border-accent">
                    <div className="flex items-center gap-2">
                      <SelectInputRHF
                        placeholder="Categoria"
                        options={filteredCategories}
                        error={errors.list?.[index]?.categoryId}
                        register={register(`list.${index}.categoryId`)}
                        className="w-[55%]"
                      />
                      <SelectInputRHF
                        placeholder="Dia"
                        options={durationList}
                        error={errors.list?.[index]?.day}
                        register={register(`list.${index}.day`, {
                          onChange: (e) => handleDayChange(index, e.target.value),
                        })}
                        className="w-[20%]"
                      />
                      <SelectInputRHF
                        placeholder="Orden"
                        options={filteredOrders}
                        error={errors.list?.[index]?.order}
                        register={register(`list.${index}.order`)}
                        className="w-[25%]"
                      />
                      {fields.length > 1 && !disabled && (
                        <button
                          onClick={() => remove(index)}
                          className={style.formDeleteFieldButton}>
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>

                    <TextAreaInputRHF
                      placeholder="Bases de la categoría"
                      error={errors.list?.[index]?.description}
                      register={register(`list.${index}.description`)}
                    />
                  </div>
                );
              })}
          </div>
          <HiddenInput error={errors.help} register={register("help")} />
          {!disabled && <FormButton isSubmitting={isSubmitting} title="Guardar" />}
        </form>
      </DialogContent>
    </Dialog>
  );
};

const genOptionsList = (length: number): SelectInputType[] =>
  Array.from({ length }, (_, i) => {
    const str = (i + 1).toString();
    return { label: str, value: str };
  });

const genDuration = (startDate: string, endDate: string) =>
  Math.ceil(
    (parseLocalDate(endDate, false).getTime() - parseLocalDate(startDate).getTime()) / days,
  );

const genOrderPerDay = (list: typeCompetitionCategoriesSchema["list"] | undefined) => {
  if (!list || list.length === 0) return {};

  const ordersPerDay: Record<string, number> = {};
  for (const { day } of list) {
    if (!day) continue;

    if (!ordersPerDay[day]) {
      ordersPerDay[day] = 0;
    }
    ordersPerDay[day] += 1;
  }
  const ans: Record<string, SelectInputType[]> = {};
  for (const day in ordersPerDay) {
    ans[day] = genOptionsList(ordersPerDay[day]);
  }
  return ans;
};
