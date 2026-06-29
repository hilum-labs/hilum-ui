"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface MediaAssetGridProps extends React.HTMLAttributes<HTMLUListElement> {
  columns?: 2 | 3 | 4 | 5;
  children: React.ReactNode;
}

const columnClasses: Record<NonNullable<MediaAssetGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 md:grid-cols-3",
  4: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
};

function MediaAssetGrid({ children, columns = 5, className, ...props }: MediaAssetGridProps) {
  return (
    <ul
      role="list"
      className={cn(
        "divide-y divide-border border-y border-border",
        "sm:grid sm:gap-4 sm:divide-y-0 sm:border-y-0",
        columnClasses[columns],
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

function MediaAssetGridItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("min-w-0", className)} {...props} />;
}

MediaAssetGrid.displayName = "MediaAssetGrid";
MediaAssetGridItem.displayName = "MediaAssetGridItem";

export { MediaAssetGrid, MediaAssetGridItem };
export type { MediaAssetGridProps };
