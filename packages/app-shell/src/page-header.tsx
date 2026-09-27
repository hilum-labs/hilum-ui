import type { ReactNode } from "react";
import { cn } from "@hilum/ui";
import { ChevronLeft } from "lucide-react";
import { useLink } from "./link-context";

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
  /**
   * Let long titles wrap instead of truncating when an `icon` is present
   * (recommended on mobile). Default: false.
   */
  wrapTitle?: boolean;
  /** Heading level (default: 1). */
  level?: 1 | 2 | 3;
  /**
   * Back link for detail pages ("‹ Orders"). Renders through the app's
   * injected link component. Prefer this over page-level breadcrumbs when the
   * AppHeader already shows the breadcrumb trail — never render both.
   */
  back?: { href: string; label: string };
  /** Inline badges next to the title (e.g. `<StatusBadge status="paid" />`). */
  badges?: ReactNode;
  /** Secondary metadata row under the title/description ("Created Sep 26, 2026 · Online Store"). */
  meta?: ReactNode;
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
  back,
  badges,
  meta,
  wrapTitle = false,
  actionsClassName,
  className,
}: PageHeaderProps) {
  const Link = useLink();
  const Tag = `h${level}` as const;
  const headingTitle = icon ? (
    <span className={cn("flex min-w-0 gap-3", wrapTitle ? "items-start" : "items-center")}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/30 text-ground-700 ring-1 ring-border [&_svg]:size-5">
        {icon}
      </span>
      <span className={cn("min-w-0", wrapTitle ? "break-words" : "truncate")}>{title}</span>
    </span>
  ) : (
    title
  );

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="caption -ml-1 mb-2 inline-flex items-center gap-0.5 rounded-md px-1 py-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            {back.label}
          </Link>
        )}
        {eyebrow && (
          <div className="caption-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
            {eyebrow}
          </div>
        )}
        <div className={cn(badges && "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5")}>
          <Tag
            className={cn(
              "min-w-0 text-balance",
              level === 1
                ? "heading-xl text-foreground"
                : level === 2
                  ? "heading text-foreground"
                  : "subheading text-foreground",
            )}
          >
            {headingTitle}
          </Tag>
          {badges && (
            <div className="flex shrink-0 flex-wrap items-center gap-1.5" data-slot="page-header-badges">
              {badges}
            </div>
          )}
        </div>
        {description && (
          <p className="body mt-2 max-w-2xl text-pretty text-muted-foreground">{description}</p>
        )}
        {meta && (
          <div
            className="caption mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground"
            data-slot="page-header-meta"
          >
            {meta}
          </div>
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
