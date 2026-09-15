import { accessControl, statement } from "./access-control";

export const adminControl = accessControl.newRole({
  user: statement.user,
  categories: statement.categories,
  competitors: statement.competitors,
  competitions: ["create", "get", "update", "delete", "toggle"],
});
