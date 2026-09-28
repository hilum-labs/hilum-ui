import * as React from "react";
import { cn } from "../lib/utils";
import { Skeleton } from "./skeleton";

/* ─────────────────────── Primitives ─────────────────────── */

interface SkeletonBodyTextProps extends React.ComponentProps<"div"> {
  /** Number of lines. Default 3; the last line is shorter. */
  lines?: number;
}

/** Placeholder for a paragraph. */
function SkeletonBodyText({ lines = 3, className, ...props }: SkeletonBodyTextProps) {
  return (
    <div
      data-slot="skeleton-body-text"
      aria-hidden="true"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3", index === lines - 1 && lines > 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}
SkeletonBodyText.displayName = "SkeletonBodyText";

interface SkeletonDisplayTextProps extends React.ComponentProps<"div"> {
  /** Matches heading sizes. Default "md". */
  size?: "sm" | "md" | "lg";
}

const displaySizes = { sm: "h-4 w-40", md: "h-6 w-56", lg: "h-8 w-72" } as const;

/** Placeholder for a heading / page title. */
function SkeletonDisplayText({ size = "md", className, ...props }: SkeletonDisplayTextProps) {
  return (
    <Skeleton
      data-slot="skeleton-display-text"
      aria-hidden="true"
      className={cn("max-w-full", displaySizes[size], className)}
      {...props}
    />
  );
}
SkeletonDisplayText.displayName = "SkeletonDisplayText";

interface SkeletonThumbnailProps extends React.ComponentProps<"div"> {
  /** Default "md" (40px). */
  size?: "xs" | "sm" | "md" | "lg";
}

const thumbnailSizes = { xs: "size-6", sm: "size-8", md: "size-10", lg: "size-20" } as const;

/** Placeholder for an avatar / product image. */
function SkeletonThumbnail({ size = "md", className, ...props }: SkeletonThumbnailProps) {
  return (
    <Skeleton
      data-slot="skeleton-thumbnail"
      aria-hidden="true"
      className={cn("shrink-0 rounded-lg", thumbnailSizes[size], className)}
      {...props}
    />
  );
}
SkeletonThumbnail.displayName = "SkeletonThumbnail";

/* ─────────────────────── SkeletonPage ─────────────────────── */

interface SkeletonPageProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Real title if already known; otherwise a skeleton title is shown. */
  title?: React.ReactNode;
  /** Show a back-link placeholder above the title. */
  backAction?: boolean;
  /** Show primary-action placeholder on the inline-end side of the header. */
  primaryAction?: boolean;
  /** Narrow, centered page (settings forms). */
  narrowWidth?: boolean;
  /** Full width instead of the default max width. */
  fullWidth?: boolean;
  /** Announced to assistive tech. Default "Loading page". */
  label?: string;
  /** Page body — defaults to a primary/secondary skeleton layout. */
  children?: React.ReactNode;
}

function DefaultSkeletonBody() {
  const card = (lines: number, key: number) => (
    <div key={key} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <SkeletonDisplayText size="sm" />
      <SkeletonBodyText lines={lines} />
    </div>
  );
  return (
    <div className="flex flex-wrap items-start gap-4 md:gap-5">
      <div className="flex min-w-0 flex-[2_2_30rem] flex-col gap-4 md:gap-5">
        {[card(3, 0), card(5, 1)]}
      </div>
      <div className="flex min-w-0 flex-[1_1_15rem] flex-col gap-4 md:gap-5">
        {[card(2, 0), card(3, 1)]}
      </div>
    </div>
  );
}

/**
 * Loading state for a whole admin page: header placeholders plus a
 * primary/secondary card layout (or your own skeleton body). Marked
 * `aria-busy` with a polite "Loading page" status.
 */
function SkeletonPage({
  title,
  backAction = false,
  primaryAction = false,
  narrowWidth = false,
  fullWidth = false,
  label = "Loading page",
  className,
  children,
  ...props
}: SkeletonPageProps) {
  return (
    <div
      data-slot="skeleton-page"
      aria-busy="true"
      className={cn(
        "mx-auto flex w-full flex-col gap-6",
        !fullWidth && (narrowWidth ? "max-w-2xl" : "max-w-6xl"),
        className,
      )}
      {...props}
    >
      <span className="sr-only" role="status">
        {label}
      </span>
      <div className="flex min-w-0 items-center gap-3">
        {backAction && <Skeleton aria-hidden="true" className="size-8 shrink-0 rounded-md" />}
        <div className="min-w-0 flex-1">
          {title ? (
            <h1 className="display truncate text-foreground">{title}</h1>
          ) : (
            <SkeletonDisplayText size="lg" />
          )}
        </div>
        {primaryAction && <Skeleton aria-hidden="true" className="ms-auto h-8 w-28 rounded-md" />}
      </div>
      {children ?? <DefaultSkeletonBody />}
    </div>
  );
}
SkeletonPage.displayName = "SkeletonPage";

export { SkeletonPage, SkeletonBodyText, SkeletonDisplayText, SkeletonThumbnail };
export type {
  SkeletonPageProps,
  SkeletonBodyTextProps,
  SkeletonDisplayTextProps,
  SkeletonThumbnailProps,
};
