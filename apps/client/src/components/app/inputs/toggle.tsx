import { cn, style } from "../../../lib/utils";
import type { InputNormalInterface, InputRHFInterface } from "./types.interface";

type Input = {
  labelLeft: string;
  labelRight: string;
};

export const ToggleInputRHF = ({
  labelLeft,
  labelRight,
  error,
  ...props
}: InputRHFInterface & Input) => {
  return (
    <div className={cn(style.singleInput, props.className, props.disabled && style.inputDisabled)}>
      <label className={cn(style.label)}>{props.label}</label>
      <label
        className={cn(style.input, "h-9 flex items-center justify-between px-2 transition-all")}>
        <span className={cn(style.label, "text-[11px] tracking-wide")}>{labelLeft}</span>
        <input type="checkbox" role="switch" className="peer sr-only" {...props.register} />
        <span className="cursor-pointer relative inline-flex h-5.5 w-10.5 rounded-full border border-primary/60 bg-background-base transition-colors before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-primary/60 before:shadow-sm before:transition-transform peer-checked:before:translate-x-5 mx-2" />
        <span className={cn(style.label, "text-[11px] tracking-wide")}>{labelRight}</span>
      </label>
    </div>
  );
};

interface Props extends Omit<InputNormalInterface, "value" | "onChange">, Input {
  value: boolean;
  setValue: (value: boolean) => void;
}

export const ToggleInput = ({ labelLeft, labelRight, ...props }: Props) => {
  return (
    <div className={cn(style.singleInput, props.className, props.disabled && style.inputDisabled)}>
      <label className={cn(style.label)}>{props.label}</label>
      <label
        className={cn(style.input, "h-9 flex items-center justify-between px-2 transition-all")}>
        <span className={cn(style.label, "text-[11px] tracking-wide")}>{labelLeft}</span>
        <input
          type="checkbox"
          role="switch"
          className="peer sr-only"
          checked={props.value}
          onChange={(e) => props.setValue(e.target.checked)}
        />
        <span className="cursor-pointer relative inline-flex h-5.5 w-10.5 rounded-full border border-primary/60 bg-background-base transition-colors before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-primary/60 before:shadow-sm before:transition-transform peer-checked:before:translate-x-5 mx-2" />
        <span className={cn(style.label, "text-[11px] tracking-wide")}>{labelRight}</span>
      </label>
    </div>
  );
};
