import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/utils";
import { Button, buttonVariants } from "./button";
import { formatNumber, pluralize, useFormatter } from "../lib/format";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = React.ComponentProps<"a"> & { isActive?: boolean };

const PaginationLink = ({ className, isActive, children, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
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

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("gap-1 px-3 w-auto", className)}
    {...props}
  >
    <ChevronLeft size={14} />
    <span className="body">Prev</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn("gap-1 px-3 w-auto", className)}
    {...props}
  >
    <span className="body">Next</span>
    <ChevronRight size={14} />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex size-9 items-center justify-center text-muted-foreground", className)}
    {...props}
  >
    <MoreHorizontal size={14} />
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

/* ─────────────────────── PaginationBar ─────────────────────── */

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
  previousLabel?: string;
  nextLabel?: string;
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
  previousLabel = "Previous",
  nextLabel = "Next",
  className,
}: PaginationBarProps) {
  const fmt = useFormatter();
  const locale = fmt.locale ? { locale: fmt.locale } : {};
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = total !== undefined ? Math.min(page * pageSize, total) : page * pageSize;
  const canNext = total !== undefined ? page * pageSize < total : Boolean(hasNextPage);
  const noun = pluralize(total ?? end, itemLabel, {
    ...locale,
    hideCount: true,
    ...(itemLabelPlural ? { plural: itemLabelPlural } : {}),
  });
  const summary =
    total !== undefined
      ? `Showing ${formatNumber(start, locale)}–${formatNumber(end, locale)} of ${formatNumber(total, locale)} ${noun}`
      : `Showing ${formatNumber(start, locale)}–${formatNumber(end, locale)} ${noun}`;

  return (
    <nav
      aria-label="Pagination"
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
          aria-label="Go to previous page"
        >
          <ChevronLeft size={14} aria-hidden="true" />
          <span className="max-sm:sr-only">{previousLabel}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Go to next page"
        >
          <span className="max-sm:sr-only">{nextLabel}</span>
          <ChevronRight size={14} aria-hidden="true" />
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
export type { PaginationBarProps };
