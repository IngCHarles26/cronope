import type { ComponentType } from "react";
import type { IconType } from "../../lib/types/ui.interface";
import type { Roles } from "@cronope/schemas";

interface OptionInterface {
  path: string;
  label: string;
  Component?: ComponentType<any>;
}

export interface SingleItemInterface extends OptionInterface {
  Icon: IconType;
}

export interface GroupItemInterface {
  Icon: IconType;
  label: string;
  options: OptionInterface[];
}

export interface SideBarItemsItemsInterface {
  single?: SingleItemInterface[];
  group?: GroupItemInterface[];
}

export type NavItemsForRole = Record<Roles, SideBarItemsItemsInterface>;
