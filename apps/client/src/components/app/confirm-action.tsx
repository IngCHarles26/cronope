import type { IconType } from "../../lib/types/ui.interface";
import { Dialog, DialogContent } from "../ui/dialog";
import { AppDialogHeader } from "./dialog-header";
import { AsyncButton } from "./buttons/async-button";
import { cn, style } from "../../lib/utils";
import { useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DialogProps {
  open: boolean;
  Icon: IconType;
  title: string;
  description: string;

  setOpen: (open: boolean) => void;
  onClick: () => Promise<any>;

  color?: "error" | "success" | "primary";
  className?: string;
}

export const ConfirmActionDialog = ({ color = "primary", ...props }: DialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await props.onClick();
    setIsSubmitting(false);
  };

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent
        className={cn(
          style.dialog,
          "w-120",
          color === "error" && "border-error/80",
          color === "success" && "border-success/80",
        )}>
        <AppDialogHeader
          Icon={props.Icon}
          title={props.title}
          description={props.description}
          color={color}
        />

        <div className="flex flex-row gap-3 text-base mb-0 mt-4">
          <button onClick={() => props.setOpen(false)} className={cn(style.cancelButton, "w-1/2")}>
            Cancelar
          </button>

          <AsyncButton
            isSubmitting={isSubmitting}
            title="Confirmar"
            onClick={handleSubmit}
            className={cn(
              style.confirmButton,
              color === "error" && "hover:bg-error",
              color === "success" && "hover:bg-success",
              "w-1/2",
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PopoverProps {
  children: ReactNode;
  className?: string;
  onClickAS?: () => Promise<any>;
  onClick?: () => any;
}

export const ConfirmActionPop = ({ onClick, onClickAS, children, className }: PopoverProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!onClick || !onClickAS) return setOpen(false);

    onClick();

    setIsSubmitting(true);
    await onClickAS();
    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="flex w-auto gap-2 p-2">
        <AsyncButton
          title="Sí"
          isSubmitting={isSubmitting}
          onClick={handleAccept}
          className="h-8 px-3"
        />
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={isSubmitting}
          className={cn(style.cancelButton, "h-8 px-3")}>
          No
        </button>
      </PopoverContent>
    </Popover>
  );
};
