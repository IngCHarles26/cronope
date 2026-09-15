import z from "zod";
import { PartialNull, rgx0Spaces, rgxLetters, rgxLettersNumbers, rgxNumbers } from "./helpers.js";
import { genZdate, genZstr, genZstrLetters, genZstrNums } from "./foos.js";

export const idCompetitorLength = 12;

const sex = z.string().min(1, "Selecciona un sexo");
const dni = z
  .string()
  .regex(rgxNumbers, "Solo puede contener números")
  .regex(rgx0Spaces, "No puede contener espacios")
  .length(8, "Debe ser exactamente 8 números");

const helpName = z
  .string()
  .regex(rgxLetters, "Solo puede contener letras")
  .min(2, "Debe tener al menos 2 caracteres")
  .max(50, "No puede tener más de 50 caracteres");

const name = helpName;
const lastName = helpName;
const phone = z
  .string()
  .regex(rgxNumbers, "Solo puede contener números")
  .regex(rgx0Spaces, "No puede contener espacios")
  .length(9, "Debe tener exactamente 9 números")
  .refine((num) => num.startsWith("9"), "Debe comenzar con 9");

const country = z.string().min(1, "Selecciona un país");

const email = z.email("Ingresa un email válido").or(z.literal("")).nullable();

const alergy = z
  .string()
  .min(1, "Ingresa tus condiciones medicas")
  .max(50, "Explicacion muy larga")
  .or(z.literal(""))
  .nullable();

const blood = z.string().min(1, "Selecciona un tipo de sangre").or(z.literal("")).nullable();

const emergency = z
  .string()
  .min(1, "Ingresa un contacto de emergencia")
  .max(100, "Explicacion muy larga")
  .or(z.literal(""))
  .nullable();

const carnet = z
  .string()
  .regex(rgxNumbers, "Solo puede contener números")
  .regex(rgx0Spaces, "No puede contener espacios")
  .length(11, "Debe tener exactamente 11 números")
  .or(z.literal(""))
  .nullable();

const born = z.string().refine((date) => !isNaN(Date.parse(date)), "Ingresa una fecha válida");

export const competitorSchema = z.object({
  dni,
  sex,
  name,
  lastName,
  born,
  phone,
  country,
  email,
  alergy,
  blood,
  emergency,
  carnet,
});

export const competitorSchemaPartial = competitorSchema.partial();

export type typeCompetitorSchemaPartial = z.infer<typeof competitorSchemaPartial>;

export type typeCompetitorSchema = z.infer<typeof competitorSchema>;

type omitedCompetitorSchema = Omit<typeCompetitorSchema, "blood" | "sex" | "country">;

export interface CompetitorType extends omitedCompetitorSchema {
  id: string;
  banned: boolean;
  banReason: string | null;
  sex: Sex;
  country: Country;
  blood: TipoSangre | null;
}

export const TipoSangre = {
  op: "O+",
  on: "O-",
  ap: "A+",
  an: "A-",
  bp: "B+",
  bn: "B-",
  abp: "AB+",
  abn: "AB-",
} as const;

export const Countries = {
  pe: { flag: "🇵🇪", name: "peru" },
  cl: { flag: "🇨🇱", name: "chile" },
  bo: { flag: "🇧🇴", name: "bolivia" },
  co: { flag: "🇨🇴", name: "colombia" },
  ar: { flag: "🇦🇷", name: "argentina" },
  ec: { flag: "🇪🇨", name: "ecuador" },
  // US: { flag: "🇺🇸", name: "Estados Unidos" },
  // BR: { flag: "🇧🇷", name: "Brasil" },
  // ES: { flag: "🇪🇸", name: "España" },
  // MX: { flag: "🇲🇽", name: "Mexico" },
  // FR: { flag: "🇫🇷", name: "Francia" },
  // DE: { flag: "🇩🇪", name: "Alemania" },
  // CA: { flag: "🇨🇦", name: "Canada" },
} as const;

export const Sex = {
  m: "masculino",
  f: "femenino",
  o: "otro",
} as const;

export type Sex = keyof typeof Sex;
export type Country = keyof typeof Countries;
export type TipoSangre = keyof typeof TipoSangre;
