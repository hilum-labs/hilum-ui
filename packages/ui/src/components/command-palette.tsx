"use client";

import * as React from "react";
import { Search, ArrowRight, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Spinner } from "./spinner";
import { cn } from "../lib/utils";

export interface CommandPaletteItem {
  id?: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  href?: string;
  onSelect?: () => void;
}

/**
 * A group of results the app fetches itself for the current query (orders,
 * products, customers…). Unlike `items`, group items are not filtered by the
 * palette: render what your search returned.
 */
export interface CommandPaletteGroup {
  /** Stable key. */
  id: string;
  /** Group heading, e.g. "Orders". */
  label: string;
  items: CommandPaletteItem[];
  /** The group's results are being fetched: shows a loading row under the heading. */
  loading?: boolean;
  /**
   * Shown under the heading when the group has no items and isn't loading.
   * Omit to hide an empty group entirely.
   */
  emptyText?: string;
}

/** Localizable strings. Every entry has an English default. */
export interface CommandPaletteLabels {
  /** Loading row text and screen-reader announcement while a group loads. */
  loading: string;
  /** Visible keyboard hint next to the search field. */
  escapeHint: string;
}

const COMMAND_PALETTE_DEFAULT_LABELS: CommandPaletteLabels = {
  loading: "Loading…",
  escapeHint: "esc",
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  /** Static commands and pages, filtered by the query inside the palette. */
  items: CommandPaletteItem[];
  /**
   * Result groups the app fetches for the query (see `onQueryChange`), shown
   * after the matching `items`, in order. Their items are not filtered.
   */
  groups?: CommandPaletteGroup[];
  /**
   * Called whenever the query changes (and with "" when the palette opens).
   * Fetch your async `groups` here; debounce in the app if needed.
   */
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  emptyText?: string;
  /** Accessible name of the dialog (visually hidden). */
  title?: string;
  /** Accessible description of the dialog (visually hidden). */
  description?: string;
  /**
   * Called for items with an `href` (instead of a full page load via
   * `window.location`). Pass your router's navigate function for client-side
   * routing. As before, an item's `href` takes precedence over its `onSelect`.
   */
  onNavigate?: (href: string) => void;
  /** Screen-reader label of the dialog's close button. Default: "Close". */
  closeLabel?: string;
  /** Localizable strings; unspecified keys fall back to English. */
  labels?: Partial<CommandPaletteLabels>;
}

interface RenderGroup {
  key: string;
  label: string;
  items: CommandPaletteItem[];
  loading: boolean;
  emptyText: string | undefined;
}

