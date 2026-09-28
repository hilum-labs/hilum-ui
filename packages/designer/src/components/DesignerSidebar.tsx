import type { ComponentType, CSSProperties, ReactNode } from "react";
import { cn, Tooltip, TooltipProvider } from "@hilum/ui";
import {
  getDesignerFloatingMaxHeight,
  resolveDesignerWorkspaceInsets,
  type DesignerWorkspaceInsetsInput,
} from "./designer-workspace-insets";

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
  /** Layout variant. `rail` preserves the inline desktop vertical rail. */
  variant?: "rail" | "floating" | "bottom";
  side?: "left" | "right";
  /** Insets used to position a floating rail within DesignerWorkspace. Default: 16px. */
  floatingInset?: DesignerWorkspaceInsetsInput;
  className?: string;
  style?: CSSProperties;
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
  floatingInset,
  className,
  style,
  children,
}: DesignerSidebarProps) {
  if (variant === "bottom") {
    const allItems = [...items, ...(bottomItems ?? [])];

    return (
      <nav
        aria-label="Editor tools"
        className={cn(
          "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40",
          "rounded-xl border border-border bg-card p-1 shadow-surface-3",
          className,
        )}
        style={style}
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

  const content = (
    <TooltipProvider>
      <div
        data-designer-sidebar-items
        className={cn(
          "flex min-h-0 flex-col items-center gap-0.5 overflow-y-auto overscroll-contain p-1.5",
          variant === "floating" ? "flex-initial" : "flex-1",
        )}
      >
        {items.map((item) => (
          <SidebarButton
            key={item.id}
            item={item}
            tooltipSide={side === "left" ? "right" : "left"}
          />
        ))}
      </div>

      {children}

      {bottomItems && bottomItems.length > 0 && (
        <div className="flex shrink-0 flex-col items-center gap-0.5 p-1.5">
          {bottomItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              tooltipSide={side === "left" ? "right" : "left"}
            />
          ))}
        </div>
      )}
    </TooltipProvider>
  );

  if (variant === "floating") {
    const insets = resolveDesignerWorkspaceInsets(floatingInset, 16);

    return (
      <nav
        aria-label="Editor tools"
        data-side={side}
        data-variant={variant}
        className={cn(
          "absolute z-30 flex w-12 flex-col overflow-hidden rounded-lg bg-card shadow-surface-3 compact:w-11",
          "[interpolate-size:allow-keywords] transition-[height,max-height,opacity,transform,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          className,
        )}
        style={{
          top: insets.top,
          [side]: insets[side],
          height: "fit-content",
          maxHeight: getDesignerFloatingMaxHeight(insets),
          ...style,
        }}
      >
        {content}
      </nav>
    );
  }

  return (
    <aside
      data-side={side}
      data-variant={variant}
      className={cn(
        "flex flex-col w-12 bg-card shrink-0",
        side === "left" ? "border-r" : "border-l",
        "border-border",
        className,
      )}
      style={style}
    >
      {content}
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
    <Tooltip
      content={<span className="block whitespace-nowrap">{item.label}</span>}
      side={tooltipSide}
      sideOffset={10}
      delayDuration={120}
      className="max-w-56 rounded-lg bg-foreground px-2.5 py-1.5 text-[12px] font-medium leading-none tracking-[0.01em] text-background shadow-natural"
    >
      <button
        type="button"
        onClick={item.onClick}
        disabled={item.disabled}
        aria-label={item.label}
        aria-pressed={item.active}
        className={cn(
          "relative flex size-9 items-center justify-center rounded-md transition-[background-color,color,opacity,scale] active:scale-[0.96]",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "compact:size-8 compact:rounded-[6px]",
          "[@media(pointer:coarse)]:size-11",
          touchTarget && "size-11 shrink-0",
          item.active
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-hover hover:text-foreground active:bg-active",
          item.disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <Icon size={touchTarget ? 18 : 16} />
        {item.badge != null && (
          <span className="absolute -top-0.5 -right-0.5 caption-xs">{item.badge}</span>
        )}
      </button>
    </Tooltip>
  );
}

export { DesignerSidebar };
export type { DesignerSidebarProps, SidebarItem };
