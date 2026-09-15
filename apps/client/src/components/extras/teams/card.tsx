import { Pen } from "lucide-react";
import { cn, style } from "../../../lib/utils";
import type { TeamType } from "@cronope/schemas";
import { useGetTeams } from "./hooks/useGetTeams";
import { NewTeamsForm } from "./new-teams";
import { useState } from "react";
import { EditTeamForm } from "./edit-team";

interface Props {
  className?: string;
}

export const TeamsCard = ({ className }: Props) => {
  const { data } = useGetTeams();
  const [open, setOpen] = useState(false);
  const [currentData, setCurrentData] = useState<TeamType | null>(null);

  if (!data) return null;

  return (
    <>
      {currentData && (
        <EditTeamForm data={currentData} open={open} setData={setCurrentData} setOpen={setOpen} />
      )}

      <section className={cn(className, "space-y-4 ")}>
        <div className="flex items-center justify-between gap-3 border-b pb-2 border-chart-1">
          <h2 className="font-heading text-lg font-bold uppercase tracking-widest text-chart-2">
            Equipos
          </h2>

          <NewTeamsForm />
        </div>

        <ul className="grid grid-cols-1 gap-3 ">
          {data.map(({ id, name }) => (
            <li
              key={id}
              className="flex items-center justify-between gap-3 rounded border border-chart-1 bg-surface px-2 py-1 uppercase">
              <span className="text-sm font-medium text-chart-2">{name}</span>
              <button
                className={cn(style.dialogButton, "p-1 border-none")}
                onClick={() => {
                  setCurrentData({ id, name });
                  setOpen(true);
                }}>
                <Pen className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
