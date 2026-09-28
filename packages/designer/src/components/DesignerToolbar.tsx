import type { ComponentType, CSSProperties, ReactNode } from "react";
import { cn, Tooltip, TooltipProvider } from "@hilum/ui";

/* ============================================================== *
 *  Toolbar — outer container                                       *
 * ============================================================== */

interface DesignerToolbarProps {
  className?: string;
  /** Position. Default: 'floating' (centered, floating above content). */
  variant?: "floating" | "inline" | "dock";
  /**
   * Position floating chrome against the viewport or the nearest positioned
   * workspace ancestor. Default: 'viewport'.
   */
  boundary?: "viewport" | "workspace";
  /** Center against the full boundary or its configured workspace safe area. */
  center?: "boundary" | "safe-area";
  style?: CSSProperties;
  children: ReactNode;
}

function DesignerToolbar({
  className,
  variant = "floating",
  boundary = "viewport",
  center = "boundary",
  style,
  children,
}: DesignerToolbarProps) {
  const positioned = boundary === "workspace" ? "absolute" : "fixed";
  const safeAreaStyle: CSSProperties | undefined =
    variant === "floating" && boundary === "workspace" && center === "safe-area"
      ? {
          left: "calc(var(--designer-workspace-inset-left) + (100% - var(--designer-workspace-inset-left) - var(--designer-workspace-inset-right)) / 2)",
        }
      : undefined;

  return (
    <TooltipProvider>
      <div
        role="toolbar"
        className={cn(
          "flex items-center gap-0.5 rounded-lg bg-card p-1 shadow-surface-3",
          "transition-[opacity,transform,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          variant === "floating" && positioned,
          variant === "floating" && "bottom-4 -translate-x-1/2 z-30",
          variant === "floating" && center === "boundary" && "left-1/2",
          variant === "dock" && [
            positioned,
            "inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30",
            "overflow-x-auto overscroll-x-contain rounded-xl",
          ],
          className,
        )}
        style={{ ...safeAreaStyle, ...style }}
      >
        {children}
      </div>
    </TooltipProvider>
  );
}

/* ============================================================== *
 *  ToolbarGroup — visual group of buttons                          *
 * ============================================================== */

interface DesignerToolbarGroupProps {
  className?: string;
  children: ReactNode;
}

function DesignerToolbarGroup({ className, children }: DesignerToolbarGroupProps) {
  return <div className={cn("flex items-center gap-0.5", className)}>{children}</div>;
}

/* ============================================================== *
 *  ToolbarSeparator                                                *
 * ============================================================== */

interface DesignerToolbarSeparatorProps {
  className?: string;
}

function DesignerToolbarSeparator({ className }: DesignerToolbarSeparatorProps) {
  return (
    <div
      className={cn("mx-1 h-5 w-px bg-border compact:h-4", className)}
      role="separator"
      aria-orientation="vertical"
    />
  );
}

/* ============================================================== *
 *  ToolbarButton — single tool / action                            *
 * ============================================================== */

interface DesignerToolbarButtonProps {
  label: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  /** Optional keyboard shortcut shown in the tooltip (e.g. 'V', 'Cmd+Z'). */
  shortcut?: string;
  size?: "default" | "touch";
  className?: string;
  children?: ReactNode;
}

function DesignerToolbarButton({
  label,
  icon: Icon,
  onClick,
  active,
  disabled,
  shortcut,
  size = "default",
  className,
  children,
}: DesignerToolbarButtonProps) {
  return (
    <Tooltip
      content={
        <span className="flex items-center whitespace-nowrap">
          <span>{label}</span>
          {shortcut && <span className="ml-2 text-[11px] text-background/65">{shortcut}</span>}
        </span>
      }
      side="top"
      sideOffset={10}
      delayDuration={120}
      className="max-w-56 rounded-lg bg-foreground px-2.5 py-1.5 text-[12px] font-medium leading-none tracking-[0.01em] text-background shadow-natural"
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={active}
        className={cn(
          "flex h-9 min-w-9 items-center justify-center gap-1 rounded-md px-2 caption tabular-nums transition-[background-color,color,opacity,scale] active:scale-[0.96]",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "compact:h-8 compact:min-w-8 compact:rounded-[6px] compact:px-1.5 compact:text-[12px]",
          "[@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:min-w-11",
          size === "touch" && "h-11 min-w-11",
          active
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        {Icon && <Icon size={16} />}
        {children}
      </button>
    </Tooltip>
  );
}

export { DesignerToolbar, DesignerToolbarGroup, DesignerToolbarSeparator, DesignerToolbarButton };
export type {
  DesignerToolbarProps,
  DesignerToolbarGroupProps,
  DesignerToolbarSeparatorProps,
  DesignerToolbarButtonProps,
};
