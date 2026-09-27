import type { CSSProperties, ReactNode } from "react";
import { cn } from "@hilum/ui";

interface DetailScreenProps {
  /** Main content (left/primary column). */
  children: ReactNode;
  /**
   * Full-width header above both columns — typically
   * `<PageHeader back={{ href: "/orders", label: "Orders" }} title="#1042" badges={…} actions={…} />`.
   */
  header?: ReactNode;
  /** Metadata sidebar content (right column). */
  meta?: ReactNode;
  /** Width of the meta column. Default: 320px. */
  metaWidth?: number | string;
  /** Stack vertically below this breakpoint. Default: lg (1024px). */
  breakpoint?: "md" | "lg" | "xl";
  className?: string;
}

/**
 * Two-column detail layout — main content on the left, metadata sidebar on
 * the right. Stacks vertically below the breakpoint for mobile.
 */
function DetailScreen({
  children,
  header,
  meta,
  metaWidth = 320,
  breakpoint = "lg",
  className,
}: DetailScreenProps) {
  const rowClass =
    breakpoint === "md" ? "md:flex-row" : breakpoint === "xl" ? "xl:flex-row" : "lg:flex-row";
  // Full width while stacked; fixed meta column once side-by-side.
  const asideWidthClass =
    breakpoint === "md"
      ? "md:w-(--detail-meta-width)"
      : breakpoint === "xl"
        ? "xl:w-(--detail-meta-width)"
        : "lg:w-(--detail-meta-width)";
  const metaWidthValue = typeof metaWidth === "number" ? `${metaWidth}px` : metaWidth;

  return (
    <div className={cn("flex flex-col gap-6 p-4 sm:p-6", className)} data-slot="detail-screen">
      {header}
      <div className={cn("flex min-w-0 flex-col gap-6", rowClass)}>
        <div className="min-w-0 flex-1">{children}</div>
        {meta && (
          <aside
            className={cn("w-full min-w-0 shrink-0", asideWidthClass)}
            style={{ "--detail-meta-width": metaWidthValue } as CSSProperties}
          >
            {meta}
          </aside>
        )}
      </div>
    </div>
  );
}

export { DetailScreen };
export type { DetailScreenProps };
