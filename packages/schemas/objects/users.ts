import z from "zod";
import { rgx0Spaces, rgxLettersNumbers, rgx1Upper, rgx1Number, rgxSpecialChar } from "./helpers.js";

const user = z
  .string()
  .min(1, "Ingrese el usuario")
  .max(30, "Demasiado largo")
  .regex(rgx0Spaces, "Sin espacios en blanco")
  .regex(rgxLettersNumbers, "Solo letras o números");

const password = z
  .string()
  .min(8, `Debe tener al menos 8 caracteres`)
  .max(50, `Es demasiado larga`)
  .regex(rgx0Spaces, `No puede tener espacios en blanco`)
  .regex(rgx1Upper, `Debe contener al menos una mayúscula`)
  .regex(rgx1Number, `Debe contener al menos un número`)
  .regex(rgxSpecialChar, `Debe incluir al menos uno: @ # $ % & * !`);

export const userSchema = z.object({ user, password });

export const newUserSchema = userSchema
  .extend({ confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type typeUserSchema = z.infer<typeof userSchema>;
export type typeNewUserSchema = z.infer<typeof newUserSchema>;
