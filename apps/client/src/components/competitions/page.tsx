import { cn, style } from "../../lib/utils";
import { useGetCompetitions } from "./hooks/useGetCompetitions";
import { useState } from "react";
import type { CompetitionType } from "@cronope/schemas";
import { ToggleCompetition } from "./toggle-competition";
import { EditCompetition } from "./edit-competition";
import { CompetitionCard } from "./card";
import { DeleteCompetition } from "./delete-competition";
import { EditCounters } from "./edit-counters";
import { EditParticipants } from "./edit-participants";
import { ResultsCompetition } from "./results-competition";
import { EditCategories } from "./edit-categories";
import { OrderParticipant } from "./order-participant";

export type DialogCompetitionType =
  | "toggle"
  | "counters"
  | "edit"
  | "participants"
  | "results"
  | "delete"
  | "categories"
  | "participant-start"
  | null;

const CompetitionsPage = () => {
  const [dialog, setDialog] = useState<DialogCompetitionType>(null);
  const [current, setCurrent] = useState<CompetitionType | null>(null);

  const { data } = useGetCompetitions();

  if (!data) return null;

  const handleDialog = (data: CompetitionType, type: DialogCompetitionType) => {
    setCurrent(data);
    setDialog(type);
  };

  return (
    <>
      {current && (
        <>
          <ToggleCompetition
            open={dialog === "toggle"}
            setOpen={setDialog}
            data={current}
            setData={setCurrent}
          />
          <EditCompetition
            data={current}
            open={dialog === "edit"}
            setOpen={setDialog}
            setData={setCurrent}
          />
          <DeleteCompetition
            data={current}
            open={dialog === "delete"}
            setOpen={setDialog}
            setData={setCurrent}
          />
          <EditCounters
            data={current}
            open={dialog === "counters"}
            setOpen={setDialog}
            setData={setCurrent}
          />
          <EditParticipants
            data={current}
            open={dialog === "participants"}
            setOpen={setDialog}
            setData={setCurrent}
          />
          <EditCategories
            data={current}
            open={dialog === "categories"}
            setOpen={setDialog}
            setData={setCurrent}
          />
          <ResultsCompetition
            data={current}
            open={dialog === "results"}
            setOpen={setDialog}
            setData={setCurrent}
          />
          <OrderParticipant
            data={current}
            open={dialog === "participant-start"}
            setOpen={setDialog}
            setData={setCurrent}
          />
        </>
      )}

      <div className={style.page}>
        <div className={cn(style.grid, "grid-cols-4")}>
          {data?.competitions.map((competition) => (
            <CompetitionCard key={competition.id} data={competition} handleDialog={handleDialog} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CompetitionsPage;
