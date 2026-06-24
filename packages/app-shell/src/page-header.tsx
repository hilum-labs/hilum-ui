import type { ReactNode } from "react";
import { cn } from "@hilum/ui";

interface PageHeaderProps {
  /** Page title — typically rendered as h1. */
  title: ReactNode;
  /** Short prose under the title. */
  description?: ReactNode;
  /** Buttons or controls on the right. */
  actions?: ReactNode;
  /** Optional leading icon rendered inside the title. */
  icon?: ReactNode;
  /** Optional eyebrow above the title (e.g. category, breadcrumb summary). */
  eyebrow?: ReactNode;
  /** Heading level (default: 1). */
  level?: 1 | 2 | 3;
  actionsClassName?: string;
  className?: string;
}

interface PageHeaderActionsProps {
  children: ReactNode;
  className?: string;
}

function PageHeaderActions({ children, className }: PageHeaderActionsProps) {
  return (
    <div
      className={cn(
        "grid w-[calc(100vw-2rem)] max-w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:w-auto sm:max-w-[64vw] sm:flex-wrap sm:items-center sm:justify-end",
        "[&>*:first-child]:col-span-2 [&>*:first-child]:w-full sm:[&>*:first-child]:col-span-1 sm:[&>*:first-child]:w-auto",
        "[&_.dashboard-action-primary]:col-span-2 [&_.dashboard-action-primary]:w-full sm:[&_.dashboard-action-primary]:col-span-1 sm:[&_.dashboard-action-primary]:w-auto",
        "[&_.dashboard-action-wide]:col-span-2 sm:[&_.dashboard-action-wide]:col-span-1",
        className,
      )}
      data-slot="page-header-actions"
    >
      {children}
    </div>
  );
}

function PageHeader({
  title,
  description,
  actions,
  icon,
  eyebrow,
  level = 1,
  actionsClassName,
  className,
}: PageHeaderProps) {
  const Tag = `h${level}` as const;
  const headingTitle = icon ? (
    <span className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/30 text-ground-700 ring-1 ring-border [&_svg]:size-5">
        {icon}
      </span>
      <span className="min-w-0 truncate">{title}</span>
    </span>
  ) : (
    title
  );

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-6 pb-6 border-b border-border",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="caption-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
            {eyebrow}
          </div>
        )}
        <Tag
          className={cn(
            "text-balance",
            level === 1
              ? "heading-xl text-foreground"
              : level === 2
                ? "heading text-foreground"
                : "subheading text-foreground",
          )}
        >
          {headingTitle}
        </Tag>
        {description && (
          <p className="body mt-2 max-w-2xl text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {actions &&
        (actionsClassName ? (
          <PageHeaderActions className={actionsClassName}>{actions}</PageHeaderActions>
        ) : (
          <PageHeaderActions>{actions}</PageHeaderActions>
        ))}
    </div>
  );
}

export { PageHeader, PageHeaderActions };
export type { PageHeaderProps, PageHeaderActionsProps };
