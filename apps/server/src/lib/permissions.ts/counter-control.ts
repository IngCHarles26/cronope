import { accessControl } from "./access-control";

export const counterControl = accessControl.newRole({
  categories: ["get"],
  competitors: ["get"],
  competitions: ["get", "add-time"],
});
