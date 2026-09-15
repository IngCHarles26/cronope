import type { ReactNode } from "react";
import type { IconType } from "../../lib/types/ui.interface";
import { cn } from "../../lib/utils";
import { DialogHeader, DialogTitle } from "../ui/dialog";

interface Props {
  Icon: IconType;
  title: string;
  description: string;
  color?: "error" | "success" | "primary";
  Component?: ReactNode;
}

const colorClasses = {
  error: `bg-error/90`,
  success: `bg-success/90`,
  primary: "bg-primary/90",
} as const;

export const AppDialogHeader = ({
  Icon,
  title,
  description,
  color = "primary",
  Component,
}: Props) => {
  return (
    <DialogHeader className="flex flex-row items-center gap-4 mb-1">
      <DialogTitle className={cn("rounded-md p-1.5 text-white", colorClasses[color])}>
        <Icon className="size-6" />
      </DialogTitle>
      <div className="mr-auto">
        <h3 className="font-bold uppercase tracking-wide text-chart-3">{title}</h3>
        <h4 className="text-xs text-chart-2">{description}</h4>
      </div>
      {Component}
    </DialogHeader>
  );
};
