import { cn, style } from "../../lib/utils";
import { CategoriesCard } from "./categories/card";
import { TeamsCard } from "./teams/card";
import { CompetitorsCard } from "./competitors/card";

const ExtrasPage = () => {
  return (
    <div className={cn(style.page, "flex items-start gap-4 ")}>
      <CategoriesCard className="w-[10%]" />
      <TeamsCard className="w-[15%]" />
      <CompetitorsCard className="w-[75%]" />
    </div>
  );
};

export default ExtrasPage;
