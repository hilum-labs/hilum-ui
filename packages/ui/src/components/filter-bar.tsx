"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useFormatter } from "../lib/format";
import { Button } from "./button";
import { SearchInput } from "./search-input";

interface FilterBarSearch {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

/** One applied filter, rendered as a removable pill ("Status: Active ×"). */
interface FilterBarAppliedFilter {
  /** Stable key (usually the filter id). */
  key: string;
  /** Pill text, e.g. "Status: Active". */
  label: React.ReactNode;
  /** Plain-text name for the remove button when `label` isn't a string. */
  textLabel?: string;
  onRemove: () => void;
}

/** A saved view ("All", "Unfulfilled", "Open"). */
interface FilterBarView {
  id: string;
  label: string;
  /** Optional count badge ("Unfulfilled 12"). */
  count?: number;
}

interface FilterBarLabels {
  /** Accessible name of the filter group. */
  filters: string;
  /** Accessible name of the saved views tab list. */
  views: string;
  /** Accessible name of the applied filter list. */
  appliedFilters: string;
  /** Remove button name for a pill. */
  removeFilter: (label: string) => string;
  clearAll: string;
  saveView: string;
  searchPlaceholder: string;
}

const DEFAULT_LABELS: FilterBarLabels = {
  filters: "Filters",
  views: "Saved views",
  appliedFilters: "Applied filters",
  removeFilter: (label) => `Remove filter ${label}`,
  clearAll: "Clear all",
  saveView: "Save view",
  searchPlaceholder: "Search",
};

interface FilterBarProps {
  /** Built-in SearchInput. Omit for filter-only bars. */
  search?: FilterBarSearch;
  /** Filter controls — Select, DateRangePicker, toggles. Scroll horizontally on mobile. */
  children?: React.ReactNode;
  /** Whether any filter/search is applied; shows the clear action. */
  active?: boolean;
  /** Reset search and filters. Shown only while `active`. */
  onClear?: () => void;
  clearLabel?: string;
  /** Trailing actions (sort, export, view toggle) aligned to the end from `md`. */
  actions?: React.ReactNode;
  /** Result summary under the bar ("24 orders"). */
  summary?: React.ReactNode;
  /** Removable pills for the filters currently applied. */
  appliedFilters?: FilterBarAppliedFilter[];
  /** "Clear all" after the pills. Falls back to `onClear`. */
  onClearAll?: () => void;
  /** Saved views rendered as tabs above the bar. */
  views?: FilterBarView[];
  selectedView?: string;
  onViewChange?: (id: string) => void;
  /** Shows a "Save view" action next to the views. */
  onSaveView?: () => void;
  /**
   * Let the filter row bleed to the viewport edges on mobile so it can scroll
   * edge-to-edge. Pass `true` for the default 1rem page gutter, or a class
   * string for a custom one (e.g. "-mx-6 px-6 md:mx-0 md:px-0").
   */
  mobileBleed?: boolean | string;
  /** Classes for the horizontally scrolling filter row. */
  filtersClassName?: string;
  labels?: Partial<FilterBarLabels>;
  className?: string;
}

/* ─────────────────────── Saved views ─────────────────────── */

function FilterBarViews({
  views,
  selectedView,
  onViewChange,
  onSaveView,
  labels,
}: {
  views: FilterBarView[];
  selectedView: string | undefined;
  onViewChange: ((id: string) => void) | undefined;
  onSaveView: (() => void) | undefined;
  labels: FilterBarLabels;
}) {
  const fmt = useFormatter();
  const listRef = React.useRef<HTMLDivElement>(null);
  const selected = selectedView ?? views[0]?.id;
  const [focusId, setFocusId] = React.useState<string | undefined>(selected);
  React.useEffect(() => setFocusId(selected), [selected]);

  const focusTab = (id: string) => {
    setFocusId(id);
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']") ?? [];
    Array.from(tabs)
      .find((tab) => tab.dataset.viewId === id)
      ?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = views.findIndex((view) => view.id === focusId);
    if (index < 0) return;
    const rtl = listRef.current ? getComputedStyle(listRef.current).direction === "rtl" : false;
    const nextKey = rtl ? "ArrowLeft" : "ArrowRight";
    const prevKey = rtl ? "ArrowRight" : "ArrowLeft";
    let next: number | null = null;
    if (event.key === nextKey) next = (index + 1) % views.length;
    else if (event.key === prevKey) next = (index - 1 + views.length) % views.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = views.length - 1;
    if (next === null) return;
    event.preventDefault();
    const view = views[next];
    if (view) focusTab(view.id);
  };

  return (
    <div className="flex min-w-0 items-center gap-2" data-slot="filter-bar-views">
      <div
        ref={listRef}
        role="tablist"
        aria-label={labels.views}
        className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {views.map((view) => {
          const isSelected = view.id === selected;
          return (
            <button
              key={view.id}
              type="button"
              role="tab"
              data-view-id={view.id}
              aria-selected={isSelected}
              tabIndex={view.id === focusId ? 0 : -1}
              onFocus={() => setFocusId(view.id)}
              onKeyDown={onKeyDown}
              onClick={() => onViewChange?.(view.id)}
              className={cn(
                "body-sm inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {view.label}
              {view.count !== undefined && (
                <span className="caption tabular-nums text-muted-foreground">
                  {fmt.number(view.count)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {onSaveView && (
        <Button type="button" variant="ghost" size="sm" onClick={onSaveView} className="shrink-0">
          <Plus size={14} aria-hidden="true" />
          {labels.saveView}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────── Applied filter pills ─────────────────────── */

function FilterBarPills({
  filters,
  onClearAll,
  labels,
}: {
  filters: FilterBarAppliedFilter[];
  onClearAll: (() => void) | undefined;
  labels: FilterBarLabels;
}) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const pendingFocus = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (pendingFocus.current === null) return;
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
      "[data-slot='filter-pill-remove']",
    );
    const target = buttons?.[Math.min(pendingFocus.current, (buttons?.length ?? 1) - 1)];
    pendingFocus.current = null;
    target?.focus();
  }, [filters]);

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2" data-slot="filter-bar-pills">
      <ul
        ref={listRef}
        aria-label={labels.appliedFilters}
        className="flex flex-wrap items-center gap-1.5"
      >
        {filters.map((filter, index) => {
          const text =
            filter.textLabel ?? (typeof filter.label === "string" ? filter.label : filter.key);
          return (
            <li
              key={filter.key}
              className="caption inline-flex h-7 items-center gap-1 rounded-full border border-border bg-muted/50 ps-2.5 pe-1 text-foreground"
            >
              <span className="max-w-60 truncate">{filter.label}</span>
              <button
                type="button"
                data-slot="filter-pill-remove"
                aria-label={labels.removeFilter(text)}
                onClick={() => {
                  pendingFocus.current = index;
                  filter.onRemove();
                }}
                className="flex size-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={12} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      {onClearAll && (
        <Button type="button" variant="link" size="sm" onClick={onClearAll}>
          {labels.clearAll}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────── FilterBar ─────────────────────── */

/**
 * List toolbar: saved views + search + filters + applied-filter pills + clear +
 * actions. Stacks on mobile with the filter row scrolling horizontally; one
 * row from `md`. Replaces hand-built "Input + Select + date inputs + reset"
 * rows above tables.
 */
function FilterBar({
  search,
  children,
  active = false,
  onClear,
  clearLabel = "Clear filters",
  actions,
  summary,
  appliedFilters,
  onClearAll,
  views,
  selectedView,
  onViewChange,
  onSaveView,
  mobileBleed = false,
  filtersClassName,
  labels: labelsProp,
  className,
}: FilterBarProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const bleedClass =
    mobileBleed === true
      ? "-mx-4 px-4 md:mx-0 md:px-0"
      : typeof mobileBleed === "string"
        ? mobileBleed
        : undefined;

  return (
    <div data-slot="filter-bar" className={cn("flex min-w-0 flex-col gap-2", className)}>
      {views && views.length > 0 && (
        <FilterBarViews
          views={views}
          selectedView={selectedView}
          onViewChange={onViewChange}
          onSaveView={onSaveView}
          labels={labels}
        />
      )}
      <div
        role="group"
        aria-label={labels.filters}
        className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center"
      >
        {search && (
          <SearchInput
            value={search.value}
            onValueChange={search.onValueChange}
            placeholder={search.placeholder ?? labels.searchPlaceholder}
            {...(search.loading ? { loading: true } : {})}
            containerClassName="md:max-w-xs md:flex-1"
          />
        )}
        {(children || (active && onClear)) && (
          <div
            data-slot="filter-bar-filters"
            className={cn(
              "flex min-w-0 items-center gap-2 overflow-x-auto [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden [&>*]:shrink-0",
              bleedClass,
              filtersClassName,
            )}
          >
            {children}
            {active && onClear && (
              <Button type="button" variant="ghost" size="sm" onClick={onClear}>
                <X size={14} aria-hidden="true" />
                {clearLabel}
              </Button>
            )}
          </div>
        )}
        {actions && <div className="flex shrink-0 items-center gap-2 md:ms-auto">{actions}</div>}
      </div>
      {appliedFilters && appliedFilters.length > 0 && (
        <FilterBarPills
          filters={appliedFilters}
          onClearAll={onClearAll ?? onClear}
          labels={labels}
        />
      )}
      {summary && (
        <p className="caption text-muted-foreground" aria-live="polite">
          {summary}
        </p>
      )}
    </div>
  );
}

FilterBar.displayName = "FilterBar";

export { FilterBar, DEFAULT_LABELS as FILTER_BAR_DEFAULT_LABELS };
export type {
  FilterBarProps,
  FilterBarSearch,
  FilterBarAppliedFilter,
  FilterBarView,
  FilterBarLabels,
};
