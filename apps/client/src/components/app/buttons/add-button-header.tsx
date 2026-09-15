import { TextTooltip } from "../tooltip";
import { style } from "../../../lib/utils";
import { Plus } from "lucide-react";

interface Props {
  onClick: () => any;
  tooltip: string;
  disabled?: boolean;
}

export const PlusHeaderButton = ({ onClick, tooltip, disabled = false }: Props) => {
  if (disabled) return null;

  return (
    <TextTooltip text={tooltip} side="left">
      <button onClick={onClick} className={style.dialogButton}>
        <Plus className="size-4" />
      </button>
    </TextTooltip>
  );
};
