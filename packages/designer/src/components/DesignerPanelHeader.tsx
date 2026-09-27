import type { ReactNode } from "react";
import { cn, TabsSubtle, TabsSubtleItem, type IconComponent } from "@hilum/ui";

/* ============================================================== *
 *  DesignerPanelHeader — title row + optional tabs/search row      *
 * ============================================================== */

interface DesignerPanelHeaderProps {
  /** Panel title ("Sections", "Theme settings"). */
  title?: ReactNode;
  /** Muted line under the title (template name, selection summary). */
  description?: ReactNode;
  /** Trailing icon buttons (DesignerToolbarButton / Button size="icon-sm"). */
  actions?: ReactNode;
  /** Second row — DesignerPanelTabs, a SearchInput, or filters. */
  children?: ReactNode;
  /** Stick to the top of the panel's scroll area. Default: true. */
  sticky?: boolean;
  className?: string;
}

/**
 * Header for a DesignerPanel: a title/actions row plus an optional second row
 * for tabs or search. Replaces hand-built panel headers with arbitrary sizes.
 */
function DesignerPanelHeader({
  title,
  description,
  actions,
  children,
  sticky = true,
  className,
}: DesignerPanelHeaderProps) {
  return (
    <div
      data-slot="designer-panel-header"
      className={cn(
        "flex min-w-0 shrink-0 flex-col gap-2 border-b border-border bg-card px-3 py-2.5",
        sticky && "sticky top-0 z-10",
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex min-w-0 items-center gap-2">
          <div className="min-w-0 flex-1">
            {title && (
              <div className="body-sm truncate font-semibold text-foreground">{title}</div>
            )}
            {description && (
              <div className="caption-sm truncate text-muted-foreground">{description}</div>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ============================================================== *
 *  DesignerPanelTabs — value-based, overflow-safe panel tabs       *
 * ============================================================== */

interface DesignerPanelTab<V extends string = string> {
  value: V;
  label: string;
  icon?: IconComponent;
  disabled?: boolean;
}

interface DesignerPanelTabsProps<V extends string = string> {
  tabs: ReadonlyArray<DesignerPanelTab<V>>;
  value: V;
  onValueChange: (value: V) => void;
  /**
   * Show only the active tab's label (icons for the rest) — for narrow
   * panels. Requires icons. Default: false.
   */
  iconsOnly?: boolean;
  /** Stretch tabs to share the full width when they fit. Default: false. */
  fill?: boolean;
  /** Accessible name for the tablist. */
  "aria-label"?: string;
  idPrefix?: string;
  className?: string;
}

/**
 * Panel tab strip that never clips: it scrolls horizontally with edge fades
 * and keeps the active tab in view. Value-based wrapper over TabsSubtle —
 * render the matching content yourself (`{value === "sections" && …}`).
 */
function DesignerPanelTabs<V extends string = string>({
  tabs,
  value,
  onValueChange,
  iconsOnly = false,
  fill = false,
  "aria-label": ariaLabel,
  idPrefix,
  className,
}: DesignerPanelTabsProps<V>) {
  const selectedIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === value),
  );
  return (
    <TabsSubtle
      selectedIndex={selectedIndex}
      onSelect={(index) => {
        const tab = tabs[index];
        if (tab && !tab.disabled) onValueChange(tab.value);
      }}
      activeLabel={iconsOnly}
      {...(idPrefix ? { idPrefix } : {})}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      className={cn("w-full", className)}
    >
      {tabs.map((tab, index) => (
        <TabsSubtleItem
          key={tab.value}
          index={index}
          label={tab.label}
          {...(tab.icon ? { icon: tab.icon } : {})}
          {...(tab.disabled ? { "aria-disabled": true } : {})}
          className={cn("justify-center px-2.5 py-1.5", fill && "flex-1")}
        />
      ))}
    </TabsSubtle>
  );
}

export { DesignerPanelHeader, DesignerPanelTabs };
export type { DesignerPanelHeaderProps, DesignerPanelTabsProps, DesignerPanelTab };
