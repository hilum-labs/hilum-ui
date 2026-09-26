import React, { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Atom,
  Blocks,
  ChevronLeft,
  ChevronRight,
  Frame,
  Home,
  LayoutDashboard,
  Layers,
  Megaphone,
  Palette,
  ShoppingBag,
  SwatchBook,
} from "lucide-react";
import { cn } from "@hilum/ui";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  {
    label: "Overview",
    href: "/",
    icon: Home,
    comingSoon: false,
  },
  {
    label: "Foundations",
    href: "/foundations",
    icon: Palette,
    comingSoon: false,
  },
  {
    label: "Theming",
    href: "/theming",
    icon: SwatchBook,
    comingSoon: false,
  },
  {
    label: "Atoms",
    href: "/atoms",
    icon: Atom,
    comingSoon: false,
  },
  {
    label: "Molecules",
    href: "/molecules",
    icon: Layers,
    comingSoon: false,
  },
  {
    label: "Blocks",
    href: "/blocks",
    icon: Blocks,
    comingSoon: false,
  },
  {
    label: "Designer",
    href: "/designer",
    icon: Frame,
    comingSoon: false,
  },
  {
    label: "Marketing",
    href: "/marketing",
    icon: Megaphone,
    comingSoon: false,
  },
  {
    label: "Ecommerce",
    href: "/ecommerce",
    icon: ShoppingBag,
    comingSoon: false,
  },
  {
    label: "Application UI",
    href: "/application-ui",
    icon: LayoutDashboard,
    comingSoon: false,
  },
];

export function Sidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen flex-col border-r border-border bg-muted transition-[width] duration-200 lg:flex",
        collapsed ? "w-14" : "w-[220px]",
      )}
    >
      {/* Logo mark */}
      <div
        className={cn(
          "flex h-12 items-center border-b border-border",
          collapsed ? "justify-center" : "gap-2.5 px-4",
        )}
      >
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground">
          <span className="text-[11px] font-bold leading-none text-background">D</span>
        </div>
        {!collapsed && (
          <span className="flex-1 truncate body font-semibold text-foreground">Design System</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {!collapsed && <p className="mb-1.5 px-4 label text-muted-foreground">Navigation</p>}
        <div className={cn("flex flex-col gap-0.5", collapsed ? "items-center px-2" : "px-2")}>
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.comingSoon ? "#" : item.href}
                onClick={(e) => item.comingSoon && e.preventDefault()}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-md transition-colors",
                  collapsed ? "size-9 justify-center" : "gap-2.5 px-2.5 py-2",
                  isActive
                    ? "bg-foreground text-background"
                    : item.comingSoon
                      ? "cursor-default text-muted-foreground/50"
                      : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
                )}
              >
                <item.icon size={15} strokeWidth={1.75} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 body font-medium">{item.label}</span>
                    {item.comingSoon && (
                      <span className="caption-xs font-medium text-muted-foreground/50">Soon</span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="flex flex-col gap-2 border-t border-border p-2">
        {!collapsed && <ThemeToggle className="self-start" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground",
            collapsed ? "size-9 justify-center" : "h-8 w-full gap-2 px-2.5",
          )}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} />
              <span className="caption font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export function MobileNavigation() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur lg:hidden">
      <div className="flex h-12 items-center gap-2.5 px-4">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground">
          <span className="text-[11px] font-bold leading-none text-background">D</span>
        </div>
        <span className="flex-1 body font-semibold text-foreground">Design System</span>
        <ThemeToggle />
      </div>
      <nav
        aria-label="Primary navigation"
        className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2"
      >
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.comingSoon ? "#" : item.href}
              onClick={(e) => item.comingSoon && e.preventDefault()}
              className={cn(
                "flex h-9 shrink-0 items-center gap-2 rounded-md px-3 caption font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : item.comingSoon
                    ? "cursor-default text-muted-foreground/50"
                    : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
              )}
            >
              <item.icon size={14} strokeWidth={1.75} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
