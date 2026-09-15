import type { UseFormRegisterReturn, FieldError } from "react-hook-form";
import { style } from "../../../lib/utils";

interface Props {
  register: UseFormRegisterReturn;
  error: FieldError | undefined;
}

export const HiddenInput = ({ error, register }: Props) => (
  <>
    <input hidden {...register} />
    {error && <p className={style.errorInputMessage}>{error.message}</p>}
  </>
);
