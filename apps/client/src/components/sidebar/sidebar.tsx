"use client";

import {
  ChevronDownIcon,
  MenuIcon,
  PanelRightClose,
  PanelRightOpen,
  TimerReset,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { navItemsForRole } from "./nav-items";
import type { Roles } from "@cronope/schemas";
import { cn } from "../../lib/utils";
import { useLocation, useNavigate } from "react-router";
import { useNavigationStore } from "../../lib/store/navigation";
import { LogOut } from "../login/log-out";

const sidebarTextClassName = (isVisible: boolean) =>
  cn(
    "overflow-hidden whitespace-nowrap transition-[opacity,width,transform] duration-150 ease-out",
    isVisible
      ? "w-auto translate-x-0 opacity-100"
      : "w-0 -translate-x-2 opacity-0 pointer-events-none",
  );

interface Props {
  role: Roles;
  name: string;
}

export const AppSidebar = ({ role, name }: Props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { single, group } = navItemsForRole[role];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const setHeaderInfo = useNavigationStore((st) => st.setHeaderInfo);
  const navigate = useNavigate();
  const { pathname: pathName } = useLocation();

  const handleMenuClick = (label: string) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      return setOpenGroups({ [label]: true });
    }

    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleOption = (_title: string, description?: string) => {
    setHeaderInfo(_title, description);
    setIsMobileSidebarOpen(false);
  };

  const handleCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileSidebarOpen(true)}
        className="fixed left-4 bottom-4 z-50 flex items-center justify-center rounded-md border border-sidebar-border bg-sidebar p-2 text-sidebar-foreground shadow-sm lg:hidden"
        aria-label="Abrir menu lateral">
        <MenuIcon className="size-6" />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 lg:hidden",
          isMobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={handleCloseMobileSidebar}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-[width,transform] duration-300 ease-out border-r border-sidebar-border lg:sticky lg:top-0 lg:z-40",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isSidebarCollapsed ? "w-11 2xl:w-12" : "w-72 lg:w-50 2xl:w-50",
        )}>
        {/* Header Section */}
        <div
          className={cn(
            "flex items-center gap-2 p-2 transition-all duration-300 relative",
            isSidebarCollapsed
              ? "justify-center"
              : "bg-linear-to-br from-primary/5 to-primary/0 justify-start ",
          )}>
          {isMobileSidebarOpen && (
            <div className="absolute flex items-center justify-end p-2 lg:hidden right-0">
              <button
                onClick={handleCloseMobileSidebar}
                className="rounded-md p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                aria-label="Cerrar menu lateral">
                <XIcon className="size-5" />
              </button>
            </div>
          )}

          <TimerReset className="text-chart-2 size-7" />
          <div className={cn("w-full text-left", sidebarTextClassName(!isSidebarCollapsed))}>
            <h3
              className={cn(
                "font-space-grotesk text-sm 2xl:text-base font-bold text-sidebar-primary uppercase tracking-widest",
                sidebarTextClassName(!isSidebarCollapsed),
              )}>
              {role}
            </h3>
            <p
              className={cn(
                "text-xs font-medium capitalize text-chart-2",
                sidebarTextClassName(!isSidebarCollapsed),
              )}>
              {name}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {/* _________________ Group Items */}
          {group &&
            group.map(({ Icon, label, options }) => {
              const isGroupOpen = !!openGroups[label];
              const isActive = options.some((subItem) => pathName.includes(subItem.path));

              return (
                <div key={label} className="space-y-0.5">
                  {/* Menu Item Button */}
                  <button
                    type="button"
                    onClick={() => handleMenuClick(label)}
                    className={cn(
                      "w-full transition-all duration-200 font-medium text-sm 2xl:text-base capitalize px-3 py-1.5 flex items-center",
                      isSidebarCollapsed ? "justify-center gap-0" : "gap-2",
                      isActive
                        ? "bg-sidebar-primary/15 text-sidebar-primary border-r-4 border-sidebar-primary shadow-sm font-bold"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground font-normal",
                    )}
                    title={isSidebarCollapsed ? label : undefined}>
                    <span className="flex size-5 shrink-0 flex-none items-center justify-center">
                      <Icon
                        className={cn(
                          "shrink-0 transition-transform duration-200",
                          "size-5",
                          isActive && "text-sidebar-primary",
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-left",
                        sidebarTextClassName(!isSidebarCollapsed),
                      )}>
                      {label}
                    </span>
                    {!isSidebarCollapsed && (
                      <ChevronDownIcon
                        className={cn(
                          "size-4 2xl:size-5 transition-transform duration-300",
                          isGroupOpen ? "rotate-180" : "rotate-0",
                        )}
                      />
                    )}
                  </button>

                  {/* Submenu Items */}
                  <ul
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-out",
                      !isSidebarCollapsed && isGroupOpen
                        ? "max-h-56 opacity-100"
                        : "max-h-0 opacity-0",
                    )}>
                    {options.map((subItem, ix) => (
                      <li key={ix + subItem.label}>
                        <button
                          className="w-full px-10 py-0.5 text-left text-xs 2xl:text-sm text-sidebar-foreground/70 rounded-md transition-all duration-200 capitalize hover:text-sidebar-primary hover:bg-sidebar-accent hover:pl-12 ml-2"
                          onClick={() => handleOption(label, subItem.label)}>
                          <p
                            className={cn(
                              sidebarTextClassName(!isSidebarCollapsed && isGroupOpen),
                            )}>
                            {subItem.label}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

          {/* _________________ single Items */}
          {single &&
            single.map(({ Icon, label, path }) => {
              const isActive = pathName.includes(path);

              return (
                <div key={label} className="space-y-0.5">
                  {/* Menu Item Button */}
                  <button
                    // href={path}
                    onClick={() => {
                      handleOption(label);
                      setIsSidebarCollapsed(false);
                      navigate(path);
                    }}
                    className={cn(
                      "w-full transition-all duration-200 text-sm 2xl:text-base capitalize px-3 py-1.5 flex items-center",
                      isSidebarCollapsed ? "justify-center gap-0" : "gap-2",
                      isActive
                        ? "bg-sidebar-primary/15 text-sidebar-primary border-r-4 border-sidebar-primary shadow-sm font-bold"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                    title={isSidebarCollapsed ? label : undefined}>
                    <span className="flex size-5 shrink-0 flex-none items-center justify-center">
                      <Icon
                        className={cn(
                          "shrink-0 transition-transform duration-200 size-5",
                          isActive && "text-sidebar-primary",
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-left",
                        sidebarTextClassName(!isSidebarCollapsed),
                      )}>
                      {label}
                    </span>
                  </button>
                </div>
              );
            })}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden w-full items-center gap-3 rounded-md text-sm text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground lg:flex lg:justify-start">
            {!isSidebarCollapsed ? (
              <PanelRightOpen className="size-5 shrink-0" />
            ) : (
              <PanelRightClose className="size-5 shrink-0" />
            )}

            <span className={sidebarTextClassName(!isSidebarCollapsed)}>Contraer</span>
          </button>

          {/* <ChangePassword isCollapsed={isSidebarCollapsed} /> */}

          <LogOut isSidebarCollapsed={isSidebarCollapsed} />
        </div>
      </aside>
    </>
  );
};
