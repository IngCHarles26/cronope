import { createAccessControl } from "better-auth/plugins";
import { defaultStatements } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  categories: ["create", "get", "update"],
  competitors: ["create", "get", "update"],
  competitions: ["create", "get", "update", "delete", "toggle", "add-time"],
} as const;

export const accessControl = createAccessControl(statement);

export type Permissions = {
  [K in keyof typeof statement]?: (typeof statement)[K][number][];
};
