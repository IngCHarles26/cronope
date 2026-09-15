import { userSchema, z } from "@cronope/schemas";

export interface ToggleUserData {
  userId: string;
  banned: boolean;
  name: string;
}

export type ChangeUserPasswordData = Omit<ToggleUserData, "banned">;

export const changePassSchema = userSchema
  .omit({ user: true })
  .extend({
    confirmPassword: z.string().min(1, "Confirme la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
export type typeChangePassword = z.infer<typeof changePassSchema>;
