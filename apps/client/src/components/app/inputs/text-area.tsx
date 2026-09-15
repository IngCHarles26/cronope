import { cn, style } from "../../../lib/utils";
import type { InputNormalInterface, InputRHFInterface } from "./types.interface";

type Input = {
  rows?: number;
};

export const TextAreaInputRHF = ({ rows = 4, error, ...props }: InputRHFInterface & Input) => {
  return (
    <div className={cn(style.singleInput, props.className)}>
      <label className={cn(style.label, error && style.labelError)}>{props.label}</label>
      <textarea
        rows={rows}
        placeholder={props.placeholder}
        className={cn(style.input, error && style.inputError, "h-auto resize-none mt-0.5")}
        {...props.register}
      />
      {error && <p className={style.errorInputMessage}>{error.message}</p>}
    </div>
  );
};

export const TextAreaInput = ({ rows = 4, ...props }: InputNormalInterface & Input) => {
  return (
    <div className={cn(style.singleInput, props.className)}>
      <label className={cn(style.label)}>{props.label}</label>
      <textarea
        rows={rows}
        placeholder={props.placeholder}
        className={cn(style.textArea, "resize-none h-auto mt-0.5")}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
