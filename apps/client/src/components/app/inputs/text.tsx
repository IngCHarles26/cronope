import { cn, style } from "../../../lib/utils";
import type { InputNormalInterface, InputRHFInterface } from "./types.interface";

type Input = {
  list?: { id: string; data: string[] };
  type?: "text" | "password";
};

type TextInputRHFProps = InputRHFInterface & Input;

export const TextInputRHF = ({
  type = "text",
  list,
  label,
  error,
  ...props
}: TextInputRHFProps) => {
  return (
    <div className={cn(style.singleInput, props.className, props.disabled && style.inputDisabled)}>
      {label && <label className={cn(style.label, error && style.labelError)}>{label}</label>}
      <input
        type={type}
        placeholder={props.placeholder}
        list={list?.id}
        className={cn(style.input, error && style.inputError)}
        {...props.register}
      />
      {list && (
        <datalist id={list.id}>
          {list.data.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </datalist>
      )}
      {error && <p className={style.errorInputMessage}>{error.message}</p>}
    </div>
  );
};

export const TextInput = ({ label, list, ...props }: InputNormalInterface & Input) => {
  return (
    <div className={cn(style.singleInput, props.className, props.disabled && style.inputDisabled)}>
      {label && <label className={cn(style.label)}>{label}</label>}
      <input
        type="text"
        placeholder={props.placeholder}
        list={list?.id}
        className={cn(style.input)}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {list && (
        <datalist id={list.id}>
          {list.data.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </datalist>
      )}
    </div>
  );
};
