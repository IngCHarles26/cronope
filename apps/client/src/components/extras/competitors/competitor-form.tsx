import { useEffect } from "react";
import { cn, style } from "../../../lib/utils";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent } from "../../ui/dialog";
import {
  competitorSchema,
  Countries,
  Sex,
  TipoSangre,
  type SelectInputType,
  type typeCompetitorSchema,
} from "@cronope/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, UserPen, UserPlus } from "lucide-react";
import { AppDialogHeader } from "../../app/dialog-header";
import { TextInputRHF } from "../../app/inputs/text";
import { DateInputRHF } from "../../app/inputs/date";
import { FormButton } from "../../app/buttons/form-button";
import type { DialogFormType } from "../../../lib/types/ui.interface";
import { SelectInputRHF } from "../../app/inputs/select";
import { TextAreaInputRHF } from "../../app/inputs/text-area";

const sexOptions: SelectInputType[] = Object.entries(Sex).map(([id, name]) => ({
  value: id,
  label: name,
}));

const bloodOptions: SelectInputType[] = Object.entries(TipoSangre).map(([id, name]) => ({
  value: id,
  label: name,
}));

const countryOptions: SelectInputType[] = Object.entries(Countries).map(([id, { name, flag }]) => ({
  value: id,
  label: `${flag} ${name}`,
}));

export const CompetitorForm = ({
  defaultValues,
  open,
  setOpen,
  onSubmit,
}: DialogFormType<typeCompetitorSchema>) => {
  const [Icon, title, description, button] = defaultValues
    ? [UserPen, "Editar", "", "Guardar"]
    : [UserPlus, "Nuevo", "nuevos", "Crear"];

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
  } = useForm<typeCompetitorSchema>({
    mode: "onChange",
    resolver: zodResolver(competitorSchema),
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
    else reset({ sex: "", country: "pe", blood: "" });
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!defaultValues && (
        <DialogTrigger className={cn(style.headerButton, "text-xs")}>
          <Plus className={style.headerIconButton} />
        </DialogTrigger>
      )}
      <DialogContent className={cn(style.dialog, "w-160 min-w-160")}>
        <AppDialogHeader
          Icon={Icon}
          title={title + " competidor"}
          description={`Ingresa los datos del ${description} competidor (* obligatorio)`}
        />
        <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={cn(style.divForm, "grid-cols-6 pt-2 items-start")}>
            <TextInputRHF
              label="DNI *"
              placeholder="DNI"
              error={errors.dni}
              register={register("dni")}
              className="col-span-1"
            />
            <TextInputRHF
              label="Apellido *"
              placeholder="apellido"
              error={errors.lastName}
              register={register("lastName")}
              className="col-span-2"
            />
            <TextInputRHF
              label="Nombre *"
              placeholder="nombre"
              error={errors.name}
              register={register("name")}
              className="col-span-2"
            />
            <SelectInputRHF
              label="Sangre"
              placeholder=""
              error={errors.blood}
              register={register("blood")}
              options={bloodOptions}
              className="col-span-1"
            />
            <SelectInputRHF
              label="Sexo *"
              placeholder="sexo"
              error={errors.sex}
              register={register("sex")}
              options={sexOptions}
              className="col-span-2"
            />
            <DateInputRHF
              label="Nacimiento *"
              error={errors.born}
              register={register("born")}
              className="col-span-2"
            />
            <SelectInputRHF
              label="Nacionalidad *"
              placeholder="país"
              error={errors.country}
              register={register("country")}
              options={countryOptions}
              className="col-span-2"
            />

            <TextInputRHF
              label="Teléfono *"
              placeholder="teléfono"
              error={errors.phone}
              register={register("phone")}
              className="col-span-2"
            />
            <TextInputRHF
              label="Carnet (UCI)"
              placeholder="carnet (UCI)"
              error={errors.carnet}
              register={register("carnet")}
              className="col-span-2"
            />
            <TextInputRHF
              label="Email"
              placeholder="email"
              error={errors.email}
              register={register("email")}
              className="col-span-2"
            />
            <TextAreaInputRHF
              label="Alergias"
              placeholder="alergias"
              error={errors.alergy}
              register={register("alergy")}
              className="col-span-3 h-20"
            />
            <TextAreaInputRHF
              label="Contacto de Emergencia"
              placeholder="Datos dee persona de contacto"
              error={errors.emergency}
              register={register("emergency")}
              className="col-span-3"
            />
          </div>

          <FormButton isSubmitting={isSubmitting} title={button} />
        </form>
      </DialogContent>
    </Dialog>
  );
};
