import { useMemo, useState } from "react";
import type { CompetitionType, ParticipantResult } from "@cronope/schemas";
import type { DialogProps } from "../../lib/types/ui.interface";
import { Dialog, DialogContent } from "../ui/dialog";
import { cn, style, formatTime, format0 } from "../../lib/utils";
import { AppDialogHeader } from "../app/dialog-header";
import { Medal } from "lucide-react";
import { useGetCompetitionResultsById } from "./hooks/useGetCompetitionResults";

interface Result extends ParticipantResult {
  globalTime: number;
}

export const ResultsCompetition = ({ data, open, setOpen }: DialogProps<CompetitionType>) => {
  const { data: competitionData } = useGetCompetitionResultsById(data.id);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [categories, timeColumnCount] = useMemo(() => {
    if (!competitionData) return [[], 0];
    return [
      Array.from(new Set(competitionData.map((p) => p.category))),
      competitionData.length === 0 ? 0 : competitionData[0].times.length,
    ];
  }, [competitionData]);

  const sortedData = useMemo(() => {
    if (!competitionData) return [];

    const newValid: Result[] = [];
    const newInvalid: Result[] = [];

    for (const participant of competitionData) {
      const { category, times, noFinish } = participant;
      if (selectedCategory && category !== selectedCategory) continue;
      if (noFinish) {
        newInvalid.push({ ...participant, globalTime: 0 });
        continue;
      }

      const globalTime = times.at(-1)! - times[0]!;
      const _ix = newValid.findIndex((p) => globalTime < p.globalTime);
      const ix = _ix === -1 ? newValid.length : _ix;
      newValid.splice(ix, 0, { ...participant, globalTime });
    }

    return [...newValid, ...newInvalid];
  }, [competitionData, selectedCategory]);

  if (!competitionData) return null;

  return (
    <Dialog open={open} onOpenChange={(open: boolean) => (open ? setOpen(null) : setOpen(true))}>
      <DialogContent
        className={cn(style.dialog, "w-210 min-w-210 max-h-[80dvh] overflow-y-auto gap-0")}>
        <AppDialogHeader
          Icon={Medal}
          title={`Resultados - ${data.name}`}
          description="Lista de tiempos de los participantes  "
        />

        <div className="w-full flex items-center gap-2 py-0  mt-3 mb-2 text-xs">
          <p className="text-chart-2 uppercase font-semibold">Categoria: </p>
          {categories.map((value) => (
            <button
              key={value + "category"}
              className={cn(
                style.dialogButton,
                selectedCategory === value && "bg-primary text-white border-primary",
              )}
              onClick={() =>
                value === selectedCategory ? setSelectedCategory("") : setSelectedCategory(value)
              }>
              {value}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="border-r border-muted px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-chart-2 w-1/12">
                  Rank
                </th>
                <th className="border-r border-muted px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-chart-2 w-1/12">
                  dorsal
                </th>
                {!selectedCategory && (
                  <th className="border-r border-muted px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-chart-2 w-1/12">
                    Categoria
                  </th>
                )}

                <th className="border-r border-muted px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-chart-2">
                  Competidor
                </th>
                {timeColumnCount > 2 &&
                  Array.from({ length: timeColumnCount - 1 }).map((_, i) => (
                    <th
                      key={`col-${i}`}
                      className="border-r border-muted px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-chart-2">
                      P{i + 1}-P{i + 2}
                    </th>
                  ))}
                <th className="px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-chart-2">
                  Total
                </th>
              </tr>
            </thead>

            {sortedData.length > 0 && (
              <tbody>
                <RowInfo idx={0} result={sortedData[0]} categoryId={selectedCategory} />

                {sortedData.slice(1).map((participant, idx) => (
                  <RowInfo
                    key={idx + participant.name}
                    idx={idx + 1}
                    result={participant}
                    categoryId={selectedCategory}
                    firstTime={sortedData[0].globalTime}
                  />
                ))}
              </tbody>
            )}
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const renderTimeColumns = (times: number[]) => {
  if (times.length <= 2) return null;

  const columns = [];
  for (let i = 1; i < times.length; i++) {
    const hasMissingTime = times[i - 1] === 1 || times[i] === 1;
    columns.push(
      <td key={`time-${i}`} className="border-r border-muted px-3 py-2 text-right text-sm">
        {hasMissingTime ? "-- : -- : ---" : formatTime(times[i] - times[i - 1])}
      </td>,
    );
  }

  return columns;
};

interface RowInfoProps {
  idx: number;
  result: Result;
  categoryId: string;
  firstTime?: number;
}

const RowInfo = ({
  idx,
  categoryId,
  firstTime,
  result: { noFinish, dorsal, name, times, category, globalTime },
}: RowInfoProps) => {
  const [time, plus] = firstTime ? [globalTime - firstTime, "+"] : [globalTime, ""];

  return (
    <tr className="border-b border-muted/80 hover:bg-primary/5 transition-colors">
      <td className="border-r border-muted px-3 py-2 text-center font-bold text-chart-2">
        <span
          className={cn(
            "text-sm uppercase font-semibold text-chart-2",
            noFinish && "text-chart-1 text-xs font-normal",
          )}>
          {noFinish || format0(idx + 1)}
        </span>
      </td>
      <td className="border-r border-muted px-3 py-2 text-sm text-chart-1 text-center">
        #{format0(dorsal || 0)}
      </td>
      {!categoryId && (
        <td className="border-r border-muted px-3 py-2 text-xs text-chart-2 uppercase">
          {category}
        </td>
      )}
      <td className="border-r border-muted px-3 py-2 text-sm text-chart-2 capitalize">{name}</td>
      {renderTimeColumns(times)}
      <td className="px-3 py-2 text-right text-sm font-semibold text-sidebar-primary">
        {noFinish ? "-- : -- : ---" : `${plus}${formatTime(time)}`}
      </td>
    </tr>
  );
};
