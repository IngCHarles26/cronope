import { cn } from "../../lib/utils";

interface Props {
  status: boolean;
  goodMessage?: string;
  badMessage?: string;
  pulse?: true;
  className?: string;
}

export const StatusIcon = ({
  status,
  goodMessage = "Activo",
  badMessage = "Inactivo",
  pulse,
  className,
}: Props) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-bold uppercase text-xs",
        status ? `bg-error/10 text-error` : `bg-success/10 text-success`,
        className,
      )}>
      <span
        className={cn(
          "size-1.5 2xl:size-2 rounded-full",
          status ? `bg-error` : `bg-success`,
          pulse && !status && "animate-pulse",
        )}
      />
      {status ? badMessage : goodMessage}
    </span>
  );
};
