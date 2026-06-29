import * as React from "react";
import { TrendingUp, TrendingDown, Minus, Plus } from "lucide-react";
import { cn } from "../lib/utils";

interface StatCardProps {
  label?: string;
  title?: string;
  value?: string | number;
  variant?: "default" | "responsive";
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
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
  icon,
  children,
  actionButtons,
  className,
  containerClassName,
  titleClassName,
  valueClassName,
}: StatCardProps) {
  const displayLabel = title ?? label;
  const trendColor = {
    up: "text-muted-foreground bg-brand-secondary/30 rounded-full px-2 py-0.5 w-fit",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };
  const surfaceClass =
    variant === "responsive"
      ? "min-w-0 border-border bg-transparent p-4 sm:rounded-xl sm:border sm:bg-card sm:p-5 sm:shadow-natural"
      : "min-w-0 rounded-xl border border-border bg-card p-4 shadow-natural sm:p-5";

  return (
    <div
      className={cn(
        surfaceClass,
        containerClassName,
        className,
      )}
      data-slot="stat-card"
    >
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
      {value !== undefined ? (
        <p className={cn("heading-xl mt-2 tabular-nums text-foreground", valueClassName)}>
          {value}
        </p>
      ) : children ? (
        <div className="mt-2">{children}</div>
      ) : null}
      {trend &&
        (() => {
          const Icon = TrendIcon[trend.direction];
          return (
            <div className={cn("mt-2 flex items-center gap-1", trendColor[trend.direction])}>
              <Icon size={12} />
              <span className="caption tabular-nums font-medium">{trend.value}</span>
            </div>
          );
        })()}
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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
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

function StatCardGrid({
  children,
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
        "grid min-w-0 grid-cols-2 items-stretch gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
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

export {
  StatCard,
  StatCardGrid,
  StatCardSlot,
  type StatCardProps,
  type StatCardGridProps,
  type StatCardSlotProps,
};
