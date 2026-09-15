import { spaRoutes } from "../../lib/utils/routes";
import { NewCompetitionForm } from "../competitions/new-competition";
import NewUserForm from "../users/new-user";
import type {
  NavItemsForRole,
  SideBarItemsItemsInterface,
  SingleItemInterface,
} from "./types.interface";
import { Mountain, Trophy, Users } from "lucide-react";

const mainRoute = "/panel";
const { users, extras, competitions } = spaRoutes;

// Rutas
const usersRoute: SingleItemInterface = {
  Icon: Users,
  label: "usuarios",
  path: `${mainRoute}/${users}`,
  Component: NewUserForm,
} as const;

const extrasRoute: SingleItemInterface = {
  Icon: Mountain,
  label: "extras",
  path: `${mainRoute}/${extras}`,
} as const;

const competitionsRoute: SingleItemInterface = {
  Icon: Trophy,
  label: "competencias",
  path: `${mainRoute}/${competitions}`,
  Component: NewCompetitionForm,
} as const;

const adminItems: SideBarItemsItemsInterface = {
  single: [usersRoute, extrasRoute, competitionsRoute],
} as const;

const counterItems: SideBarItemsItemsInterface = {} as const;

export const navItemsForRole: NavItemsForRole = {
  admin: adminItems,
  counter: counterItems,
};
