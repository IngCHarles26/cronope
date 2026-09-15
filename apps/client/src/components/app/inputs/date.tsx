import { cn, style } from "../../../lib/utils";
import type { InputRHFInterface, InputNormalInterface } from "./types.interface";

type Input = {
  type?: "date" | "datetime-local" | "time";
};

export const DateInputRHF = ({
  type = "date",
  error,
  ...props
}: Omit<InputRHFInterface & Input, "placeholder">) => {
  return (
    <div className={cn(style.singleInput, props.className)}>
      <label className={cn(style.label, error && style.labelError)}>{props.label}</label>
      <input
        type={type}
        className={cn(style.input, error && style.inputError)}
        {...props.register}
      />
      {error && <p className={style.errorInputMessage}>{error.message}</p>}
    </div>
  );
};

export const DateInput = ({
  type = "date",
  ...props
}: Omit<InputNormalInterface & Input, "placeholder">) => {
  return (
    <div className={cn(style.singleInput, props.className)}>
      <label className={cn(style.label)}>{props.label}</label>
      <input
        type={type}
        className={cn(style.input)}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
