import type { ReactNode } from "react";
import { cn } from "@hilum/ui";
import { useLink } from "./link-context";
import type { NavItem } from "./types";

interface NavbarProps {
  /** Logo block on the far left. */
  logo?: ReactNode;
  /** Top-level navigation items. */
  items?: NavItem[];
  /** Right-aligned actions / user menu. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Standalone top navigation bar — used outside <AppShell> (marketing site,
 * landing pages, etc.). For app top bars use <AppHeader> inside <AppShell>.
 */
function Navbar({ logo, items = [], actions, className }: NavbarProps) {
  const Link = useLink();

  return (
    <nav
      className={cn(
        "flex h-16 items-center gap-6 border-b border-ground-100 bg-white px-6",
        className,
      )}
    >
      {logo && <div className="shrink-0">{logo}</div>}

      <ul className="hidden md:flex items-center gap-1">
        {items.map((item, idx) => (
          <li key={idx}>
            <Link
              href={item.href}
              {...(item.onClick !== undefined && { onClick: item.onClick })}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 caption transition-colors",
                item.active
                  ? "text-ground-900 bg-ground-50 font-medium"
                  : "text-ground-500 hover:text-ground-900 hover:bg-ground-50",
              )}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex-1" />

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </nav>
  );
}

export { Navbar };
export type { NavbarProps };
