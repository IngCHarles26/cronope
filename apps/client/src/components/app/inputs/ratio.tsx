import { cn, style } from "../../../lib/utils";
import type { InputRHFInterface, InputNormalInterface } from "./types.interface";
import type { SelectInputType } from "@cronope/schemas";
type Input = {
  options: SelectInputType[];
  cols?: number;
};

export const RatioInputRHF = ({
  options,
  error,
  cols = 2,
  ...props
}: Omit<InputRHFInterface, "placeholder"> & Input) => {
  return (
    <div className={cn(style.singleInput, props.className, props.disabled && style.inputDisabled)}>
      <label className={cn(style.label, error && style.labelError)}>{props.label}</label>
      <div
        className={cn("grid gap-2")}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {options.map((option, ix) => (
          <label key={option.value + "_ratio-input-" + ix} className="cursor-pointer">
            <input type="radio" className="peer sr-only" value={option.value} {...props.register} />
            <div className="flex flex-col items-center justify-center gap-2 rounded border border-border/60 bg-background-base/60 px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-secondary-text transition-all hover:border-primary/50 hover:text-primary/80 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:hover:text-white">
              {option.label}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export const RatioInput = ({ options, cols = 2, ...props }: InputNormalInterface & Input) => {
  return (
    <div className={cn(style.singleInput, props.className, props.disabled && style.inputDisabled)}>
      <label className={cn(style.label)}>{props.label}</label>
      <div className={cn("grid gap-2", `grid-cols-${cols}`)}>
        {options.map((option, ix) => (
          <label key={option.value + "_ratio-input-" + ix} className="cursor-pointer">
            <input
              type="radio"
              name={props.placeholder}
              className="peer sr-only"
              value={option.value}
            />
            <div className="flex flex-col items-center justify-center gap-2 rounded border border-border/60 bg-background-base/60 px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-secondary-text transition-all hover:border-primary/50 hover:text-primary/80 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:hover:text-white">
              {option.label}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
