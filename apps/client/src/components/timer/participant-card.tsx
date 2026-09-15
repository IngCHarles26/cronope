import { RotateCcwClock, Save, TimerOff, TimerReset } from "lucide-react";
import { Timer } from "./Timer";
import { cn, manageErrorFront } from "../../lib/utils";
import type { Socket } from "socket.io-client";
import {
  currentParticipantTimes,
  DB_convertString,
  resetCurrent,
  type NoFinish,
  type SaveParticipantResult,
} from "@cronope/schemas";
import { genToastProps, toast } from "../../lib/utils/toast";
import { useState } from "react";
import { api, apiRoutes } from "../../lib/api";

interface Props {
  participantId: string;
  participantsData: Record<string, string>;
  times: number[];
  counters: { alias: string }[];
  counterOrder: number;
  socket: Socket | null;
}

export const PartticipantCard = ({
  participantId,
  participantsData,
  times,
  counters,
  counterOrder,
  socket,
}: Props) => {
  let message = "";
  const toastProps = genToastProps("results-participant-" + participantId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!socket) return null;

  const totalCounters = counters.length;
  const isPrincipalCounter = counterOrder === 1;
  const time0 = Boolean(times[0]);
  const timef = Boolean(times.at(-1));

  const registerComplete = time0 && timef && times.length === totalCounters;
  console.log({ registerComplete, other: times[counterOrder - 1] });

  const canSubmitTime = isPrincipalCounter
    ? !time0
    : registerComplete
      ? false
      : time0 && !times[counterOrder - 1];

  const Icon = canSubmitTime ? TimerReset : TimerOff;
  const participantName = participantsData[participantId];

  const handleReset = () => {
    message = `Estás seguro de que deseas reiniciar el tiempo para \n${participantName}?`;
    const confirm = window.confirm(message);
    if (!confirm) return;
    socket.emit(resetCurrent, { participantId, reset: false });
  };

  const handleSaveTime = async (noFinish?: NoFinish) => {
    if (!socket || isSubmitting) return;

    const body: SaveParticipantResult = { times };
    if (noFinish) {
      message = `Ingrese la razón de no finalización para \n ${participantName}`;
      const reason = window.prompt(message);
      if (!reason) return toast.warning("Debe ingresar la razón de no finalización", toastProps);
      body.noFinishReason = DB_convertString(reason);
      body.noFinish = noFinish;
    }

    toast.loading("Guardando...", toastProps);
    setIsSubmitting(true);
    try {
      const { data: apiData } = await api.patch<boolean, SaveParticipantResult>(
        apiRoutes.put.addParticipantTime + participantId,
        body,
      );
      const { message, success } = apiData;
      if (!success) return toast.error(message, toastProps);
      toast.success(message, toastProps);
      socket.emit(resetCurrent, { participantId, reset: true });
    } catch (error) {
      manageErrorFront(toastProps, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden border border-border/70 bg-card/80 py-2 px-3 shadow-sm backdrop-blur-sm gap-2",
        isPrincipalCounter ? "my-1" : "my-3",
      )}>
      <div className="absolute inset-y-0 left-0 w-1 bg-primary" />

      <div className="flex justify-between items-center">
        <p className="font-bold text-chart-4 uppercase text-[0.85rem]">{participantName}</p>
        <Timer times={times} totalCounters={totalCounters} />
      </div>

      <div className="w-full flex justify-between items-center">
        <div className="w-1/2">
          {counters.map(({ alias }, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="uppercase text-xs text-chart-2">{alias}: </p>
              <p className="font-semibold text-sm text-chart-3">{times[index] || "- -"}</p>
            </div>
          ))}

          {isPrincipalCounter && ( //isPrincipalCounter
            <div className="w-full flex items-center gap-2 h-10 mt-1.5">
              <>
                <button
                  onClick={() => handleSaveTime("DNS")}
                  className={cn(
                    "border border-border text-foreground font-bold h-full rounded hover:bg-muted uppercase px-1 text-sm",
                    isSubmitting && "opacity-90 animate-pulse",
                  )}>
                  DNS
                </button>
                <button
                  onClick={() => handleSaveTime("DNF")}
                  className={cn(
                    "border border-border text-foreground font-bold h-full rounded hover:bg-muted uppercase px-1 text-sm",
                    isSubmitting && "opacity-90 animate-pulse",
                  )}>
                  DNF
                </button>
                <button
                  onClick={() => handleSaveTime("DSQ")}
                  className={cn(
                    "border border-border text-foreground font-bold h-full rounded hover:bg-muted uppercase px-1 text-sm",
                    isSubmitting && "opacity-90 animate-pulse",
                  )}>
                  DSQ
                </button>
              </>

              {registerComplete && ( //registerCompleted
                <>
                  <button
                    onClick={handleReset}
                    className="h-full bg-card border border-border text-foreground font-bold px-2.5 rounded hover:bg-muted">
                    <RotateCcwClock className="size-5" />
                  </button>

                  <button
                    onClick={() => handleSaveTime()}
                    className={cn(
                      "h-full bg-card border border-border text-foreground font-bold px-2.5 rounded hover:bg-muted",
                      isSubmitting && "opacity-90 animate-pulse",
                    )}>
                    <Save className="size-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() =>
            socket.emit(currentParticipantTimes, { participantId, time: new Date().getTime() })
          }
          className={cn(
            "group relative overflow-hidden border h-full transition-all duration-300 active:translate-y-0 rounded px-10",
            canSubmitTime
              ? "hover:-translate-y-1 hover:shadow-[0_0_0_1px_var(--primary),0_22px_70px_color-mix(in_oklch,var(--primary)_42%,transparent)] border-primary/70 bg-primary text-primary-foreground"
              : "bg-chart-2 border-chart-2/70 text-chart-1 opacity-50 cursor-not-allowed",
          )}>
          <Icon className="size-7" />
        </button>
      </div>
    </div>
  );
};
