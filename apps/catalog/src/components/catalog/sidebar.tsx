import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function usePathname() {
  return useLocation().pathname;
}
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
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-taupe-100 bg-taupe-50 transition-all duration-200",
        collapsed ? "w-14" : "w-[220px]"
      )}
    >
      {/* Logo mark */}
      <div
        className={cn(
          "flex h-12 items-center border-b border-taupe-100",
          collapsed ? "justify-center" : "gap-2.5 px-4"
        )}
      >
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-taupe-900">
          <span className="text-[11px] font-bold leading-none text-white">D</span>
        </div>
        {!collapsed && (
          <span className="body font-semibold text-taupe-900">
            Design System
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {!collapsed && (
          <p className="mb-1.5 px-4 label text-taupe-400">
            Navigation
          </p>
        )}
        <div className={cn("flex flex-col gap-0.5", collapsed ? "items-center px-2" : "px-2")}>
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.comingSoon ? "#" : item.href}
                onClick={(e) => item.comingSoon && e.preventDefault()}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-md transition-colors",
                  collapsed
                    ? "size-9 justify-center"
                    : "gap-2.5 px-2.5 py-2",
                  isActive
                    ? "bg-taupe-900 text-white"
                    : item.comingSoon
                      ? "cursor-default text-taupe-300"
                      : "text-taupe-500 hover:bg-taupe-100 hover:text-taupe-900"
                )}
              >
                <item.icon size={15} strokeWidth={1.75} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 body font-medium">{item.label}</span>
                    {item.comingSoon && (
                      <span className="caption-xs font-medium text-taupe-300">
                        Soon
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-taupe-100 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center rounded-md text-taupe-400 transition-colors hover:bg-taupe-100 hover:text-taupe-600",
            collapsed
              ? "size-9 justify-center"
              : "h-8 w-full gap-2 px-2.5"
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
