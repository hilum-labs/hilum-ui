import * as React from "react";
import { cn } from "../lib/utils";

interface SummaryTileGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

interface SummaryTileProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: React.ReactNode;
  description?: React.ReactNode;
}

const columnClassName: Record<NonNullable<SummaryTileGridProps["columns"]>, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 xl:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

function SummaryTileGrid({ columns = 3, className, ...props }: SummaryTileGridProps) {
  return (
    <div
      data-slot="summary-tile-grid"
      className={cn(
        "divide-y divide-border md:grid md:gap-3 md:divide-y-0",
        columnClassName[columns],
        className,
      )}
      {...props}
    />
  );
}

function SummaryTile({ title, value, description, className, ...props }: SummaryTileProps) {
  return (
    <div
      data-slot="summary-tile"
      className={cn(
        "min-w-0 py-4 md:rounded-lg md:border md:border-border md:bg-card md:p-4",
        className,
      )}
      {...props}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
      {description ? (
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

SummaryTileGrid.displayName = "SummaryTileGrid";
SummaryTile.displayName = "SummaryTile";

export { SummaryTile, SummaryTileGrid, type SummaryTileProps, type SummaryTileGridProps };
