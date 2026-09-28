import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import {
  cn,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useLink,
} from "@hilum/ui";
import { useAppFrame } from "./app-frame";
import { AppNavTree } from "./app-nav-tree";
import { isNavItemActive } from "./nav-utils";
import type { NavItem } from "./types";

interface NavbarProps {
  /** Logo block on the far left. */
  logo?: ReactNode;
  /** Top-level navigation items. Nested `children` are listed in the mobile menu. */
  items?: NavItem[];
  /** Right-aligned actions / user menu. */
  actions?: ReactNode;
  /** Search control. Falls back to `<AppShellStacked search>`. */
  search?: ReactNode;
  /** Accessible name for the navigation landmark. Default: "Main". */
  navLabel?: string;
  /**
   * Below `md` the inline links are hidden; a menu button opens a sheet listing
   * every item instead. Pass `false` to render no mobile menu. Default: `true`.
   */
  mobileMenu?: boolean;
  /** Accessible label for the mobile menu button. Default: "Open menu". */
  menuLabel?: string;
  /** Title shown at the top of the mobile menu sheet. Default: "Menu". */
  menuTitle?: ReactNode;
  className?: string;
}

/**
 * Top navigation bar — used by `<AppShellStacked>` and standalone (marketing
 * site, landing pages, etc.). For sidebar app top bars use `<AppHeader>`.
 */
function Navbar({
  logo,
  items = [],
  actions,
  search,
  navLabel = "Main",
  mobileMenu = true,
  menuLabel = "Open menu",
  menuTitle = "Menu",
  className,
}: NavbarProps) {
  const Link = useLink();
  const frame = useAppFrame();
  const searchSlot = search ?? frame?.search;
  const [menuOpen, setMenuOpen] = useState(false);
  const showMobileMenu = mobileMenu && items.length > 0;

  return (
    <header
      className={cn(
        "flex h-[var(--hilum-header-height,4rem)] shrink-0 items-center gap-3 border-b border-border bg-card px-4 md:gap-6 md:px-6",
        className,
      )}
      data-slot="navbar"
    >
      {showMobileMenu && (
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={menuLabel}
              className="-ms-2 flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex w-72 max-w-[85dvw] flex-col overflow-y-auto p-4"
          >
            <SheetHeader className="pe-10">
              <SheetTitle>{menuTitle}</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
            </SheetHeader>
            <AppNavTree
              sections={[{ items }]}
              label={navLabel}
              onNavigate={() => setMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>
      )}

      {logo && <div className="shrink-0">{logo}</div>}

      {items.length > 0 && (
        <nav aria-label={navLabel} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {items.map((item, idx) => {
              const active = isNavItemActive(item);
              const itemClass = cn(
                "flex min-h-10 items-center gap-2 rounded-md px-3 caption transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              );
              return (
                <li key={idx}>
                  {item.disabled ? (
                    <span
                      role="link"
                      aria-disabled="true"
                      className={cn(itemClass, "cursor-not-allowed text-muted-foreground/60")}
                    >
                      {item.icon && <item.icon size={14} aria-hidden="true" />}
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={item.active ? "page" : undefined}
                      {...(item.onClick !== undefined && { onClick: item.onClick })}
                      className={cn(
                        itemClass,
                        active
                          ? "text-foreground bg-muted font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {item.icon && <item.icon size={14} aria-hidden="true" />}
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className="min-w-0 flex-1">
        {searchSlot && (
          <div className="mx-auto flex w-full max-w-xl justify-center" data-slot="navbar-search">
            {searchSlot}
          </div>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export { Navbar };
export type { NavbarProps };
