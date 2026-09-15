import { type Roles } from "@cronope/schemas";
import { Navigate, Outlet } from "react-router";
import Loading from "../app/loading";
import { spaRoutes } from "../../lib/utils/routes";
import { useGetSession } from "./hooks/useGetSession";
// import { useEffect } from "react";

const { panel, login } = spaRoutes;

export const AuthPass = () => {
  const { isPending, data } = useGetSession();
  // const navigate = useNavigate();

  if (isPending) return <Loading />;

  // useEffect(() => {
  //   if (data && data.data) navigate(spaRoutes.panel, { replace: true });
  // }, [data, navigate]);
  if (data && data.data) return <Navigate to={`/${panel}`} replace />;

  return <Outlet />;
};

export const AuthGuard = () => {
  const { isPending, data } = useGetSession();

  if (isPending) return <Loading />;

  // useEffect(() => {
  //   if (data && data.data) navigate(spaRoutes.panel, { replace: true });
  // }, [data, navigate]);

  if (!data || data.error || !data.data) return <Navigate to={`/${login}`} replace />;

  return <Outlet />;
};

interface RoleGuardProps {
  allowedRoles: Roles[];
}
export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { isPending, data } = useGetSession();

  if (isPending) return <Loading />;
  if (!data || data.error || !data.data) return <Navigate to={`/${login}`} replace />;

  const role = data.data.user.role as Roles;
  if (!allowedRoles.includes(role)) return <Navigate to={`/${panel}`} replace />;

  return <Outlet />;
};
