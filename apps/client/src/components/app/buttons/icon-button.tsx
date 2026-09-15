import type { MouseEvent } from "react";
import type { IconType } from "../../../lib/types/ui.interface";
import { style, cn } from "../../../lib/utils";
import { TextTooltip, type TooltipSide } from "../tooltip";

interface Props {
  tooltip: string;
  Icon: IconType;

  onClick?: () => void;
  onClickForm?: (e: MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: () => void;

  className?: string;
  side?: TooltipSide;
}

export const IconButton = ({
  tooltip,
  Icon,
  onClick,
  onClickForm,
  onMouseEnter,
  className,
  side = "bottom",
}: Props) => {
  return (
    <TextTooltip text={tooltip} side={side}>
      <button
        onClick={onClickForm ?? onClick}
        onMouseEnter={onMouseEnter}
        className={cn(style.dialogButton, "flex items-center", className)}>
        <Icon className="size-3.5" />
      </button>
    </TextTooltip>
  );
};
