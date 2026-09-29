"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "../lib/utils";
import { FieldContext } from "../lib/field-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { SearchInput } from "./search-input";
import { Skeleton } from "./skeleton";
import { Thumbnail } from "./thumbnail";

/** One row of the picker. Extra fields on your own type are passed back in `onSelect`. */
interface ResourcePickerItem {
  id: string;
  /** Primary line (product, collection or customer name). */
  title: string;
  /** Secondary line (SKU, "12 in stock", email). */
  subtitle?: React.ReactNode;
  /**
   * Image URL, rendered as a 40px `Thumbnail` (`null` shows the placeholder),
   * or your own node (an Avatar). Omit for rows without media.
   */
  thumbnail?: string | null | React.ReactNode;
  /** Trailing content: a price, a stock count, a StatusBadge. */
  meta?: React.ReactNode;
  /** The row can't be picked (e.g. already added elsewhere). */
  disabled?: boolean;
}

/** Localizable strings. Every entry has an English default. */
interface ResourcePickerLabels {
  /** Search field placeholder and accessible name. */
  search: string;
  cancel: string;
  /** Confirm button. */
  add: (count: number) => string;
  /** Selection count in the footer. */
  selectedCount: (count: number, max: number | undefined) => string;
  /** Loading indicator name. */
  loading: string;
  /** Shown when there are no items and no `emptyState`. */
  noResults: string;
  /** Button that calls `onLoadMore`. */
  loadMore: string;
  /** Dialog close button. */
  close: string;
}

const RESOURCE_PICKER_DEFAULT_LABELS: ResourcePickerLabels = {
  search: "Search",
  cancel: "Cancel",
  add: (count) => (count > 1 ? `Add ${count}` : "Add"),
  selectedCount: (count, max) =>
    max !== undefined ? `${count} of ${max} selected` : `${count} selected`,
  loading: "Loading",
  noResults: "No results found",
  loadMore: "Load more",
  close: "Close",
};

interface ResourcePickerProps<T extends ResourcePickerItem = ResourcePickerItem> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Dialog title, e.g. "Add products". */
  title: string;
  description?: string;
  /** Rows to show: the current search results. */
  items: T[];
  /**
   * Called with the search text after `searchDelay` ms (and with "" when the
   * picker opens). Fetch matching `items` here. Without it, `items` are
   * filtered by title in the browser.
   */
  onSearch?: (query: string) => void;
  /** Debounce for `onSearch`, in ms. Default 250. */
  searchDelay?: number;
  /** Rows are loading (skeleton rows when empty, a spinner row otherwise). */
  loading?: boolean;
  /** Show a "Load more" button that calls `onLoadMore`. */
  hasMore?: boolean;
  onLoadMore?: () => void;
  /** Checkboxes (default) or a single choice with radio buttons. */
  multiple?: boolean;
  /** Ids already chosen, selected each time the picker opens. */
  initialSelectedIds?: string[];
  /** Most rows that can be selected (multiple mode). */
  maxSelected?: number;
  /**
   * Confirmed selection, in selection order. `items` holds every selected row
   * the picker has seen (rows selected before opening that were never in
   * `items` appear in `ids` only).
   */
  onSelect: (ids: string[], items: T[]) => void;
  /** Custom row content (replaces title, subtitle and meta; the control and thumbnail stay). */
  renderItem?: (item: T, state: { selected: boolean; disabled: boolean }) => React.ReactNode;
  /** Rendered when there are no rows (after loading). */
  emptyState?: React.ReactNode;
  /** Override the English UI strings (i18n). */
  labels?: Partial<ResourcePickerLabels>;
}

function ItemMedia({ thumbnail }: { thumbnail: ResourcePickerItem["thumbnail"] }) {
  if (thumbnail === undefined) return null;
  if (thumbnail === null || typeof thumbnail === "string") {
    return <Thumbnail src={thumbnail} alt="" size="md" />;
  }
  return <span className="flex shrink-0">{thumbnail}</span>;
}

/**
 * Shopify-style resource picker: a dialog with a search field and a list of
 * rows (thumbnail, title, subtitle, meta) selected with checkboxes (or radio
 * buttons with `multiple={false}`), confirmed with "Add". Search and paging
 * can be server-side (`onSearch`, `loading`, `hasMore` / `onLoadMore`); the
 * selection survives searching.
 */
