import { alreadyParticipants, type SelectInputType } from "@cronope/schemas";
import { SelectInput } from "../app/inputs/select";
import { useMemo, useState } from "react";
import { useSocketEvent } from "./hooks/useSocketEvent";
import { UserPlus } from "lucide-react";
import type { Socket } from "socket.io-client";

const styleExtra =
  "[&_select]:h-12 [&_select]:rounded-sm [&_select]:border-border [&_select]:bg-card [&_select]:px-4 [&_select]:font-heading [&_select]:font-bold [&_select]:uppercase [&_select]:shadow-sm";

interface Props {
  order: number;
  categories: SelectInputType[];
  participants: Record<string, SelectInputType[]>;
  socket: Socket | null;
}

export const StartParticipant = ({ order, categories, participants, socket }: Props) => {
  if (order !== 1 || !socket) return null;

  useSocketEvent(alreadyParticipants, (data: string[]) => setParticipantList(data));
  const [participantList, setParticipantList] = useState<string[]>([]);

  const [categoryId, setCategoryId] = useState("");
  const [participantId, setParticipantId] = useState("");

  const participantOptions = useMemo(() => {
    const options: SelectInputType[] = [];
    for (const participant of participants[categoryId] || []) {
      if (participantList.includes(participant.value)) continue;
      options.push(participant);
    }
    return options;
  }, [participants, categoryId, participantList]);

  const handleClick = () => {
    socket.emit(alreadyParticipants, participantId);
    setParticipantId("");
  };

  return (
    <section className="grid gap-5 sm:grid-cols-2" aria-label="Datos del competidor">
      <SelectInput
        label="Categoría"
        placeholder="Selecciona una categoría"
        options={categories}
        value={categoryId}
        onChange={(val) => {
          setCategoryId(val);
          setParticipantId("");
        }}
        className={styleExtra}
      />
      <SelectInput
        label="Competidor"
        placeholder="Selecciona un competidor"
        options={participantOptions}
        value={participantId}
        onChange={(val) => setParticipantId(val)}
        className={styleExtra}
      />

      {participantId && (
        <button
          onClick={handleClick}
          className="group relative h-20 w-full overflow-hidden border px-6 transition-all duration-300 active:translate-y-0 sm:min-h-52 rounded-lg hover:-translate-y-1 hover:shadow-[0_0_0_1px_var(--primary),0_22px_70px_color-mix(in_oklch,var(--primary)_42%,transparent)] border-primary/70 bg-primary text-primary-foreground">
          <span className="relative flex items-center justify-center gap-10">
            <UserPlus className="size-9" />
            <span className="font-heading text-2xl font-black uppercase tracking-[0.12em]">
              Agregar a lista
            </span>
          </span>
        </button>
      )}
    </section>
  );
};
