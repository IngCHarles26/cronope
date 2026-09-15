import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormButton } from "../app/buttons/form-button";
import { genToastProps, toast } from "../../lib/utils/toast";
import { signIn } from "../../lib/auth-client";
import { spaRoutes } from "../../lib/utils/routes";
import { TextInputRHF } from "../app/inputs/text";
import { useState } from "react";
import { cn, manageErrorFront, style } from "../../lib/utils";
import { userSchema, type typeUserSchema } from "@cronope/schemas";

const toastProps = genToastProps("login-form");

export const LoginForm = () => {
  const [eye, setEye] = useState(true);
  const Icon = eye ? Eye : EyeOff;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<typeUserSchema>({
    mode: "onChange",
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async ({ user, password }: typeUserSchema) => {
    try {
      await signIn.email(
        {
          email: user + import.meta.env.VITE_EMAIL,
          password,
          callbackURL: "/" + spaRoutes.panel,
        },
        {
          onRequest: () => {
            toast.loading("Iniciando sesión...", toastProps);
          },
          onError: () => {
            toast.error("Usuario o contraseña incorrectos", toastProps);
          },
          onSuccess: () => {
            toast.success("Sesión iniciada correctamente", toastProps);
          },
        },
      );
    } catch (error) {
      manageErrorFront(toastProps, error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(style.divForm, "gap-5 ")}>
        <TextInputRHF
          error={errors.user}
          register={register("user")}
          label="Usuario"
          placeholder="nombre_usuario"
        />

        <div className={cn("flex gap-2", errors.password ? "items-center" : "items-end")}>
          <TextInputRHF
            error={errors.password}
            register={register("password")}
            label="Contraseña"
            placeholder="••••••••••••"
            type={eye ? "password" : "text"}
            className="w-full"
          />
          <button
            type="button"
            className="size-9 bg-logo-secondary/60 rounded flex items-center justify-center"
            onClick={() => setEye((prev) => !prev)}>
            <Icon className="text-white size-6" />
          </button>
        </div>
      </div>

      <FormButton
        isSubmitting={isSubmitting}
        title="Ingresar"
        className="group flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-logo-primary px-5 font-heading text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-logo-primary/85 active:scale-[0.98] cursor-pointer mt-4"
      />
    </form>
  );
};
