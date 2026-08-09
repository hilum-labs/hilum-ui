import type { CSSProperties, ReactNode } from "react";
import { cn, Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@hilum/ui";
import {
  getDesignerFloatingMaxHeight,
  resolveDesignerWorkspaceInsets,
  type DesignerWorkspaceInsetsInput,
} from "./designer-workspace-insets";

interface DesignerPanelProps {
  side: "left" | "right";
  /** Presentation mode. `inline` preserves the desktop side-panel behavior. */
  variant?: "inline" | "floating" | "sheet";
  /** Width in pixels. Default: 240. */
  width?: number;
  /** Add a separator border on the inner edge. Default: true. */
  bordered?: boolean;
  /** Insets used to position a floating panel within DesignerWorkspace. Default: 16px. */
  floatingInset?: DesignerWorkspaceInsetsInput;
  /** Controlled open state when `variant="sheet"`. */
  open?: boolean;
  /** Controlled open-state handler when `variant="sheet"`. */
  onOpenChange?: (open: boolean) => void;
  /** Accessible sheet title when `variant="sheet"`. */
  sheetTitle?: ReactNode;
  /** Optional sheet description. */
  sheetDescription?: ReactNode;
  /** Sheet edge. Defaults to `bottom` for mobile editor panels. */
  sheetSide?: "left" | "right" | "top" | "bottom";
  sheetClassName?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Left or right side panel of an editor — typically holds layer lists,
 * inspector / properties, history, comments, etc. Static-width for v1.
 * (Resize handles arrive in a later iteration if needed.)
 */
function DesignerPanel({
  side,
  variant = "inline",
  width = 240,
  bordered = true,
  floatingInset,
  open,
  onOpenChange,
  sheetTitle,
  sheetDescription,
  sheetSide = "bottom",
  sheetClassName,
  className,
  style,
  children,
}: DesignerPanelProps) {
  if (variant === "sheet") {
    const sheetProps = {
      ...(open !== undefined ? { open } : {}),
      ...(onOpenChange ? { onOpenChange } : {}),
    };
    const resolvedSheetDescription = sheetDescription ?? "Editor panel controls";

    return (
      <Sheet {...sheetProps}>
        <SheetContent
          side={sheetSide}
          className={cn(
            "flex max-h-[min(86svh,44rem)] flex-col overflow-hidden p-0",
            sheetSide === "bottom" && "rounded-t-2xl",
            sheetClassName,
          )}
        >
          <SheetHeader
            className={cn(sheetTitle ? "mb-0 border-b border-border px-4 py-3" : "sr-only")}
          >
            <SheetTitle>{sheetTitle ?? `${side} panel`}</SheetTitle>
            <SheetDescription className={sheetDescription ? undefined : "sr-only"}>
              {resolvedSheetDescription}
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const floatingInsets = resolveDesignerWorkspaceInsets(floatingInset, 16);
  const floatingStyle: CSSProperties | undefined =
    variant === "floating"
      ? {
          top: floatingInsets.top,
          [side]: floatingInsets[side],
          width,
          height: "fit-content",
          maxHeight: getDesignerFloatingMaxHeight(floatingInsets),
          maxWidth: "calc(100% - 2rem)",
          ...style,
        }
      : { width, maxWidth: "100%", ...style };

  return (
    <aside
      data-side={side}
      data-variant={variant}
      className={cn(
        "flex min-w-0 max-w-full shrink-0 flex-col overflow-hidden bg-card",
        variant === "inline" && bordered && (side === "left" ? "border-r" : "border-l"),
        variant === "inline" && bordered && "border-border",
        variant === "floating" && [
          "absolute z-20 rounded-lg shadow-natural",
          "[interpolate-size:allow-keywords] transition-[height,max-height,opacity,transform,box-shadow] duration-200 ease-out motion-reduce:transition-none",
        ],
        className,
      )}
      style={floatingStyle}
    >
      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </aside>
  );
}

export { DesignerPanel };
export type { DesignerPanelProps };