function ResourcePicker<T extends ResourcePickerItem = ResourcePickerItem>({
  open,
  onOpenChange,
  title,
  description,
  items,
  onSearch,
  searchDelay = 250,
  loading = false,
  hasMore = false,
  onLoadMore,
  multiple = true,
  initialSelectedIds,
  maxSelected,
  onSelect,
  renderItem,
  emptyState,
  labels: labelsProp,
}: ResourcePickerProps<T>) {
  const labels = { ...RESOURCE_PICKER_DEFAULT_LABELS, ...labelsProp };
  const baseId = React.useId();
  const [query, setQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>(initialSelectedIds ?? []);
  const [seen, setSeen] = React.useState<Map<string, T>>(() => new Map());
  const lastSearch = React.useRef<string | null>(null);
  const onSearchRef = React.useRef(onSearch);
  React.useEffect(() => {
    onSearchRef.current = onSearch;
  });

  // Each opening starts from the current value and an empty search.
  const initialKey = (initialSelectedIds ?? []).join("\u0000");
  React.useEffect(() => {
    if (!open) return;
    setSelectedIds(initialKey ? initialKey.split("\u0000") : []);
    setQuery("");
    lastSearch.current = null;
  }, [open, initialKey]);

  // Remember rows so selections keep their data across searches.
  React.useEffect(() => {
    setSeen((previous) => {
      let changed = false;
      const next = new Map(previous);
      for (const item of items) {
        if (next.get(item.id) !== item) {
          next.set(item.id, item);
          changed = true;
        }
      }
      return changed ? next : previous;
    });
  }, [items]);

  // Debounced server-side search.
  React.useEffect(() => {
    if (!open || !onSearchRef.current) return;
    if (lastSearch.current === query) return;
    const run = () => {
      lastSearch.current = query;
      onSearchRef.current?.(query);
    };
    if (lastSearch.current === null) {
      run();
      return;
    }
    const timer = window.setTimeout(run, searchDelay);
    return () => window.clearTimeout(timer);
  }, [open, query, searchDelay]);

  const needle = query.trim().toLocaleLowerCase();
  const rows = onSearch
    ? items
    : items.filter((item) => !needle || item.title.toLocaleLowerCase().includes(needle));

  const selectedSet = new Set(selectedIds);
  const atLimit = multiple && maxSelected !== undefined && selectedIds.length >= maxSelected;

  const toggle = (item: T, checked: boolean) => {
    setSelectedIds((current) => {
      if (!checked) return current.filter((id) => id !== item.id);
      if (current.includes(item.id)) return current;
      if (maxSelected !== undefined && current.length >= maxSelected) return current;
      return [...current, item.id];
    });
  };

  const confirm = () => {
    const chosen = selectedIds
      .map((id) => seen.get(id) ?? items.find((item) => item.id === id))
      .filter((item): item is T => item !== undefined);
    onSelect(selectedIds, chosen);
    onOpenChange(false);
  };

  const initialCount = initialKey ? initialKey.split("\u0000").length : 0;
  const canConfirm = selectedIds.length > 0 || initialCount > 0;

  const renderRowContent = (item: T, selected: boolean, disabled: boolean) => {
    const titleId = `${baseId}-${item.id}-title`;
    return (
      <>
        <ItemMedia thumbnail={item.thumbnail} />
        <span className="min-w-0 flex-1">
          {renderItem ? (
            renderItem(item, { selected, disabled })
          ) : (
            <>
              <span id={titleId} className="block truncate body font-medium text-foreground">
                {item.title}
              </span>
              {item.subtitle && (
                <span className="caption block truncate text-muted-foreground">
                  {item.subtitle}
                </span>
              )}
            </>
          )}
        </span>
        {!renderItem && item.meta && (
          <span className="shrink-0 text-end body tabular-nums text-muted-foreground">
            {item.meta}
          </span>
        )}
      </>
    );
  };

  const rowClassName = (disabled: boolean) =>
    cn(
      "flex min-h-14 items-center gap-3 px-5 py-2 transition-colors motion-reduce:transition-none",
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-muted",
    );

  const listLabel = title;
  let list: React.ReactNode;
  if (loading && rows.length === 0) {
    list = (
      <div aria-hidden="true" className="flex flex-col">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex min-h-14 items-center gap-3 px-5 py-2">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="size-10 rounded-md" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (rows.length === 0) {
    list = emptyState ?? (
      <p className="px-5 py-10 text-center body text-muted-foreground">{labels.noResults}</p>
    );
  } else if (multiple) {
    list = (
      <ul aria-label={listLabel} className="flex flex-col">
        {rows.map((item) => {
          const selected = selectedSet.has(item.id);
          const disabled = Boolean(item.disabled) || (!selected && atLimit);
          const titleId = `${baseId}-${item.id}-title`;
          return (
            <li
              key={item.id}
              data-slot="resource-picker-item"
              data-selected={selected || undefined}
            >
              <label className={rowClassName(disabled)}>
                <Checkbox
                  checked={selected}
                  disabled={disabled}
                  onCheckedChange={(checked) => toggle(item, checked === true)}
                  {...(renderItem ? { "aria-label": item.title } : { "aria-labelledby": titleId })}
                />
                {renderRowContent(item, selected, disabled)}
              </label>
            </li>
          );
        })}
      </ul>
    );
  } else {
    list = (
      <RadioGroupPrimitive.Root
        aria-label={listLabel}
        value={selectedIds[0] ?? ""}
        onValueChange={(id) => setSelectedIds(id ? [id] : [])}
        className="flex flex-col"
      >
        {rows.map((item) => {
          const selected = selectedSet.has(item.id);
          const disabled = Boolean(item.disabled);
          const titleId = `${baseId}-${item.id}-title`;
          return (
            <label
              key={item.id}
              data-slot="resource-picker-item"
              data-selected={selected || undefined}
              className={rowClassName(disabled)}
            >
              <RadioGroupPrimitive.Item
                value={item.id}
                disabled={disabled}
                {...(renderItem ? { "aria-label": item.title } : { "aria-labelledby": titleId })}
                className="flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 data-[state=checked]:border-brand-primary"
              >
                <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-brand-primary" />
              </RadioGroupPrimitive.Item>
              {renderRowContent(item, selected, disabled)}
            </label>
          );
        })}
      </RadioGroupPrimitive.Root>
    );
  }

  return (
    // The dialog's search field and checkboxes don't belong to a Field the
    // picker's trigger may sit in.
    <FieldContext.Provider value={null}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          size="lg"
          closeLabel={labels.close}
          className="flex max-h-[min(90dvh,44rem)] flex-col p-0"
          data-slot="resource-picker"
          {...(description ? {} : { "aria-describedby": undefined })}
        >
          <DialogHeader className="mb-0 border-b border-border px-5 py-4 pe-12">
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="border-b border-border px-5 py-3">
            <SearchInput
              value={query}
              onValueChange={setQuery}
              placeholder={labels.search}
              loading={loading && rows.length > 0}
              labels={{ searching: labels.loading }}
            />
          </div>
          <div
            className="min-h-40 flex-1 overflow-y-auto py-1"
            aria-busy={loading || undefined}
            data-slot="resource-picker-list"
          >
            {list}
            {hasMore && onLoadMore && rows.length > 0 && (
              <div className="flex justify-center px-5 py-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  loading={loading}
                  onClick={onLoadMore}
                >
                  {labels.loadMore}
                </Button>
              </div>
            )}
            {loading && rows.length === 0 && (
              <span className="sr-only" role="status">
                {labels.loading}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
            <p className="caption tabular-nums text-muted-foreground" aria-live="polite">
              {multiple ? labels.selectedCount(selectedIds.length, maxSelected) : ""}
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {labels.cancel}
              </Button>
              <Button type="button" onClick={confirm} disabled={!canConfirm}>
                {labels.add(selectedIds.length)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </FieldContext.Provider>
  );
}
ResourcePicker.displayName = "ResourcePicker";

export { ResourcePicker, RESOURCE_PICKER_DEFAULT_LABELS };
export type { ResourcePickerProps, ResourcePickerItem, ResourcePickerLabels };
