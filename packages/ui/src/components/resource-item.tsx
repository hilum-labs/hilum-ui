import * as React from "react";
import { cn } from "../lib/utils";

/* ─────────────────────── ResourceCell ─────────────────────── */

interface ResourceCellProps {
  /** Primary line — the resource name / order number. Rendered strongest. */
  title: React.ReactNode;
  /** Secondary line — email, SKU, "3 items", date. Rendered muted and smaller. */
  subtitle?: React.ReactNode;
  /** Leading thumbnail / avatar (32px works best). */
  media?: React.ReactNode;
  /** Inline trailing content on the title line (e.g. a StatusBadge). */
  badge?: React.ReactNode;
  /** Link the title (e.g. to the detail page). Use a router link via `title` for SPA navigation. */
  href?: string;
  className?: string;
}

/**
 * Two-line table cell with the canonical hierarchy: a strong primary line and
 * a muted secondary line — never the other way round. Use it for the first
 * column of resource tables (products, orders, customers, merchants).
 */
function ResourceCell({ title, subtitle, media, badge, href, className }: ResourceCellProps) {
  const titleNode = href ? (
    <a
      href={href}
      className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {title}
    </a>
  ) : (
    title
  );
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)} data-slot="resource-cell">
      {media && <div className="shrink-0">{media}</div>}
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <span className="body min-w-0 truncate font-medium text-foreground">{titleNode}</span>
          {badge && <span className="shrink-0">{badge}</span>}
        </div>
        {subtitle && <div className="caption truncate text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  );
}
ResourceCell.displayName = "ResourceCell";

/* ─────────────────────── ResourceItem ─────────────────────── */

interface ResourceItemProps extends Omit<ResourceCellProps, "href" | "className"> {
  /** Row-level metadata under the subtitle (e.g. "Sep 26, 2026 · 3 items"). */
  meta?: React.ReactNode;
  /** Right-aligned primary value (amount, count). */
  trailing?: React.ReactNode;
  /** Right-aligned secondary value under `trailing` (date, status). */
  trailingSecondary?: React.ReactNode;
  /** Make the whole row a link. */
  href?: string;
  /** Make the whole row a button. Ignored when `href` is set. */
  onClick?: () => void;
  /** Accessible name when the row is interactive and `title` isn't plain text. */
  "aria-label"?: string;
  className?: string;
}

/**
 * List row for `<StackedList>` — the mobile counterpart of a resource table
 * row. Same primary/secondary hierarchy as ResourceCell, with a trailing
 * value column. The entire row is one link/button target.
 */
function ResourceItem({
  title,
  subtitle,
  media,
  badge,
  meta,
  trailing,
  trailingSecondary,
  href,
  onClick,
  "aria-label": ariaLabel,
  className,
}: ResourceItemProps) {
  const inner = (
    <span className={cn("flex min-w-0 items-center gap-3 px-4 py-3.5", className)}>
      {media && <span className="block shrink-0">{media}</span>}
      <span className="block min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="body min-w-0 truncate font-medium text-foreground">{title}</span>
          {badge && <span className="shrink-0">{badge}</span>}
        </span>
        {subtitle && <span className="caption block truncate text-muted-foreground">{subtitle}</span>}
        {meta && <span className="caption mt-0.5 block truncate text-muted-foreground">{meta}</span>}
      </span>
      {(trailing || trailingSecondary) && (
        <span className="flex shrink-0 flex-col items-end gap-0.5 text-right">
          {trailing && (
            <span className="body font-medium tabular-nums text-foreground">{trailing}</span>
          )}
          {trailingSecondary && (
            <span className="caption text-muted-foreground">{trailingSecondary}</span>
          )}
        </span>
      )}
    </span>
  );

  const interactive =
    "block w-full text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

  return (
    <li data-slot="resource-item">
      {href ? (
        <a href={href} className={interactive} aria-label={ariaLabel}>
          {inner}
        </a>
      ) : onClick ? (
        <button type="button" onClick={onClick} className={interactive} aria-label={ariaLabel}>
          {inner}
        </button>
      ) : (
        inner
      )}
    </li>
  );
}
ResourceItem.displayName = "ResourceItem";

export { ResourceCell, ResourceItem };
export type { ResourceCellProps, ResourceItemProps };
