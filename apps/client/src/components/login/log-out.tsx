import { signOut } from "../../lib/auth-client";
import { ConfirmActionDialog } from "../app/confirm-action";
import { LogOutIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QK_SESSION } from "./hooks/useGetSession";
import { useState } from "react";

const footerTextClassName = (isVisible: boolean) =>
  isVisible
    ? "overflow-hidden whitespace-nowrap transition-[opacity,transform,max-width] duration-200 max-w-48 translate-x-0 opacity-100 delay-150"
    : "overflow-hidden whitespace-nowrap transition-[opacity,transform,max-width] duration-200 max-w-0 -translate-x-2 opacity-0 delay-0";

interface Props {
  isSidebarCollapsed?: boolean;
}

export const LogOut = ({ isSidebarCollapsed }: Props) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleLogOut = async () => {
    await signOut();
    queryClient.invalidateQueries({ queryKey: QK_SESSION });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-md text-sm text-secondary-text transition-all duration-200 hover:bg-destructive/5 hover:text-destructive text-nowrap">
        <LogOutIcon className="size-5 shrink-0" />

        <span className={footerTextClassName(!isSidebarCollapsed)}>Salir</span>
      </button>
      <ConfirmActionDialog
        open={open}
        setOpen={setOpen}
        onClick={handleLogOut}
        Icon={LogOutIcon}
        title="Cerrar Sesión"
        description="¿Estás seguro de que quieres cerrar sesión?"
        color="error"
      />
    </>
  );
};
