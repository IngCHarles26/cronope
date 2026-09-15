import { cn, style } from "../../../lib/utils";

interface Props {
  title: string;
  isSubmitting: boolean;
  className?: string;
  loadingMessage?: string;
}

export const FormButton = ({
  title,
  isSubmitting,
  className,
  loadingMessage = "Procesando...",
}: Props) => {
  return (
    <div className="flex items-center justify-end mb-0">
      <input
        disabled={isSubmitting}
        type="submit"
        className={cn(style.formButton, className)}
        value={isSubmitting ? loadingMessage : title}
      />
    </div>
  );
};
