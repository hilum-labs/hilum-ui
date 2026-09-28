import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/utils";
import { Button, buttonVariants } from "./button";
import { formatNumber, pluralize, useFormatter } from "../lib/format";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    data-slot="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}
PaginationContent.displayName = "PaginationContent";

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" className={cn("", className)} {...props} />;
}
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = React.ComponentProps<"a"> & { isActive?: boolean };

const PaginationLink = ({ className, isActive, children, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    data-slot="pagination-link"
    className={cn(
      buttonVariants({ variant: isActive ? "default" : "ghost", size: "icon" }),
      "size-9 rounded-md body",
      className,
    )}
    {...props}
  >
    {children}
  </a>
);
PaginationLink.displayName = "PaginationLink";

type PaginationStepProps = React.ComponentProps<typeof PaginationLink> & {
  /** Visible text. Default "Prev" / "Next". Override `aria-label` for the full name. */
  label?: React.ReactNode;
};

const PaginationPrevious = ({ className, label = "Prev", ...props }: PaginationStepProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    data-slot="pagination-previous"
    className={cn("gap-1 px-3 w-auto", className)}
    {...props}
  >
    <ChevronLeft size={14} className="rtl:-scale-x-100" aria-hidden="true" />
    <span className="body">{label}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, label = "Next", ...props }: PaginationStepProps) => (
  <PaginationLink
    aria-label="Go to next page"
    data-slot="pagination-next"
    className={cn("gap-1 px-3 w-auto", className)}
    {...props}
  >
    <span className="body">{label}</span>
    <ChevronRight size={14} className="rtl:-scale-x-100" aria-hidden="true" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  label,
  ...props
}: React.ComponentProps<"span"> & {
  /** Screen-reader text (e.g. "More pages"). Omit to hide the ellipsis from AT. */
  label?: string;
}) => (
  <span
    {...(label ? {} : { "aria-hidden": true })}
    data-slot="pagination-ellipsis"
    className={cn("flex size-9 items-center justify-center text-muted-foreground", className)}
    {...props}
  >
    <MoreHorizontal size={14} aria-hidden="true" />
    {label && <span className="sr-only">{label}</span>}
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

/* ─────────────────────── PaginationBar ─────────────────────── */

interface PaginationBarSummaryParts {
  /** Locale-formatted first item index on the page. */
  start: string;
  /** Locale-formatted last item index on the page. */
  end: string;
  /** Locale-formatted total, or undefined in cursor mode. */
  total: string | undefined;
  /** Pluralized noun ("orders"). */
  noun: string;
  /** Raw numbers, for languages that need them to pick a form. */
  counts: { start: number; end: number; total: number | undefined };
}

interface PaginationBarLabels {
  /** "Showing 21–40 of 124 orders" / "Showing 1–20 orders" in cursor mode. */
  summary: (parts: PaginationBarSummaryParts) => string;
  /** Visible Previous text. */
  previous: string;
  /** Visible Next text. */
  next: string;
  /** Accessible name of the Previous button. */
  previousPage: string;
  /** Accessible name of the Next button. */
  nextPage: string;
  /** Accessible name of the nav landmark. */
  navigation: string;
}

const PAGINATION_BAR_DEFAULT_LABELS: PaginationBarLabels = {
  summary: ({ start, end, total, noun }) =>
    total !== undefined
      ? `Showing ${start}–${end} of ${total} ${noun}`
      : `Showing ${start}–${end} ${noun}`,
  previous: "Previous",
  next: "Next",
  previousPage: "Go to previous page",
  nextPage: "Go to next page",
  navigation: "Pagination",
};

interface PaginationBarProps {
  /** 1-based current page. */
  page: number;
  pageSize: number;
  /** Total item count. Omit for cursor pagination (then pass `hasNextPage`). */
  total?: number;
  /** Cursor pagination: whether a next page exists when `total` is unknown. */
  hasNextPage?: boolean;
  onPageChange: (page: number) => void;
  /** Noun for the summary — "Showing 1–20 of 124 orders". Default: "result". */
  itemLabel?: string;
  /** Plural noun when it isn't `${itemLabel}s`. */
  itemLabelPlural?: string;
  /** @deprecated Use `labels.previous`. */
  previousLabel?: string;
  /** @deprecated Use `labels.next`. */
  nextLabel?: string;
  /** Localizable strings; unspecified keys fall back to English. */
  labels?: Partial<PaginationBarLabels>;
  /** BCP-47 locale for numbers and plurals. Defaults to FormatProvider. */
  locale?: string;
  className?: string;
}

/**
 * Compact list/table footer: "Showing 21–40 of 124 orders" plus Previous /
 * Next. Replaces hand-built Prev/Next rows; use Pagination* for numbered pages.
 */
function PaginationBar({
  page,
  pageSize,
  total,
  hasNextPage,
  onPageChange,
  itemLabel = "result",
  itemLabelPlural,
  previousLabel,
  nextLabel,
  labels: labelsProp,
  locale: localeProp,
  className,
}: PaginationBarProps) {
  const fmt = useFormatter();
  const resolvedLocale = localeProp ?? fmt.locale;
  const locale = resolvedLocale ? { locale: resolvedLocale } : {};
  const labels = {
    ...PAGINATION_BAR_DEFAULT_LABELS,
    ...(previousLabel !== undefined ? { previous: previousLabel } : {}),
    ...(nextLabel !== undefined ? { next: nextLabel } : {}),
    ...labelsProp,
  };
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = total !== undefined ? Math.min(page * pageSize, total) : page * pageSize;
  const canNext = total !== undefined ? page * pageSize < total : Boolean(hasNextPage);
  const noun = pluralize(total ?? end, itemLabel, {
    ...locale,
    hideCount: true,
    ...(itemLabelPlural ? { plural: itemLabelPlural } : {}),
  });
  const summary = labels.summary({
    start: formatNumber(start, locale),
    end: formatNumber(end, locale),
    total: total !== undefined ? formatNumber(total, locale) : undefined,
    noun,
    counts: { start, end, total },
  });

  return (
    <nav
      aria-label={labels.navigation}
      data-slot="pagination-bar"
      className={cn("flex min-w-0 items-center justify-between gap-3", className)}
    >
      <p className="caption min-w-0 truncate tabular-nums text-muted-foreground" aria-live="polite">
        {summary}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label={labels.previousPage}
        >
          <ChevronLeft size={14} className="rtl:-scale-x-100" aria-hidden="true" />
          <span className="max-sm:sr-only">{labels.previous}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label={labels.nextPage}
        >
          <span className="max-sm:sr-only">{labels.next}</span>
          <ChevronRight size={14} className="rtl:-scale-x-100" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
PaginationBar.displayName = "PaginationBar";

export {
  PaginationBar,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
export { PAGINATION_BAR_DEFAULT_LABELS };
export type {
  PaginationBarProps,
  PaginationBarLabels,
  PaginationBarSummaryParts,
  PaginationStepProps,
};
