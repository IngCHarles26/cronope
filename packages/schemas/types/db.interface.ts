export const userRoles = ["admin", "counter"] as const;
export type Roles = (typeof userRoles)[number];

export const noFinish = ["DNS", "DNF", "DSQ"] as const;
export type NoFinish = (typeof noFinish)[number];
