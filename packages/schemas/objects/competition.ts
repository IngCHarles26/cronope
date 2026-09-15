import z from "zod";
import { rgx0Spaces, rgxNumbers } from "./helpers.js";
import { SelectInputType } from "../types/ui.interface.js";
import { NoFinish } from "../types/db.interface.js";

// ________________________________________________________________ Competition
export const idCompetitionLength = 12;
const genName = (name: string) =>
  z.string().min(1, `Ingresa el ${name}`).max(50, `${name} es muy largo`);

const genTime = (max: number) =>
  z
    .string()
    .regex(rgx0Spaces, `Sin espacios`)
    .regex(rgxNumbers, `Solo números`)
    .refine((val) => +val && +val < max, `Máx ${max}`);

const date = z.string().min(1, "Ingresa la fecha");

export const competitionSchema = z.object({
  name: genName("nombre"),
  city: genName("ciudad"),
  participantInterval: genTime(600),
  categoryInterval: genTime(180),
  startTime: genTime(11),
  startDate: date,
  endDate: date,
});

export type typeCompetitionSchema = z.infer<typeof competitionSchema>;

export const competitionSchemaPartial = competitionSchema.partial();
export type typeCompetitionSchemaPartial = z.infer<typeof competitionSchemaPartial>;

export interface CompetitionType extends typeCompetitionSchema {
  id: string;
  status: boolean;
  createdAt: string;
}

export interface DetailCompetitionType {
  id: string;
  counters: CounterType[];
  participants: ParticipantType[];
  categories: CategoryType[];
}

// ________________________________________________________________ Counter
const counterSchema = z.object({
  userId: z.string().min(1, "Selecciona un usuario"),
  alias: z.string().min(1, "Ingresa un alias").max(40, "Alias es muy largo"),
});

export const competitionCounterSchema = z.object({
  list: z
    .array(counterSchema)
    .min(2, "Debe haber al menos dos contadores")
    .refine(
      (list) =>
        list.every((item, index, arr) => arr.findIndex((i) => i.userId === item.userId) === index),
      { message: "Los usuarios deben ser únicos" },
    )
    .refine(
      (list) =>
        list.every((item, index, arr) => arr.findIndex((i) => i.alias === item.alias) === index),
      { message: "Los alias deben ser únicos" },
    ),
});

export type typeCompetitionCounterSchema = z.infer<typeof competitionCounterSchema>;

export interface CounterType extends z.infer<typeof counterSchema> {
  id: number;
  competitionId: string;
  name: string | null;
  order: number;
}

// ________________________________________________________________ Category
const numberSCH = z.string().min(1, " ").max(4, " ");

const categorySchema = z.object({
  categoryId: z.string().min(1, " "),
  day: numberSCH,
  order: numberSCH,
  description: z.string().min(1, "Ingrese una descripción").max(255, "Descripción es muy larga"),
});

export interface CategoryType extends z.infer<typeof categorySchema> {
  id: number;
  competitionId: string;
  name: string;
}

export const competitionCategoriesSchema = z
  .object({
    help: z.literal("").nullable(),
    list: z.array(categorySchema).min(1, "Debe haber al menos una categoría"),
  })
  .superRefine(({ list }, ctx) => {
    const checks = {
      order: { message: "Los órdenes deben ser únicos para el mismo dia", set: new Set() },
      categoryId: { message: "Las categorías deben ser únicas", set: new Set() },
    };

    list.forEach((data, index) => {
      for (const _key in checks) {
        const key = _key as keyof typeof checks;
        const value = key === "order" ? `${data[key]}-${data.day}` : data[key];
        if (!value) continue;

        if (checks[key].set.has(value)) {
          ctx.addIssue({
            code: "custom",
            message: " ",
            path: ["list", index, key],
          });
          ctx.addIssue({
            code: "custom",
            message: checks[key].message,
            path: ["help"],
          });
        } else {
          checks[key].set.add(value);
        }
      }
    });
  });
export type typeCompetitionCategoriesSchema = z.infer<typeof competitionCategoriesSchema>;

// ________________________________________________________________ Participant
const numberSCHnull = numberSCH.or(z.literal("")).nullable();

const participantSchema = z.object({
  competitorId: z.string().min(1, "Seleccione un competidor"),
  categoryId: z.string().min(1, "Seleccione una categoría"),
  teamId: z.string().or(z.literal("")).nullable(),
  order: numberSCHnull,
  dorsal: numberSCHnull,
});

export interface ParticipantType extends z.infer<typeof participantSchema> {
  id: number;
  competitionId: string;
  times: string[];
}

export const competitionParticipantSchema = z
  .object({
    help: z.literal("").nullable(),
    list: z.array(participantSchema).min(1, "Debe haber al menos un participante para agregar"),
  })
  .superRefine(({ list }, ctx) => {
    const checks = {
      order: { message: "Los órdenes deben ser únicos por categoria", set: new Set() },
      dorsal: { message: "Los dorsales deben ser únicos", set: new Set() },
      competitorId: { message: "Los competidores deben ser únicos", set: new Set() },
    };

    list.forEach((data, index) => {
      for (const _key in checks) {
        const key = _key as keyof typeof checks;
        const value = key === "order" ? `${data[key]}-${data.categoryId}` : data[key];
        if (!value) continue;

        if (checks[key].set.has(value)) {
          ctx.addIssue({
            code: "custom",
            message: " ",
            path: ["list", index, key],
          });
          ctx.addIssue({
            code: "custom",
            message: checks[key].message,
            path: ["help"],
          });
        } else {
          checks[key].set.add(value);
        }
      }
    });
  });

export type typeCompetitionParticipantSchema = z.infer<typeof competitionParticipantSchema>;

export type CompetitionLiveInfo = {
  competitionId: string;
  counterAlias: string;
  counterId: number;
  competitionName: string;
  counterOrder: number;
  categories: SelectInputType[];
  participants: Record<string, SelectInputType[]>;
};

export type ParticipantResult = {
  name: string;
  category: string;
  team: string | null;
  order: number | null;
  dorsal: number | null;
  times: number[];
  noFinish: NoFinish | null;
};

export interface GetAllCompetitions {
  competitions: CompetitionType[];
  counterCalendar: Calendar;
}

export type Calendar = Record<
  string,
  { name: string; competition: string; start: number; end: number }[]
>;
