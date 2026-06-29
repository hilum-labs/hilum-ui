import * as React from "react";
import { cn } from "../lib/utils";
import { StatusBadge, type StatusBadgeVariant } from "./status-badge";

interface StatusTileGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
}

interface StatusTileProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  status: string;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  labelMap?: Record<string, React.ReactNode>;
  variantMap?: Record<string, StatusBadgeVariant>;
  iconMap?: Record<string, React.ComponentType<{ className?: string }>>;
}

const columnClassName: Record<NonNullable<StatusTileGridProps["columns"]>, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 xl:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

function StatusTileGrid({ columns = 3, className, ...props }: StatusTileGridProps) {
  return (
    <div
      data-slot="status-tile-grid"
      className={cn(
        "divide-y divide-border md:grid md:gap-4 md:divide-y-0",
        columnClassName[columns],
        className,
      )}
      {...props}
    />
  );
}

function StatusTile({
  title,
  status,
  description,
  meta,
  icon: Icon,
  labelMap,
  variantMap,
  iconMap,
  className,
  ...props
}: StatusTileProps) {
  return (
    <div
      data-slot="status-tile"
      className={cn(
        "min-w-0 py-4 md:rounded-lg md:border md:border-border md:bg-background md:p-4 md:shadow-natural",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {Icon ? <Icon className="size-4 shrink-0 text-muted-foreground" /> : null}
          <h3 className="body min-w-0 truncate font-medium text-foreground">{title}</h3>
        </div>
        <StatusBadge
          status={status}
          {...(labelMap ? { labelMap } : {})}
          {...(variantMap ? { variantMap } : {})}
          {...(iconMap ? { iconMap } : {})}
          className="shrink-0"
        />
      </div>
      {description ? (
        <p className="body-sm mt-3 text-muted-foreground">{description}</p>
      ) : null}
      {meta ? <div className="mt-3 min-w-0 text-muted-foreground">{meta}</div> : null}
    </div>
  );
}

StatusTileGrid.displayName = "StatusTileGrid";
StatusTile.displayName = "StatusTile";

export { StatusTile, StatusTileGrid, type StatusTileProps, type StatusTileGridProps };
