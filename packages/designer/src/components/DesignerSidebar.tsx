import type { ComponentType, ReactNode } from "react";
import { cn, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@hilum/ui";

interface SidebarItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  /** Caller-computed active flag. */
  active?: boolean;
  disabled?: boolean;
  badge?: ReactNode;
}

interface DesignerSidebarProps {
  /** Top group of icon buttons. */
  items: SidebarItem[];
  /** Optional bottom group (settings, help, account). */
  bottomItems?: SidebarItem[];
  /** Layout variant. `rail` preserves the desktop vertical rail. */
  variant?: "rail" | "bottom";
  side?: "left" | "right";
  className?: string;
  children?: ReactNode;
}

/**
 * Vertical icon rail used as the primary tool / navigation column in an
 * editor. Driven by an `items` array — no engine coupling. Each item gets
 * a tooltip showing its label.
 */
function DesignerSidebar({
  items,
  bottomItems,
  variant = "rail",
  side = "left",
  className,
  children,
}: DesignerSidebarProps) {
  if (variant === "bottom") {
    const allItems = [...items, ...(bottomItems ?? [])];

    return (
      <nav
        aria-label="Editor tools"
        className={cn(
          "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40",
          "rounded-xl border border-border bg-card p-1 shadow-natural",
          className,
        )}
      >
        <TooltipProvider>
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto overscroll-x-contain">
            {allItems.map((item) => (
              <SidebarButton key={item.id} item={item} tooltipSide="top" touchTarget />
            ))}
          </div>
          {children}
        </TooltipProvider>
      </nav>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col w-12 bg-card shrink-0",
        side === "left" ? "border-r" : "border-l",
        "border-border",
        className,
      )}
    >
      <TooltipProvider>
        <div className="flex flex-col items-center gap-0.5 p-1.5">
          {items.map((item) => (
            <SidebarButton key={item.id} item={item} tooltipSide={side === "left" ? "right" : "left"} />
          ))}
        </div>

        {children}

        {bottomItems && bottomItems.length > 0 && (
          <div className="mt-auto flex flex-col items-center gap-0.5 p-1.5">
            {bottomItems.map((item) => (
              <SidebarButton key={item.id} item={item} tooltipSide={side === "left" ? "right" : "left"} />
            ))}
          </div>
        )}
      </TooltipProvider>
    </aside>
  );
}

function SidebarButton({
  item,
  tooltipSide,
  touchTarget = false,
}: {
  item: SidebarItem;
  tooltipSide: "top" | "right" | "left";
  touchTarget?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={item.onClick}
          disabled={item.disabled}
          aria-label={item.label}
          aria-pressed={item.active}
          className={cn(
            "relative flex size-9 items-center justify-center rounded-md transition-[background-color,color,opacity,scale] active:scale-[0.96]",
            "[@media(pointer:coarse)]:size-11",
            touchTarget && "size-11 shrink-0",
            item.active
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            item.disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <Icon size={touchTarget ? 18 : 16} />
          {item.badge != null && (
            <span className="absolute -top-0.5 -right-0.5 caption-xs">{item.badge}</span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{item.label}</TooltipContent>
    </Tooltip>
  );
}

export { DesignerSidebar };
export type { DesignerSidebarProps, SidebarItem };
