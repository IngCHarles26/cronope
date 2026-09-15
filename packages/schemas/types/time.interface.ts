export const alreadyParticipants = "already-participants" as const;
export const resetCurrent = "reset-current" as const;

export const currentParticipantTimes = "current-participant-times" as const;

export type CurrentTimes = Record<string, number[]>;

export type SaveTime = {
  participantId: string;
  time: number;
};

export type ResetTime = {
  participantId: string;
  reset: boolean;
};

export const counterStatusMsg = "counter-status" as const;
export type CounterStatus = { status: boolean; alias: string }[];

export type SaveParticipantResult = {
  times: number[];
  noFinish?: string | null;
  noFinishReason?: string | null;
};
