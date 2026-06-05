import type { ReactNode } from "react";
import { cn } from "@hilum/ui";

interface DesignerPanelProps {
  side: "left" | "right";
  /** Width in pixels. Default: 240. */
  width?: number;
  /** Add a separator border on the inner edge. Default: true. */
  bordered?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Left or right side panel of an editor — typically holds layer lists,
 * inspector / properties, history, comments, etc. Static-width for v1.
 * (Resize handles arrive in a later iteration if needed.)
 */
function DesignerPanel({
  side,
  width = 240,
  bordered = true,
  className,
  children,
}: DesignerPanelProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-card shrink-0 overflow-hidden",
        bordered && (side === "left" ? "border-r" : "border-l"),
        bordered && "border-border",
        className,
      )}
      style={{ width }}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">{children}</div>
    </aside>
  );
}

export { DesignerPanel };
export type { DesignerPanelProps };
