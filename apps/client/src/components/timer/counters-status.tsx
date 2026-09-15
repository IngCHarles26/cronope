import { type CounterStatus } from "@cronope/schemas";
import { cn } from "../../lib/utils";

interface Props {
  counters: CounterStatus;
}

export const CountersStatus = ({ counters }: Props) => {
  return (
    <section
      className="grid items-center gap-4 "
      style={{
        gridTemplateColumns: `repeat(${Math.max(counters.length, 1)}, minmax(0, 1fr))`,
      }}>
      {counters.length > 0 &&
        counters.map(({ status, alias }, index) => (
          <div className="relative flex items-center gap-2 overflow-hidden  py-1 px-3" key={index}>
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                status
                  ? "bg-primary shadow-[0_0_14px_var(--primary)]"
                  : "border-2 border-muted-foreground/30",
              )}
            />
            <span className="flex-1 font-heading text-xs font-bold uppercase text-chart-2">
              {alias}
            </span>
          </div>
        ))}
    </section>
  );
};
