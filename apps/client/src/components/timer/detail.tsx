import { useEffect, useMemo, useState } from "react";
import { StatusIcon } from "../app/status";
import { useSocketStore } from "../../lib/store/socket";
import { useSocketEvent } from "./hooks/useSocketEvent";
import {
  counterStatusMsg,
  currentParticipantTimes,
  type CompetitionLiveInfo,
  type CounterStatus,
  type CurrentTimes,
} from "@cronope/schemas";
import { CountersStatus } from "./counters-status";
import { StartParticipant } from "./select-participant";
import { PartticipantCard } from "./participant-card";

export const TimerDetail = ({
  competitionId,
  competitionName,
  counterOrder,
  counterAlias,
  participants,
  categories,
}: CompetitionLiveInfo) => {
  const { isOnline, initSocket, socket } = useSocketStore();
  useEffect(() => {
    if (!competitionId) return;
    initSocket(competitionId);
  }, [initSocket, competitionId]);

  const [counters, setCounters] = useState<CounterStatus>([]);
  useSocketEvent(counterStatusMsg, (data: CounterStatus) => setCounters(data));

  const [participantTimes, setParticipantTimes] = useState<CurrentTimes>({});
  useSocketEvent(currentParticipantTimes, (data: CurrentTimes) => setParticipantTimes(data));

  const participantsData = useMemo(() => {
    const acc: Record<string, string> = {};
    for (const _key in participants) {
      const categoryParticipants = participants[_key];
      for (const participant of categoryParticipants) {
        acc[participant.value] = participant.label;
      }
    }
    return acc;
  }, [participants]);

  return (
    <div className="relative mx-auto flex h-full  w-full max-w-3xl flex-col gap-4 z-10">
      <div className="flex items-center justify-between gap-4 border-b-2 pb-3 border-border/70 ">
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-foreground sm:text-2xl">
          {competitionName} <span className="text-xs">({counterAlias})</span>
        </h1>
        <StatusIcon status={!isOnline} goodMessage="online" badMessage="offline" pulse />
      </div>

      <CountersStatus counters={counters} />

      <StartParticipant
        order={counterOrder}
        categories={categories}
        participants={participants}
        socket={socket}
      />

      <div className="mt-auto" />
      {Object.entries(participantTimes).map(([participantId, times]) => (
        <PartticipantCard
          key={participantId}
          participantId={participantId}
          participantsData={participantsData}
          times={times}
          counters={counters}
          counterOrder={counterOrder}
          socket={socket}
        />
      ))}
    </div>
  );
};
