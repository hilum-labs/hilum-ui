import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn, useLink } from "@hilum/ui";
import { useAppFrame } from "./app-frame";
import type { Crumb } from "./types";

interface AppHeaderProps {
  /** Breadcrumb trail rendered at the start. Last crumb is the current page. */
  breadcrumbs?: Crumb[];
  /** Action buttons at the end. */
  actions?: ReactNode;
  /** Optional content rendered between breadcrumbs and actions. Takes precedence over `search`. */
  center?: ReactNode;
  /** Search control (e.g. `<AppCommandButton />`). Falls back to `<AppShell search>`. */
  search?: ReactNode;
  className?: string;
  children?: ReactNode;
}

function AppHeader({ breadcrumbs, actions, center, search, className, children }: AppHeaderProps) {
  const Link = useLink();
  const frame = useAppFrame();
  const searchSlot = search ?? frame?.search;

  const crumbs =
    breadcrumbs && breadcrumbs.length > 0 ? (
      <nav aria-label="Breadcrumb" className="min-w-0 overflow-hidden">
        <ol className="flex min-w-0 items-center gap-1.5 caption">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <li key={idx} className="flex min-w-0 shrink items-center gap-1.5">
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="inline-flex min-h-10 min-w-0 shrink items-center truncate text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    {...(isLast && { "aria-current": "page" as const })}
                    className={cn(
                      "min-w-0 shrink truncate",
                      isLast ? "text-foreground font-medium" : "text-muted-foreground",
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && (
                  <ChevronRight
                    size={12}
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground rtl:rotate-180"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    ) : null;
  const middle = center ?? searchSlot;

  return (
    <header
      className={cn(
        "flex h-[var(--hilum-header-height,4rem)] items-center gap-3 border-b border-border bg-background px-4 shrink-0",
        className,
      )}
      data-slot="app-header"
    >
      {middle ? (
        <>
          {/* Equal side columns keep the search centered on the header, so it
              doesn't move when the breadcrumb gets longer or shorter. */}
          <div className="flex min-w-0 flex-1 basis-0 items-center">{crumbs}</div>
          <div
            className="flex w-full min-w-0 max-w-xl justify-center"
            {...(!center && { "data-slot": "app-header-search" })}
          >
            {middle}
          </div>
          <div className="flex flex-1 basis-0 items-center justify-end gap-2">
            {actions}
            {children}
          </div>
        </>
      ) : (
        <>
          {crumbs}
          <div className="flex-1" />
          {actions && <div className="flex items-center gap-2">{actions}</div>}
          {children}
        </>
      )}
    </header>
  );
}

export { AppHeader };
export type { AppHeaderProps };
