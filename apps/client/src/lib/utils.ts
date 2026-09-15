import { parseLocalDate, type APIResponse } from "@cronope/schemas";
import type { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast, type ToasterProps } from "sonner";
import { twMerge } from "tailwind-merge";

export const minutes = 1000 * 60;
export const hours = minutes * 60;
export const days = hours * 24;

export const genVisualDate = (something: any, delay = false) => {
  const inDate = new Date(something);
  const delayMs = delay ? 60000 : 0;
  const tzOffset = inDate.getTimezoneOffset() * delayMs; // ajuste a la hora de peru
  const [date, time] = new Date(inDate.getTime() - tzOffset).toISOString().split("T");
  const [year, month, day] = date.split("-");

  return [`${day}-${month}-${year}`, time];
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeepErrors = (obj: any): string[] => {
  if (!obj || typeof obj !== "object") return [];

  if (typeof obj.message === "string") {
    return [obj.message];
  }

  return Object.values(obj).flatMap((value) => getDeepErrors(value));
};

export const genCanDelete = (date: string) => {
  const now = new Date();
  const dateObj = parseLocalDate(date);
  return now > dateObj;
};

export const formatTime = (ms: number) => {
  const mins = Math.floor(ms / minutes);
  const secs = Math.floor((ms % minutes) / 1000);
  const milliseconds = ms % 1000;
  return `${format0(mins)}:${format0(secs)}:${format0(milliseconds, 3)}`;
};

export const formatTimeOrder = (inSecs: number, startHour: number) => {
  const secs = inSecs % 60;
  const _mins = (inSecs - secs) / 60;
  const mins = _mins % 60;
  const hour = startHour + (_mins - mins) / 60;
  return `${format0(hour)}:${format0(mins)}:${format0(secs)}`;
};

export const manageErrorFront = (toastProps: ToasterProps, _error: any) => {
  const error = _error as AxiosError<APIResponse>;
  const { message } = error.response?.data as APIResponse;
  toast.error(message, toastProps);
};

export function format0(number: number, zeros = 2) {
  const len = `${+number}`.length;
  const _0 = "0".repeat(zeros - len);

  return `${_0}${number}`;
}

export const style = {
  form: "space-y-4 py-0 mb-0 mt-2",
  divForm: "grid gap-x-4 gap-y-3 mb-4  ",

  page: "size-full p-4 text-chart-2 xl:p-5",

  dialog:
    "p-3 bg-card rounded shadow-xl border-r-4 border-primary ring-1 ring-primary/10 mb-0 space-y-2 gap-0",

  // _______________________ Buttons
  headerButton:
    "bg-primary text-white rounded px-3 py-1.5 text-sm 2xl:text-base font-semibold flex items-center gap-2 transition-all tracking-normal  2xl:tracking-widest hover:bg-primary/90 uppercase hover:scale-105 duration-400 focus:outline-none focus:ring-0 focus:border-0 focus-within:ring-0 focus-within:border-0 focus-within:outline-none *:focus-within:shadow-none",
  headerIconButton: "size-4 2xl:size-5",
  confirmButton:
    "text-white rounded bg-chart-1/80 hover:bg-primary uppercase font-bold py-2.5 px-4 text-xs tracking-widest transition-all duration-300 focus:outline-none focus:ring-0 focus:border-0 focus-within:ring-0 focus-within:border-0 focus-within:outline-none *:focus-within:shadow-none",
  cancelButton:
    "border border-muted rounded text-chart-1 hover:border-muted-foreground hover:text-chart-2 font-bold py-2.5 px-4 text-xs uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-0 focus-within:ring-0 focus-within:outline-none *:focus-within:shadow-none",
  dialogButton:
    "px-2 py-1.5 border border-chart-2 text-chart-2 text-xs font-bold uppercase tracking-wide transition-all hover:bg-primary hover:text-white hover:border-primary rounded text-center focus:outline-none focus:ring-0 focus-within:ring-0 focus-within:outline-none *:focus-within:shadow-none",
  formButton:
    "bg-primary/50 hover:bg-primary text-white rounded font-bold py-2.5 px-3 text-xs uppercase tracking-widest transition-all cursor-pointer mb-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
  formDeleteFieldButton:
    "flex size-9 shrink-0 items-center justify-center rounded border border-muted text-chart-1 transition-all hover:border-destructive/60 hover:text-destructive",

  // _______________________ Inputs
  singleInput: "space-y-1 mb-0",
  errorInputMessage: "text-destructive/70 text-[0.65rem] text-right",
  inputDisabled: "cursor-not-allowed opacity-80 pointer-events-none",

  label: "block text-[0.65rem] font-semi-bold uppercase text-chart-2 tracking-widest font-semibold",
  labelError: "text-destructive/50",

  input:
    "w-full bg-background-base/70 border border-muted text-chart-3 py-1 px-2 rounded text-sm placeholder:text-chart-1 focus:outline-none focus:ring-primary/50 focus:ring-1 h-9",
  textArea:
    "w-full bg-background-base/70 border border-muted text-chart-3 py-1 px-2 rounded text-sm placeholder:text-chart-1 focus:outline-none focus:ring-primary/50 focus:ring-1",
  inputError: "text-destructive/70 focus:ring-0 border-destructive/60",
  selectOption: "text-chart-2 font-sans italic",

  grid: "grid grid-cols-1 gap-5",
} as const;
