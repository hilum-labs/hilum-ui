import * as React from "react";
import { cn } from "../lib/utils";

/* ------------------------------------------------------------------ */
/*  Generic grid container                                              */
/* ------------------------------------------------------------------ */

interface GridListProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const colMap = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const gapMap = {
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
};

function GridList({ children, columns = 3, gap = "md", className }: GridListProps) {
  return (
    <ul role="list" className={cn("grid", colMap[columns], gapMap[gap], className)}>
      {children}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Simple card item                                                   */
/* ------------------------------------------------------------------ */

interface GridListCardProps {
  title: string;
  description?: string;
  meta?: string;
  href?: string;
  accent?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}

function GridListCard({
  title,
  description,
  meta,
  href,
  accent,
  trailing,
  className,
}: GridListCardProps) {
  const inner = (
    <div className={cn("flex h-full flex-col gap-1 rounded-xl border border-taupe-100 bg-white p-4 shadow-natural transition-shadow", href && "hover:shadow-elevated", className)}>
      {accent && <div className="mb-2">{accent}</div>}
      <p className="body font-semibold text-taupe-900">{title}</p>
      {description && <p className="caption text-taupe-400">{description}</p>}
      {(meta || trailing) && (
        <div className="mt-auto flex items-center justify-between pt-3">
          {meta && <span className="caption text-taupe-400">{meta}</span>}
          {trailing && <span className="caption text-taupe-400">{trailing}</span>}
        </div>
      )}
    </div>
  );

  return (
    <li>
      {href ? (
        <a href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taupe-400/40 rounded-xl">
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Horizontal accent card (colored left strip + title + meta)         */
/* ------------------------------------------------------------------ */

interface GridListAccentCardProps {
  title: string;
  meta?: string;
  href?: string;
  accentClass?: string;
  initials?: string;
  trailing?: React.ReactNode;
  className?: string;
}

function GridListAccentCard({
  title,
  meta,
  href,
  accentClass = "bg-taupe-900",
  initials,
  trailing,
  className,
}: GridListAccentCardProps) {
  const inner = (
    <div className={cn("flex overflow-hidden rounded-xl border border-taupe-100 bg-white shadow-natural transition-shadow", href && "hover:shadow-elevated", className)}>
      <div className={cn("flex w-14 shrink-0 items-center justify-center body font-semibold text-white", accentClass)}>
        {initials}
      </div>
      <div className="flex flex-1 items-center justify-between truncate border-l border-taupe-100 px-4 py-3">
        <div className="min-w-0">
          <p className="body font-semibold text-taupe-900 truncate">{title}</p>
          {meta && <p className="caption text-taupe-400">{meta}</p>}
        </div>
        {trailing && <div className="shrink-0 pl-2">{trailing}</div>}
      </div>
    </div>
  );

  return (
    <li>
      {href ? (
        <a href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taupe-400/40 rounded-xl">
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}

export { GridList, GridListCard, GridListAccentCard };
