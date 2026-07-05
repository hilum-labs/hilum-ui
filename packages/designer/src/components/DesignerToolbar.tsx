import type { ComponentType, ReactNode } from "react";
import { cn, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@hilum/ui";

/* ============================================================== *
 *  Toolbar — outer container                                       *
 * ============================================================== */

interface DesignerToolbarProps {
  className?: string;
  /** Position. Default: 'floating' (centered, floating above content). */
  variant?: "floating" | "inline" | "dock";
  children: ReactNode;
}

function DesignerToolbar({ className, variant = "floating", children }: DesignerToolbarProps) {
  return (
    <TooltipProvider>
      <div
        role="toolbar"
        className={cn(
          "flex items-center gap-0.5 rounded-lg bg-card p-1 shadow-natural",
          variant === "floating" && "fixed bottom-4 left-1/2 -translate-x-1/2 z-30",
          variant === "dock" &&
            [
              "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30",
              "overflow-x-auto overscroll-x-contain rounded-xl",
            ],
          className,
        )}
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
  return <div className={cn("mx-1 h-5 w-px bg-muted", className)} role="separator" />;
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
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          aria-pressed={active}
          className={cn(
            "flex h-9 min-w-9 items-center justify-center gap-1 rounded-md px-2 caption transition-[background-color,color,opacity,scale] active:scale-[0.96]",
            "[@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:min-w-11",
            size === "touch" && "h-11 min-w-11",
            active
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
        >
          {Icon && <Icon size={16} />}
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span>{label}</span>
        {shortcut && <span className="ml-2 caption-xs text-muted-foreground">{shortcut}</span>}
      </TooltipContent>
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
