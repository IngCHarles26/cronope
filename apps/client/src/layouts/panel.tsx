import { useGetSession } from "../components/login/hooks/useGetSession";
import type { Roles } from "@cronope/schemas";
import { AppSidebar } from "../components/sidebar/sidebar";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useNavigationStore } from "../lib/store/navigation";
import { navItemsForRole } from "../components/sidebar/nav-items";
import { useEffect, useState, type ComponentType } from "react";
import type { SideBarItemsItemsInterface } from "../components/sidebar/types.interface";
import { spaRoutes } from "../lib/utils/routes";

const genItems = (navItems: SideBarItemsItemsInterface) => {
  const items: { path: string; Component?: ComponentType<any> }[] = [];
  const { single, group } = navItems;
  if (group)
    items.push(
      ...group.flatMap((g) => g.options).map((o) => ({ path: o.path, Component: o.Component })),
    );
  if (single) items.push(...single.map((s) => ({ path: s.path, Component: s.Component })));

  return items;
};

const PanelLayout = () => {
  const { data } = useGetSession();
  const role = data?.data?.user.role as Roles;
  const name = data?.data?.user.name || "";
  const { pathname } = useLocation();
  const { title, description } = useNavigationStore();
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (role && role === "counter") navigate(`/${spaRoutes.timer}`);
  }, [role, navigate]);

  const items = genItems(navItemsForRole[role]);
  useEffect(() => {
    const item = items.find((i) => i.path === pathname);
    if (!item) return setComponent(null);
    const { Component } = item;
    if (!Component) return setComponent(null);
    setComponent(() => Component);
  }, [pathname]);

  const isInPanel = pathname === "/panel";

  return (
    <div className="flex min-h-screen">
      <AppSidebar role={role} name={name} />
      <main className="flex-1 flex flex-col">
        <div className="py-2 px-3 2xl:px-5 sticky top-0 z-10 flex items-center bg-background text-sidebar-primary border-b border-accent h-14">
          <div className="mr-auto">
            <h1 className="text-lg 2xl:text-xl font-bold uppercase">
              {isInPanel ? "Bienvenido" : title}
            </h1>
            {description && (
              <h2 className="text-sm 2xl:text-base text-muted capitalize">{description}</h2>
            )}
          </div>
          {Component && <Component />}
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default PanelLayout;

/**
 * El evento cuando se pasa el mouse sobre un button es: onMouseEnter
 * cuando el orden de las keys no importa, se envia com un objeto
 *
 */
