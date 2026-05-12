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
        "flex h-14 items-center gap-3 border-b border-taupe-100 bg-white px-4 shrink-0",
        className,
      )}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 caption">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <Fragment key={idx}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-taupe-500 hover:text-taupe-900 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-taupe-900 font-medium" : "text-taupe-500"}>
                    {crumb.label}
                  </span>
                )}
                {!isLast && <ChevronRight size={12} className="text-taupe-300" />}
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
