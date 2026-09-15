import { cn, style } from "../../lib/utils";
import { useGetUsers } from "./hooks/useGetUsers";
import { useState } from "react";
import { ToggleBanUser } from "./toggle-user";
import { ChangeUserPassword } from "./change-user-password";
import { UserCard } from "./card";
import type { UserWithRole } from "better-auth/client/plugins";

export type DialogUserTYpe = "toggle" | "reset-password" | null;

const UsersPage = () => {
  const { data } = useGetUsers();

  const [modal, setModal] = useState<DialogUserTYpe>(null);
  const [current, setCurrent] = useState<UserWithRole | null>(null);

  if (!data) return null;

  const handleCurrent = (user: UserWithRole, modal: DialogUserTYpe) => {
    setCurrent(user);
    setModal(modal);
  };

  return (
    <div className={cn(style.page)}>
      {current && (
        <>
          <ToggleBanUser
            data={current}
            open={modal === "toggle"}
            setOpen={setModal}
            setData={setCurrent}
          />

          <ChangeUserPassword
            data={current}
            open={modal === "reset-password"}
            setOpen={setModal}
            setData={setCurrent}
          />
        </>
      )}

      <div className={cn(style.grid, "xl:grid-cols-4 2xl:grid-cols-5")}>
        {data.map((user) => (
          <UserCard key={user.id} user={user} handleCurrent={handleCurrent} />
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
