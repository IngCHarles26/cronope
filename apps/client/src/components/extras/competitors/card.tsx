import { useState } from "react";
import { Pen } from "lucide-react";
import { cn, genVisualDate, style } from "../../../lib/utils";
import {
  Countries,
  genCompetitorName,
  Sex,
  TipoSangre,
  type CompetitorType,
} from "@cronope/schemas";
import { useGetCompetitors } from "./hooks/useGetCompetitors";
import { NewCompetitorForm } from "./new-competitor";
import { EditCompetitorForm } from "./edit-competitor";
import { IconButton } from "../../app/buttons/icon-button";
import { CardItemsInfo } from "../../app/cards";
import { StatusIcon } from "../../app/status";
import { ToggleBanCompetitor } from "./toggle-competitor";

interface Props {
  className?: string;
}

type CompetitorModalType = "edit" | "toggle-ban" | null;
type ListItem = [string, string | number];

export const CompetitorsCard = ({ className }: Props) => {
  const { data } = useGetCompetitors();
  const [dialog, setDialog] = useState<CompetitorModalType>(null);
  const [currentData, setCurrentData] = useState<CompetitorType | null>(null);

  if (!data) return null;

  const handleEdit = (competitor: CompetitorType, dialog: CompetitorModalType) => {
    setCurrentData(competitor);
    setDialog(dialog);
  };

  return (
    <>
      {currentData && (
        <>
          <EditCompetitorForm
            data={currentData}
            open={dialog === "edit"}
            setData={setCurrentData}
            setOpen={setDialog}
          />

          <ToggleBanCompetitor
            data={currentData}
            open={dialog === "toggle-ban"}
            setData={setCurrentData}
            setOpen={setDialog}
          />
        </>
      )}

      <section className={cn(className, "space-y-4 h-full ")}>
        <div className="flex items-center justify-between gap-3 border-b pb-2 border-chart-1">
          <h2 className="font-heading text-lg font-bold uppercase tracking-widest text-chart-2">
            Competidores
          </h2>

          <NewCompetitorForm />
        </div>

        <div className={cn(style.grid, "grid-cols-4 gap-3 ")}>
          {[...data].map((competitor) => {
            const { carnet, blood, email, alergy, emergency, banReason, banned, name, lastName } =
              competitor;
            const competitorName = genCompetitorName(competitor.country, name, lastName);

            const list1: ListItem[] = [
              ["DNI", competitor.dni],
              ["Nacimiento", genVisualDate(competitor.born)[0]],
            ];
            if (carnet) list1.push(["Carnet", carnet]);

            const list2: ListItem[] = [
              ["Sexo", Sex[competitor.sex]],
              ["Telefono", competitor.phone],
            ];
            if (blood) list2.push(["Sangre", TipoSangre[blood]]);

            const list3: ListItem[] = [];
            if (email) list3.push(["Email", email]);
            if (alergy) list3.push(["Alergia", alergy]);
            if (emergency) list3.push(["Emergencia", emergency]);
            if (banned && banReason) list3.push(["Baneo", banReason]);

            return (
              <div key={competitor.id} className={cn(style.dialog)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-bold capitalize">{competitorName}</p>
                    <button onClick={() => handleEdit(competitor, "toggle-ban")}>
                      <StatusIcon
                        status={competitor.banned}
                        className="py-1"
                        badMessage=""
                        goodMessage=""
                      />
                    </button>
                  </div>
                  <IconButton
                    Icon={Pen}
                    onClick={() => handleEdit(competitor, "edit")}
                    tooltip="Editar"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <CardItemsInfo info={list1} />
                  <CardItemsInfo info={list2} />
                </div>
                <CardItemsInfo info={list3} />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
