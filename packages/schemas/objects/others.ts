import z from "zod";
import { genZstr, genZstringArray } from "./foos.js";

type CommonType = {
  id: string;
  name: string;
};
// ______________________________________________________________ Category
export const idCategoryLength = 3;
const zCategoryName = genZstringArray("Nombre de categoría", 2, 30);

export const newCategoriesSchema = z.object({
  list: zCategoryName,
});
export type typeNewCategoriesSchema = z.infer<typeof newCategoriesSchema>;

export type SimpleCategoryType = CommonType;

// ______________________________________________________________ Team
export const idTeamLength = 3;
const zTeamName = genZstringArray("Nombre de equipo", 2, 30);

export const newTeamsSchema = z.object({
  list: zTeamName,
});
export type typeNewTeamsSchema = z.infer<typeof newTeamsSchema>;

export type TeamType = CommonType;

export const editTeamSchema = z.object({
  name: genZstr(2, 30, "Nombre de equipo"),
});
export type typeEditTeamSchema = z.infer<typeof editTeamSchema>;
