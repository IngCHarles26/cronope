import {
  genCompetitorName,
  parseLocalDate,
  type CompetitionType,
  type SelectInputType,
} from "@cronope/schemas";
import type { DialogProps } from "../../lib/types/ui.interface";
import { Dialog, DialogContent } from "../ui/dialog";
import { AppDialogHeader } from "../app/dialog-header";
import { ListOrdered } from "lucide-react";
import { cn, format0, formatTimeOrder, style } from "../../lib/utils";
import { useGetCompetitionById } from "./hooks/useGetCompetitionById";
import { useMemo, useState } from "react";
import { useGetCompetitors } from "../extras/competitors/hooks/useGetCompetitors";
import { SelectInput } from "../app/inputs/select";

interface ParticipantOrder {
  hour: string | null;
  dorsal: string;
  category: string;
  competitor: string;
  order: string | null;
  day: number;
}

export const OrderParticipant = ({ data, open, setOpen }: DialogProps<CompetitionType>) => {
  const { data: competitionData } = useGetCompetitionById(data.id);
  const { data: competitorsData } = useGetCompetitors();

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const minsBetweenCategories = +data.categoryInterval;
  const secsBetweenCategories = +data.participantInterval;
  const startHour = +data.startTime;

  // Map of category IDs to category names
  const [categoriesObj, categoryHours, categoryOptions] = useMemo(() => {
    if (!competitionData) return [{}, {}, []];
    const categoryMap: Record<string, string> = {};
    const categoryHours: Record<number | string, { seconds: number; day: number }> = {};
    const categoryOptions: SelectInputType[] = [];

    for (const { id, order, name, day } of competitionData.categories) {
      const start = parseLocalDate(data.startDate);

      start.setDate(start.getDate() + (+day - 1));
      categoryMap[id] = name;
      categoryHours[id] = {
        seconds: (+order - 1) * minsBetweenCategories * 60,
        day: start.getDate(),
      };
      categoryOptions.push({ value: id.toString(), label: name });
    }

    return [categoryMap, categoryHours, categoryOptions];
  }, [competitionData]);

  const participantsObj = useMemo(() => {
    // Map of participant IDs to participant names
    if (!competitorsData) return {};

    const participantMap: Record<string, string> = {};
    competitorsData.forEach(({ id, name, lastName, country }) => {
      participantMap[id] = genCompetitorName(country, name, lastName);
    });

    return participantMap;
  }, [competitorsData]);

  const orderedParticipants = useMemo(() => {
    // Ordered list of participants based on selected category
    if (!competitionData) return [];

    const withOrder: ParticipantOrder[] = [];
    const withOutOrder: ParticipantOrder[] = [];

    for (const { categoryId, competitorId, order, dorsal } of competitionData.participants) {
      const name = participantsObj[competitorId];
      const filter = selectedCategory && categoryId !== selectedCategory;
      if (!name || !(categoryId in categoryHours) || filter) continue;

      const obj: ParticipantOrder = {
        hour: "- -",
        dorsal: dorsal || "",
        category: categoriesObj[categoryId],
        competitor: name,
        order,
        day: categoryHours[categoryId].day,
      };

      if (!order) {
        withOutOrder.push(obj);
        continue;
      }

      const categoryStart = categoryHours[categoryId].seconds;
      const totalSeconds = (+order - 1) * secsBetweenCategories + categoryStart;
      const hour = formatTimeOrder(totalSeconds, startHour);
      obj.hour = hour;
      withOrder.push(obj);
    }

    return [...withOrder, ...withOutOrder];
  }, [competitionData, selectedCategory]);

  if (!competitionData || !competitorsData) return null;

  return (
    <Dialog open={open} onOpenChange={(open: boolean) => (open ? setOpen(null) : setOpen(true))}>
      <DialogContent
        className={cn(style.dialog, "w-140 min-w-140 max-h-[80dvh] overflow-y-auto gap-0")}>
        <AppDialogHeader
          Icon={ListOrdered}
          title={`Orden de Participantes - ${data.name}`}
          description="Lista de tiempos de los participantes  "
        />

        <div className="w-full flex items-center gap-2 py-0  mt-3 mb-2 text-xs">
          <p className="text-chart-2 uppercase font-semibold">Categoria: </p>
          <SelectInput
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            options={[{ value: "", label: "Todas" }, ...categoryOptions]}
            placeholder="Todas"
            className="w-1/3"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="border-r border-muted px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-chart-2 w-1/12">
                  Hora
                </th>
                <th className="border-r border-muted px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-chart-2 w-1/12">
                  Día
                </th>
                <th className="border-r border-muted px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-chart-2 w-1/12">
                  Orden
                </th>
                <th className="border-r border-muted px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-chart-2 w-1/12">
                  dorsal
                </th>
                {!selectedCategory && (
                  <th className="border-r border-muted px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-chart-2 w-1/12">
                    Categoria
                  </th>
                )}
                <th className="border-r border-muted px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-chart-2">
                  Competidor
                </th>
              </tr>
            </thead>

            <tbody>
              {orderedParticipants.map((participant, idx) => (
                <RowInfo key={idx} data={participant} categoryId={selectedCategory} />
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface RowInfoProps {
  data: ParticipantOrder;
  categoryId: string;
}

const RowInfo = ({
  data: { category, competitor, dorsal, hour, order, day },
  categoryId,
}: RowInfoProps) => {
  return (
    <tr className="border-b border-muted/80 hover:bg-primary/5 transition-colors">
      <td className="border-r border-muted px-3 py-2 text-center font-bold text-chart-2">
        <span
          className={cn(
            "text-sm uppercase font-semibold text-chart-2",
            !hour && "text-chart-1 text-xs font-normal",
          )}>
          {hour || ""}
        </span>
      </td>
      <td className="border-r border-muted px-3 py-2 text-sm text-chart-2 text-center">{day}</td>
      <td className="border-r border-muted px-3 py-2 text-sm text-chart-1 text-center">
        {order || ""}
      </td>
      <td className="border-r border-muted px-3 py-2 text-sm text-chart-1 text-center">
        #{format0(+dorsal || 0)}
      </td>
      {!categoryId && (
        <td className="border-r border-muted px-3 py-2 text-xs text-chart-2 uppercase">
          {category}
        </td>
      )}
      <td className="border-r border-muted px-3 py-2 text-sm text-chart-2 capitalize">
        {competitor}
      </td>
    </tr>
  );
};
