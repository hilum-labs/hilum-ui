import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@hilum/ui";
import { useLink } from "./link-context";
import type { Crumb } from "./types";

interface AppHeaderProps {
  /** Breadcrumb trail rendered on the left. Last crumb is the current page. */
  breadcrumbs?: Crumb[];
  /** Action buttons on the right. */
  actions?: ReactNode;
  /** Optional content rendered between breadcrumbs and actions (e.g. search). */
  center?: ReactNode;
  className?: string;
  children?: ReactNode;
}

function AppHeader({ breadcrumbs, actions, center, className, children }: AppHeaderProps) {
  const Link = useLink();

  return (
    <header
      className={cn(
        "flex h-14 items-center gap-3 border-b border-border bg-card px-4 shrink-0",
        className,
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 overflow-hidden caption"
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <Fragment key={idx}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="inline-flex min-h-10 min-w-0 shrink items-center truncate text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "min-w-0 shrink truncate",
                      isLast ? "text-foreground font-medium" : "text-muted-foreground",
                    )}
                  >
                    {crumb.label}
                  </span>
                )}
                {!isLast && <ChevronRight size={12} className="shrink-0 text-muted-foreground" />}
              </Fragment>
            );
          })}
        </nav>
      )}

      {center && <div className="flex-1 flex justify-center">{center}</div>}
      {!center && <div className="flex-1" />}

      {actions && <div className="flex items-center gap-2">{actions}</div>}
      {children}
    </header>
  );
}

import { Fragment } from "react";

export { AppHeader };
export type { AppHeaderProps };
