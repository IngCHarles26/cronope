import { z, safeParse } from "zod";
import { rgxSpaces } from "./objects/helpers.js";
import { Countries, Country } from "./objects/competitor.js";

export * from "./objects/competition.js";
export * from "./objects/competitor.js";
export * from "./objects/users.js";
export * from "./objects/helpers.js";

export * from "./objects/others.js";

export * from "./types/api.interface.js";
export * from "./types/db.interface.js";
export * from "./types/ui.interface.js";
export * from "./types/time.interface.js";

export { z, safeParse };

export const getZodErrors = (obj: any): string[] => {
  if (!obj || typeof obj !== "object") return [];

  if (typeof obj.message === "string") {
    return [obj.message];
  }

  return Object.values(obj).flatMap((value) => getZodErrors(value));
};

export const getUserFromEmail = (email: string) => email.split("@")[0];

export const DB_convertString = (str: string) => str.trim().replace(rgxSpaces, " ").toLowerCase();

export const convertDateToInputString = (date: Date) => date.toISOString().slice(0, 10);

export const parseLocalDate = (value: string, start = true) => {
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  const hours = start ? [5, 0, 0, 0] : [23, 59, 59, 0];
  return new Date(Date.UTC(year, month - 1, day, ...hours));
};

export const parseLocalTime = (value: string, start = true) =>
  parseLocalDate(value, start).getTime();

export const reverseZodString = (value: { name: string }) => DB_convertString(value.name);

export const reverseInputString = (value: string) => value.split("-").reverse().join("-");

export const genCompetitorName = (
  country: string,
  name: string,
  lastName: string,
  carnet?: string | null,
) => {
  const flag = Countries[country as Country].flag;
  const [[n1, n2], [ln1, ln2]] = [name.split(" "), lastName.split(" ")];
  const name2 = n2 ? `${n2[0]}.` : "";
  const lastName2 = ln2 ? `${ln2[0]}.` : "";
  const car = carnet ? ` (${carnet})` : "";
  return `${flag} ${ln1} ${lastName2}, ${n1} ${name2}${car}`;
};
