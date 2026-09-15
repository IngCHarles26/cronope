import type { InputNormalInterface, InputRHFInterface } from "./types.interface";
import type { SelectInputType } from "@cronope/schemas";
import { cn, style } from "../../../lib/utils";

type Input = {
  options: SelectInputType[];
  canEmpty?: true;
};

export const SelectInputRHF = ({
  canEmpty,
  options,
  label,
  error,
  ...props
}: InputRHFInterface & Input) => {
  return (
    <div className={cn(style.singleInput, props.className, props.disabled && style.inputDisabled)}>
      {label && <label className={cn(style.label)}>{label}</label>}
      <select className={cn(style.input, error && style.inputError)} {...props.register}>
        <option value="" disabled={!canEmpty} hidden={!canEmpty}>
          - {props.placeholder} -
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className={style.errorInputMessage}>{error.message}</p>}
    </div>
  );
};

export const SelectInput = ({
  label,
  disabled = false,
  options,
  ...props
}: InputNormalInterface & Input) => {
  return (
    <div className={cn(style.singleInput, props.className, disabled && style.inputDisabled)}>
      {label && <label className={cn(style.label)}>{label}</label>}
      <select
        className={cn(style.input, disabled && "appearance-none")}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={disabled}
        defaultValue={""}>
        <option value="" className={style.selectOption} disabled selected hidden>
          - {props.placeholder} -
        </option>
        {options.map((option) => (
          <option className={style.selectOption} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
