import * as React from "react";
import { TrendingUp, TrendingDown, Minus, Plus } from "lucide-react";
import { cn } from "../lib/utils";
import { Skeleton } from "./skeleton";

type StatTrendTone = "positive" | "negative" | "neutral";

interface StatCardTrend {
  value: string;
  direction: "up" | "down" | "neutral";
  /**
   * Whether the change is good or bad. Defaults to up → positive,
   * down → negative. Set explicitly for metrics where "up" is bad
   * (refunds, churn, response time).
   */
  tone?: StatTrendTone;
  /** Screen-reader / caption context, e.g. "vs last 30 days". */
  label?: string;
}

interface StatCardProps {
  label?: string;
  title?: string;
  value?: React.ReactNode;
  /**
   * `default` — bordered card. `responsive` — flat on mobile, card from `sm`.
   * `plain` — no surface; use inside an existing Card or a divided StatGrid.
   */
  variant?: "default" | "responsive" | "plain";
  trend?: StatCardTrend;
  /** Secondary line under the value (e.g. "32 orders", "Last 30 days"). */
  description?: React.ReactNode;
  /** Render skeletons for the value and trend. */
  loading?: boolean;
  /** Make the whole card a link (e.g. drill into the orders list). */
  href?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  actionButtons?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  valueClassName?: string;
}

interface StatCardGridProps {
  children: React.ReactNode;
  /**
   * Column count at the widest breakpoint. Always 2 columns on mobile (1 for
   * `columns={1}`), stepping up through `sm`/`lg`. Default: 6-slot dashboard grid.
   */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  maxSlots?: number;
  onAddCard?: () => void;
  className?: string;
  showEmptySlots?: boolean;
}

interface StatCardSlotProps {
  onAddCard?: () => void;
  className?: string;
  label?: string;
}

function StatCard({
  label,
  title,
  value,
  variant = "default",
  trend,
  description,
  loading = false,
  href,
  icon,
  children,
  actionButtons,
  className,
  containerClassName,
  titleClassName,
  valueClassName,
}: StatCardProps) {
  const displayLabel = title ?? label;
  const trendTone: StatTrendTone | undefined = trend
    ? (trend.tone ??
      (trend.direction === "up" ? "positive" : trend.direction === "down" ? "negative" : "neutral"))
    : undefined;

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };
  const surfaceClass =
    variant === "plain"
      ? "min-w-0 p-4 sm:p-5"
      : variant === "responsive"
        ? "min-w-0 border-border bg-transparent p-4 sm:rounded-xl sm:border sm:bg-card sm:p-5 sm:shadow-natural"
        : "min-w-0 rounded-xl border border-border bg-card p-4 shadow-natural sm:p-5";

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        {displayLabel && (
          <p className={cn("label min-w-0 text-muted-foreground", titleClassName)}>
            {displayLabel}
          </p>
        )}
        {icon && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
        )}
        {actionButtons && <div className="flex shrink-0 items-center gap-2">{actionButtons}</div>}
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-7 w-24" />
      ) : value !== undefined ? (
        <p className={cn("heading-xl mt-2 truncate tabular-nums text-foreground", valueClassName)}>
          {value}
        </p>
      ) : children ? (
        <div className="mt-2">{children}</div>
      ) : null}
      {(description || (trend && !loading)) && (
        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {trend &&
            !loading &&
            (() => {
              const Icon = TrendIcon[trend.direction];
              return (
                <span
                  data-tone={trendTone}
                  className={cn(
                    "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5",
                    trendTone === "positive" && "bg-success/40 text-foreground",
                    trendTone === "negative" && "bg-destructive/10 text-destructive",
                    trendTone === "neutral" && "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon size={12} aria-hidden="true" />
                  <span className="caption tabular-nums font-medium">{trend.value}</span>
                  {trend.label && <span className="sr-only">{trend.label}</span>}
                </span>
              );
            })()}
          {description && (
            <span className="caption min-w-0 truncate text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </>
  );

  const classes = cn(surfaceClass, containerClassName, className);

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          classes,
          "block transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        data-slot="stat-card"
      >
        {body}
      </a>
    );
  }

  return (
    <div className={classes} data-slot="stat-card" aria-busy={loading || undefined}>
      {body}
    </div>
  );
}

StatCard.displayName = "StatCard";

function StatCardSlot({ onAddCard, className, label = "Add card" }: StatCardSlotProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-28 w-full min-w-0 items-center justify-center rounded-xl border border-dashed border-border bg-card p-4 text-muted-foreground shadow-natural",
        "transition-[background-color,border-color,color,scale] duration-150 hover:border-ground-300 hover:bg-muted hover:text-foreground active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      onClick={onAddCard}
    >
      <span className="flex flex-col items-center gap-1.5">
        <Plus className="size-4" aria-hidden="true" />
        <span className="caption font-medium">{label}</span>
      </span>
    </button>
  );
}

StatCardSlot.displayName = "StatCardSlot";

const GRID_COLUMNS: Record<NonNullable<StatCardGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
};

function StatCardGrid({
  children,
  columns = 6,
  maxSlots = 6,
  onAddCard,
  className,
  showEmptySlots = false,
}: StatCardGridProps) {
  const childrenArray = React.Children.toArray(children);
  const emptySlots = showEmptySlots ? Math.max(0, maxSlots - childrenArray.length) : 0;

  return (
    <div
      className={cn(
        "grid min-w-0 items-stretch gap-2 sm:gap-3 [&>*>[data-slot=stat-card]]:h-full",
        GRID_COLUMNS[columns],
        className,
      )}
      data-slot="stat-card-grid"
    >
      {childrenArray.map((child, index) => (
        <div key={`filled-${index}`} className="min-w-0">
          {child}
        </div>
      ))}
      {Array.from({ length: emptySlots }, (_, index) => (
        <div key={`empty-${index}`} className="min-w-0">
          <StatCardSlot {...(onAddCard ? { onAddCard } : {})} />
        </div>
      ))}
    </div>
  );
}

StatCardGrid.displayName = "StatCardGrid";

/** Alias — `StatGrid` reads better next to `StatCard` in new code. */
const StatGrid = StatCardGrid;

export {
  StatCard,
  StatCardGrid,
  StatCardSlot,
  StatGrid,
  type StatCardProps,
  type StatCardTrend,
  type StatTrendTone,
  type StatCardGridProps,
  type StatCardSlotProps,
};
