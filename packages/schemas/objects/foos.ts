import z from "zod";
import { rgx0Spaces, rgxLetters, rgxLettersNumbers, rgxNumbers } from "./helpers.js";

export const genZstringArray = (
  name: string,
  strMinLen: number,
  strMaxLen: number,
  minLen: number = 1,
) =>
  z
    .array(
      z.object({
        name: z
          .string()
          .min(strMinLen, `${name} debe tener al menos ${strMinLen} caracteres`)
          .max(strMaxLen, `${name} debe tener como máximo ${strMaxLen} caracteres`),
      }),
    )
    .min(minLen, `Debe haber al menos ${minLen} elementos en ${name}`);

export const genZstringIDArray = (strLen: number, name: string) =>
  z
    .array(
      z.object({
        id: z
          .string()
          .length(strLen, `${name} debe tener exactamente ${strLen} caracteres`)
          .regex(rgx0Spaces, `${name} no puede contener espacios`),
      }),
    )
    .min(1, `Debe haber al menos 1 elemento en ${name}`);

export const genZdate = (name: string) => z.string().min(1, `Ingresa la fecha`);

export const genZstrLetters = (minLen: number, maxLen: number, name: string) =>
  z
    .string()
    .regex(rgxLetters, `El ${name} solo puede contener letras`)
    .min(minLen, `El ${name} debe tener al menos ${minLen} caracteres`)
    .max(maxLen, `El ${name} debe tener como máximo ${maxLen} caracteres`);

export const genZstrLettersNums = (minLen: number, maxLen: number, name: string) =>
  z
    .string()
    .regex(rgxLettersNumbers, `El ${name} solo puede contener letras y números`)
    .min(minLen, `El ${name} debe tener al menos ${minLen} caracteres`)
    .max(maxLen, `El ${name} debe tener como máximo ${maxLen} caracteres`);

export const genZstr = (minLen: number, maxLen: number, name: string) =>
  z
    .string()
    .min(minLen, `El ${name} debe tener al menos ${minLen} caracteres`)
    .max(maxLen, `El ${name} debe tener como máximo ${maxLen} caracteres`);

export const genZstrNums = (minLen: number, maxLen: number, name: string) =>
  z
    .string()
    .regex(rgxNumbers, `El ${name} solo puede contener números`)
    .min(minLen, `El ${name} debe tener al menos ${minLen} caracteres`)
    .max(maxLen, `El ${name} debe tener como máximo ${maxLen} caracteres`);

export const genZstrID = (len: number, name: string) =>
  z
    .string()
    .regex(rgx0Spaces, `El ${name} no puede contener espacios`)
    .length(len, `El ${name} debe tener exactamente ${len} caracteres`);
