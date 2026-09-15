import { cn } from "../../../lib/utils";

interface Props {
  isSubmitting: boolean;
  title: string;
  onClick: () => Promise<any>;
  className?: string;
}

export const AsyncButton = ({ title, onClick, isSubmitting, className }: Props) => {
  const handleClick = async () => {
    if (isSubmitting) return;
    await onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSubmitting}
      className={cn(isSubmitting && "pointer-events-none opacity-50 animate-pulse", className)}>
      {isSubmitting ? "Procesando..." : title}
    </button>
  );
};
