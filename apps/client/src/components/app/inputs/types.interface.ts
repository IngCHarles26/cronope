import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Input {
  placeholder: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export interface InputRHFInterface extends Input {
  register: UseFormRegisterReturn;
  error: FieldError | undefined;
}

export interface InputNormalInterface extends Input {
  value: string;
  onChange: (value: string) => void;
}
