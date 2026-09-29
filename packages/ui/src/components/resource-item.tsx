"use client";

import * as React from "react";
import { cn, isOwnEvent } from "../lib/utils";
import { useLink } from "../lib/link-context";

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
  /** Link the title (e.g. to the detail page). Rendered with the `LinkProvider` component for SPA navigation. */
  href?: string;
  className?: string;
}

/**
 * Two-line table cell with the canonical hierarchy: a strong primary line and
 * a muted secondary line — never the other way round. Use it for the first
 * column of resource tables (products, orders, customers, merchants).
 */
function ResourceCell({ title, subtitle, media, badge, href, className }: ResourceCellProps) {
  const Link = useLink();
  const titleNode = href ? (
    <Link
      href={href}
      className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {title}
    </Link>
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
 *
 * With `href` the title is the link, stretched over the row (a `::after`
 * overlay), so a click anywhere in the row, a middle-click, ⌘/Ctrl-click or
 * "Open in new tab" hits a real anchor, while the other slots sit outside
 * the link in the React tree: a Dialog or menu portalled from `badge` or
 * `trailing` doesn't bubble its clicks into the router link. The link is
 * described by the subtitle, meta, badge and trailing values. A control in a
 * slot (a menu trigger) needs `relative z-10` to sit above the overlay.
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
  const Link = useLink();
  const id = React.useId();
  const slotId = (slot: string, present: unknown) => (present ? `${id}-${slot}` : undefined);
  const ids = {
    badge: slotId("badge", badge),
    subtitle: slotId("subtitle", subtitle),
    meta: slotId("meta", meta),
    trailing: slotId("trailing", trailing),
    trailingSecondary: slotId("trailing-secondary", trailingSecondary),
  };
  const describedBy = href ? Object.values(ids).filter(Boolean).join(" ") : "";

  const titleNode = href ? (
    <Link
      href={href}
      className={cn(
        "outline-none after:absolute after:inset-0 after:content-['']",
        "focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring",
      )}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(describedBy ? { "aria-describedby": describedBy } : {})}
    >
      {title}
    </Link>
  ) : (
    title
  );

  const inner = (
    <span className={cn("flex min-w-0 items-center gap-3 px-4 py-3.5", className)}>
      {media && <span className="block shrink-0">{media}</span>}
      <span className="block min-w-0 flex-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="body min-w-0 truncate font-medium text-foreground">{titleNode}</span>
          {badge && (
            <span id={ids.badge} className="shrink-0">
              {badge}
            </span>
          )}
        </span>
        {subtitle && (
          <span id={ids.subtitle} className="caption block truncate text-muted-foreground">
            {subtitle}
          </span>
        )}
        {meta && (
          <span id={ids.meta} className="caption mt-0.5 block truncate text-muted-foreground">
            {meta}
          </span>
        )}
      </span>
      {(trailing || trailingSecondary) && (
        <span className="flex shrink-0 flex-col items-end gap-0.5 text-end">
          {trailing && (
            <span id={ids.trailing} className="body font-medium tabular-nums text-foreground">
              {trailing}
            </span>
          )}
          {trailingSecondary && (
            <span id={ids.trailingSecondary} className="caption text-muted-foreground">
              {trailingSecondary}
            </span>
          )}
        </span>
      )}
    </span>
  );

  const interactive =
    "block w-full text-start transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

  if (href) {
    return (
      <li data-slot="resource-item" className="relative transition-colors hover:bg-muted">
        {inner}
      </li>
    );
  }

  return (
    <li data-slot="resource-item">
      {onClick ? (
        <button
          type="button"
          // Ignore clicks inside portals (a Dialog or menu rendered in the row).
          onClick={(event) => {
            if (isOwnEvent(event)) onClick();
          }}
          className={interactive}
          aria-label={ariaLabel}
        >
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
