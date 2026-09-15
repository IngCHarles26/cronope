import { useGetTodayCompetition } from "./hooks/useGetTodayCompetition";
import { TimerDetail } from "./detail";
import { cn } from "../../lib/utils";

const TimerPage = () => {
  const { data, isLoading } = useGetTodayCompetition();

  return (
    <main className="relative min-h-dvh h-dvh  overflow-hidden bg-background p-5 text-foreground sm:px-8 sm:py-7">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,oklch(0.56_0.021_213.5/0.07)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.56_0.021_213.5/0.07)_1px,transparent_1px)] bg-size-[32px_32px]" />
      {isLoading ? (
        <Message text="Buscando la competencia de hoy..." className="animate-pulse" />
      ) : data ? (
        <TimerDetail {...data} />
      ) : (
        <Message text="hoy no tienes asiganda una competencia" />
      )}
    </main>
  );
};

export default TimerPage;

const Message = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div
      className={cn(
        `z-10 w-full max-w-xl text-center h-full flex items-center justify-center`,
        className,
      )}>
      <p className="font-heading text-xl font-bold uppercase tracking-wider text-muted-foreground">
        {text}
      </p>
    </div>
  );
};
