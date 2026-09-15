import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import type { DialogFormType } from "../../lib/types/ui.interface";
import {
  competitionSchema,
  convertDateToInputString,
  type typeCompetitionSchema,
} from "@cronope/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Medal, Plus } from "lucide-react";
import { cn, style } from "../../lib/utils";
import { AppDialogHeader } from "../app/dialog-header";
import { FormButton } from "../app/buttons/form-button";
import { TextInputRHF } from "../app/inputs/text";
import { DateInputRHF } from "../app/inputs/date";

export const CompetitionForm = ({
  open,
  setOpen,
  onSubmit,
  defaultValues,
}: DialogFormType<typeCompetitionSchema>) => {
  const [title, description, button] = defaultValues
    ? ["Edita", "Edita", "Guardar"]
    : ["nueva", "Ingresa", "Crear"];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<typeCompetitionSchema>({
    mode: "onChange",
    resolver: zodResolver(competitionSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
    else {
      const date = convertDateToInputString(new Date());

      reset({
        city: "Arequipa",
        categoryInterval: "60",
        participantInterval: "90",
        startTime: "8",
        startDate: date,
        endDate: date,
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!defaultValues && (
        <DialogTrigger className={style.headerButton}>
          <Plus className={style.headerIconButton} />
          nueva
        </DialogTrigger>
      )}
      <DialogContent className={cn(style.dialog, "w-110 min-w-110")}>
        <AppDialogHeader
          Icon={Medal}
          title={`${title} competencia ${defaultValues ? `- ${defaultValues.name}` : ""} `}
          description={`${description} los datos de la competencia`}
        />
        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={cn(style.divForm, "grid-cols-2")}>
            <TextInputRHF
              label="Titulo"
              placeholder="Salida Mollebaya"
              register={register("name")}
              error={errors.name}
              className="col-span-2"
            />
            <TextInputRHF
              label="Ciudad"
              placeholder="Arequipa"
              register={register("city")}
              error={errors.city}
            />
            <TextInputRHF
              label="Segundos entre salidas"
              placeholder="(max 600)"
              register={register("participantInterval")}
              error={errors.participantInterval}
            />
            <TextInputRHF
              label="Minutos entre categorias"
              placeholder="(max 180)"
              register={register("categoryInterval")}
              error={errors.categoryInterval}
            />
            <TextInputRHF
              label="Hora de inicio por día"
              placeholder="11"
              register={register("startTime")}
              error={errors.startTime}
            />
            <DateInputRHF
              label="Fecha de inicio"
              register={register("startDate")}
              error={errors.startDate}
            />
            <DateInputRHF
              label="Fecha de fin"
              register={register("endDate")}
              error={errors.endDate}
            />
          </div>

          <FormButton title={button} isSubmitting={isSubmitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
};
