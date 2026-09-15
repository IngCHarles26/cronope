import { getUserFromEmail } from "@cronope/schemas";
import { cn, style } from "../../lib/utils";
import { CardItemsInfo } from "../app/cards";
import { StatusIcon } from "../app/status";
import type { UserWithRole } from "better-auth/client/plugins";
import type { DialogUserTYpe } from "./page";
import { IconButton } from "../app/buttons/icon-button";
import { Key } from "lucide-react";

interface Props {
  user: UserWithRole;
  handleCurrent: (user: UserWithRole, modal: DialogUserTYpe) => void;
}

export const UserCard = ({ user, handleCurrent }: Props) => {
  const { name, id, banned, role, email } = user;
  const status = banned;
  return (
    <article className={cn(style.dialog, "space-y-3")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-9 rounded uppercase items-center justify-center border border-border-muted bg-surface text-sm font-bold text-primary shrink-0">
            {name.slice(0, 2)}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold  text-text truncate">{name}</p>
            <p className="text-[0.5rem] text-text-soft truncate">{id}</p>
          </div>
        </div>

        <button
          onClick={() => handleCurrent(user, "toggle")}
          className="flex items-center justify-center focus:outline-none">
          <StatusIcon status={!!status} />
        </button>
      </div>

      <CardItemsInfo
        info={[
          ["Tipo", role || "Usuario"],
          ["Usuario", getUserFromEmail(email)],
        ]}
      />

      <div className="w-full flex justify-end gap-2">
        <IconButton
          tooltip="Cambiar Contraseña"
          Icon={Key}
          onClick={() => handleCurrent(user, "reset-password")}
        />
      </div>
    </article>
  );
};
