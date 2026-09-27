"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { SearchInput } from "./search-input";

interface FilterBarSearch {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

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
  /** Trailing actions (sort, export, view toggle) aligned right from `sm`. */
  actions?: React.ReactNode;
  /** Result summary under the bar ("24 orders"). */
  summary?: React.ReactNode;
  className?: string;
}

/**
 * List toolbar: search + filters + clear + actions. Stacks on mobile with the
 * filter row scrolling horizontally; one row from `md`. Replaces hand-built
 * "Input + Select + date inputs + reset" rows above tables.
 */
function FilterBar({
  search,
  children,
  active = false,
  onClear,
  clearLabel = "Clear filters",
  actions,
  summary,
  className,
}: FilterBarProps) {
  return (
    <div data-slot="filter-bar" className={cn("flex min-w-0 flex-col gap-2", className)}>
      <div
        role="toolbar"
        aria-label="Filters"
        className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center"
      >
        {search && (
          <SearchInput
            value={search.value}
            onValueChange={search.onValueChange}
            placeholder={search.placeholder ?? "Search"}
            {...(search.loading ? { loading: true } : {})}
            containerClassName="md:max-w-xs md:flex-1"
          />
        )}
        {(children || (active && onClear)) && (
          <div className="-mx-4 flex min-w-0 items-center gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden [&>*]:shrink-0">
            {children}
            {active && onClear && (
              <Button type="button" variant="ghost" size="sm" onClick={onClear}>
                <X size={14} aria-hidden="true" />
                {clearLabel}
              </Button>
            )}
          </div>
        )}
        {actions && (
          <div className="flex shrink-0 items-center gap-2 md:ml-auto">{actions}</div>
        )}
      </div>
      {summary && (
        <p className="caption text-muted-foreground" aria-live="polite">
          {summary}
        </p>
      )}
    </div>
  );
}

FilterBar.displayName = "FilterBar";

export { FilterBar };
export type { FilterBarProps, FilterBarSearch };