function CommandPalette({
  open,
  onClose,
  items,
  groups: asyncGroups,
  onQueryChange,
  placeholder = "Search...",
  emptyText = "No results found.",
  title = "Command palette",
  description = "Search for a command or page. Use the arrow keys to move and Enter to select.",
  onNavigate,
  closeLabel = "Close",
  labels: labelsProp,
}: CommandPaletteProps) {
  const labels = { ...COMMAND_PALETTE_DEFAULT_LABELS, ...labelsProp };
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;
  const onQueryChangeRef = React.useRef(onQueryChange);
  React.useEffect(() => {
    onQueryChangeRef.current = onQueryChange;
  });

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIndex(0);
      onQueryChangeRef.current?.("");
    }
  }, [open]);

  const q = query.toLowerCase();
  const filtered =
    query === ""
      ? items
      : items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            item.category?.toLowerCase().includes(q),
        );

  // Static items grouped by category, then the app's async groups. `ordered`
  // is the visual order, which is the order arrow keys walk through and what
  // activeIndex indexes into.
  const byCategory = filtered.reduce<Record<string, CommandPaletteItem[]>>((acc, item) => {
    const cat = item.category ?? "";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  const renderGroups: RenderGroup[] = [
    ...Object.entries(byCategory).map(([cat, catItems]) => ({
      key: `static-${cat}`,
      label: cat,
      items: catItems,
      loading: false,
      emptyText: undefined,
    })),
    ...(asyncGroups ?? [])
      .filter((group) => group.loading || group.items.length > 0 || group.emptyText)
      .map((group) => ({
        key: `async-${group.id}`,
        label: group.label,
        items: group.items,
        loading: Boolean(group.loading),
        emptyText: group.emptyText,
      })),
  ];
  const ordered = renderGroups.flatMap((group) => group.items);
  const anyLoading = renderGroups.some((group) => group.loading);
  const hasGroupMessage = renderGroups.some(
    (group) => !group.loading && group.items.length === 0 && group.emptyText,
  );
  const showEmpty = ordered.length === 0 && !anyLoading && !hasGroupMessage;
  const safeActive = ordered.length === 0 ? -1 : Math.min(activeIndex, ordered.length - 1);

  // Keep the active option in view while arrowing through a long list.
  React.useEffect(() => {
    if (safeActive < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${safeActive}"]`);
    el?.scrollIntoView?.({ block: "nearest" });
  }, [safeActive]);

  function handleSelect(item: CommandPaletteItem) {
    if (item.href) {
      if (onNavigate) onNavigate(item.href);
      else if (typeof window !== "undefined") window.location.assign(item.href);
    } else {
      item.onSelect?.();
    }
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (ordered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((safeActive + 1) % ordered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((safeActive - 1 + ordered.length) % ordered.length);
    } else if (e.key === "Home" && e.ctrlKey) {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End" && e.ctrlKey) {
      e.preventDefault();
      setActiveIndex(ordered.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = ordered[safeActive];
      if (item) handleSelect(item);
    }
  }

  let runningIndex = 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-slot="command-palette"
        showCloseButton={false}
        // Anchored near the top on desktop instead of centred, so the search
        // field stays put while results grow and shrink. On mobile the sheet
        // keeps a fixed results height for the same reason.
        className="gap-0 overflow-hidden p-0 sm:max-w-xl lg:top-[12dvh] lg:translate-y-0"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        {/* Search row: icon, input, esc hint and close button, all in flow so
            nothing overlaps. */}
        <div className="flex items-center gap-3 border-b border-border ps-4 pe-2">
          <Search size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label={title}
            aria-expanded={ordered.length > 0}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={safeActive >= 0 ? optionId(safeActive) : undefined}
            autoComplete="off"
            className="h-12 min-w-0 flex-1 bg-transparent body text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
              onQueryChange?.(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd
            data-slot="command-palette-esc"
            aria-hidden="true"
            className="hidden shrink-0 items-center gap-0.5 sm:flex"
          >
            <span className="caption-xs font-medium text-muted-foreground rounded border border-border px-1.5 py-0.5">
              {labels.escapeHint}
            </span>
          </kbd>
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0" aria-label={closeLabel}>
              <X aria-hidden="true" />
            </Button>
          </DialogPrimitive.Close>
        </div>

        {/* Loading announcement lives outside the listbox (only options belong inside). */}
        <span className="sr-only" role="status" aria-live="polite">
          {anyLoading ? labels.loading : ""}
        </span>

        {/* Results */}
        <div
          ref={listRef}
          data-slot="command-palette-results"
          className="max-h-80 overflow-y-auto overscroll-contain max-lg:h-[min(55dvh,24rem)] max-lg:max-h-none"
        >
          {showEmpty ? (
            <p className="px-4 py-8 text-center body text-muted-foreground">{emptyText}</p>
          ) : (
            <div
              id={listboxId}
              role="listbox"
              aria-label={title}
              aria-busy={anyLoading || undefined}
              className="py-2"
            >
              {renderGroups.map((group) => {
                const headingId = `${listboxId}-group-${group.key}`;
                return (
                  <div
                    key={group.key}
                    role="group"
                    data-slot="command-palette-group"
                    {...(group.label ? { "aria-labelledby": headingId } : {})}
                  >
                    {group.label && (
                      <p
                        id={headingId}
                        role="presentation"
                        className="label px-4 py-2 text-muted-foreground"
                      >
                        {group.label}
                      </p>
                    )}
                    {group.loading && group.items.length === 0 && (
                      <div
                        role="presentation"
                        data-slot="command-palette-loading"
                        className="flex min-h-10 items-center gap-3 px-4 py-2.5 body text-muted-foreground"
                      >
                        <Spinner size="sm" role="presentation" aria-hidden="true" />
                        {labels.loading}
                      </div>
                    )}
                    {!group.loading && group.items.length === 0 && group.emptyText && (
                      <p role="presentation" className="px-4 py-2.5 caption text-muted-foreground">
                        {group.emptyText}
                      </p>
                    )}
                    {group.items.map((item, i) => {
                      const index = runningIndex++;
                      const isActive = index === safeActive;
                      return (
                        // Options aren't focusable: focus stays in the input and
                        // the active option is conveyed via aria-activedescendant.
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- aria-activedescendant pattern: keyboard selection handled by the input (Arrow/Enter)
                        <div
                          key={item.id ?? `${group.key}-${i}`}
                          id={optionId(index)}
                          role="option"
                          aria-selected={isActive}
                          data-index={index}
                          data-active={isActive || undefined}
                          className={cn(
                            "flex min-h-10 w-full cursor-pointer items-center gap-3 px-4 py-2.5 body text-start transition-colors",
                            isActive ? "bg-muted" : "hover:bg-muted",
                          )}
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseMove={() => {
                            if (!isActive) setActiveIndex(index);
                          }}
                          onClick={() => handleSelect(item)}
                        >
                          {item.icon && (
                            <span
                              aria-hidden="true"
                              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground"
                            >
                              {item.icon}
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">{item.label}</p>
                            {item.description && (
                              <p className="caption text-muted-foreground truncate">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight
                            size={13}
                            className="shrink-0 text-muted-foreground rtl:-scale-x-100"
                            aria-hidden="true"
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

CommandPalette.displayName = "CommandPalette";

export { CommandPalette, COMMAND_PALETTE_DEFAULT_LABELS };
export type { CommandPaletteProps };
