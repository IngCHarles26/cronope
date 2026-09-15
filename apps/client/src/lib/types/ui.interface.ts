import { Circle } from "lucide-react";

export type IconType = typeof Circle;

type DialogBase = {
  open: boolean;
  setOpen: (open: any) => void;
  setData: (open: any) => void;
};

export type DialogProps<T> = {
  data: T;
} & DialogBase;

export type DialogFormType<T> = {
  onSubmit: (data: T) => void;
  defaultValues?: T;
} & Omit<DialogBase, "setData">;

export type DialogToggle<T> = {
  status: boolean;
  id: T;
} & DialogBase;
