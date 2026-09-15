import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type TooltipSide = "top" | "bottom" | "left" | "right";

interface Props {
  children: ReactNode;
  text: string;
  offset?: number;
  side?: TooltipSide;
}

export const TextTooltip = ({ children, text, offset = 10, side = "top" }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className={"truncate"} />}>{children}</TooltipTrigger>

      <TooltipContent
        side={side}
        sideOffset={offset}
        className="rounded bg-primary/90 text-chart-2 font-semibold"
        arrowClassName="bg-primary/90 fill-primary/90">
        {text}
      </TooltipContent>
    </Tooltip>
  );
};
