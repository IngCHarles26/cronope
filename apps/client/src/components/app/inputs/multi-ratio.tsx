import type { SelectInputType } from "@cronope/schemas";
import { cn, style } from "../../../lib/utils";
import type { InputNormalInterface, InputRHFInterface } from "./types.interface";

type Input = {
  options: SelectInputType[];
  cols?: number;
};

export const MultiRatioInputRHF = ({
  options,
  cols = 2,
  register,
  error,
  ...props
}: Omit<InputRHFInterface, "placeholder"> & Input) => {
  return (
    <div className={cn(style.singleInput, props.className, props.disabled && style.inputDisabled)}>
      <label className={cn(style.label, error && style.labelError)}>{props.label}</label>
      <div
        className={cn("grid gap-2")}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {options.map((option, ix) => (
          <label key={option.value + "_multi-ratio-input-" + ix} className="cursor-pointer">
            <input type="checkbox" className="peer sr-only" {...register} value={option.value} />
            <div className="flex  flex-col items-center justify-center gap-2 rounded border border-border/60 bg-background-base/60 px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-secondary-text transition-all hover:border-primary/50 hover:text-primary/80 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:hover:text-white">
              {option.label}
            </div>
          </label>
        ))}
      </div>
      {error && <p className={style.errorInputMessage}>{error.message}</p>}
    </div>
  );
};

interface Props extends Omit<InputNormalInterface, "value" | "onChange">, Input {
  values: string[];
  setValues: (value: string[]) => void;
}

export const MultiRatioInput = ({ options, cols = 2, values, setValues, ...props }: Props) => {
  const handleChange = (checked: boolean, value: string) => {
    if (checked) setValues([...values, value]);
    else setValues(values.filter((v) => v !== value));
  };

  return (
    <div className={cn(style.singleInput, props.className, props.disabled && style.inputDisabled)}>
      <label className={cn(style.label)}>{props.label}</label>
      <div
        className={cn("grid gap-2")}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {options.map((option, ix) => (
          <label key={option.value + "_multi-ratio-input-" + ix} className="cursor-pointer">
            <input
              type="checkbox"
              name={props.placeholder}
              className="peer sr-only"
              value={option.value}
              checked={values.includes(option.value)}
              onChange={(e) => handleChange(e.target.checked, option.value)}
            />
            <div className="flex  flex-col items-center justify-center gap-2 rounded border border-border/60 bg-background-base/60 px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-secondary-text transition-all hover:border-primary/50 hover:text-primary/80 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-checked:hover:text-white">
              {option.label}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
