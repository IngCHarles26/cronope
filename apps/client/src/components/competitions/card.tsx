import { parseLocalDate, type CompetitionType } from "@cronope/schemas";
import { cn, days, genVisualDate, style } from "../../lib/utils";
import type { DialogCompetitionType } from "./page";
import { StatusIcon } from "../app/status";
import { Bike, ChartBarStacked, ListOrdered, Pen, Podium, Timer, Trash } from "lucide-react";
import { usePrefetchCompetitionById } from "./hooks/useGetCompetitionById";
import { IconButton } from "../app/buttons/icon-button";
import { CardItemsInfo } from "../app/cards";
import { usePrefetchCompetitionReslutsById } from "./hooks/useGetCompetitionResults";

interface Props {
  data: CompetitionType;
  handleDialog: (data: CompetitionType, type: DialogCompetitionType) => void;
}

export const CompetitionCard = ({ data, handleDialog }: Props) => {
  const { createdAt, startDate, endDate } = data;

  const now = new Date();
  const pastEnd = now > parseLocalDate(endDate, false);
  const pastStart = now > parseLocalDate(startDate);
  const canDelete = now.getTime() - parseLocalDate(createdAt).getTime() < 3 * days; // 72 horas (igual que el backend)

  const prefetchDetail = usePrefetchCompetitionById();
  const prefetchResults = usePrefetchCompetitionReslutsById();
  const onClickButton = (type: DialogCompetitionType) => handleDialog(data, type);

  return (
    <div
      className={cn(style.dialog, "space-y-3")}
      onMouseEnter={() => {
        prefetchDetail(data.id);
      }}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-chart-2 truncate">
          {data.name}
        </h3>

        <button
          onClick={() => onClickButton("toggle")}
          className="flex items-center justify-center focus:outline-none">
          <StatusIcon status={!data.status} />
        </button>
      </div>

      <CardItemsInfo
        info={[
          ["Ciudad", data.city],
          ["Tiempo entre salidas", data.participantInterval],
          ["Tiempo entre categorias", data.categoryInterval],
          ["Hora Inicio", `${data.startDate}:00`],
          ["Creado el", genVisualDate(createdAt, true)[0]],
          ["Inicio", genVisualDate(startDate)[0]],
          ["Fin", genVisualDate(endDate)[0]],
        ]}
      />

      <div className="w-full flex justify-end gap-2">
        {canDelete && (
          <IconButton tooltip="Eliminar" onClick={() => onClickButton("delete")} Icon={Trash} />
        )}

        <IconButton
          tooltip="Categorias"
          Icon={ChartBarStacked}
          onClick={() => onClickButton("categories")}
        />

        <IconButton
          tooltip="Participantes"
          Icon={Bike}
          onClick={() => onClickButton("participants")}
        />

        <IconButton
          tooltip="Horas Salida"
          Icon={ListOrdered}
          onClick={() => onClickButton("participant-start")}
        />

        <IconButton tooltip="Contadores" Icon={Timer} onClick={() => onClickButton("counters")} />

        {!pastStart && (
          <IconButton tooltip="Editar" Icon={Pen} onClick={() => onClickButton("edit")} />
        )}

        {pastEnd && (
          <IconButton
            tooltip="Resultados"
            onMouseEnter={() => prefetchResults(data.id)}
            Icon={Podium}
            onClick={() => onClickButton("results")}
          />
        )}
      </div>
    </div>
  );
};
