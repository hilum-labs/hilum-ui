"use client";

import * as React from "react";
import { Search, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";
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

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandPaletteItem[];
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
}

function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "Search...",
  emptyText = "No results found.",
  title = "Command palette",
  description = "Search for a command or page. Use the arrow keys to move and Enter to select.",
  onNavigate,
  closeLabel,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const filtered =
    query === ""
      ? items
      : items.filter(
          (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase()) ||
            item.category?.toLowerCase().includes(query.toLowerCase()),
        );

  // Group by category. `ordered` is the visual (grouped) order, which is the
  // order arrow keys walk through and what activeIndex indexes into.
  const grouped = filtered.reduce<Record<string, CommandPaletteItem[]>>((acc, item) => {
    const cat = item.category ?? "";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  const groups = Object.entries(grouped);
  const ordered = groups.flatMap(([, items]) => items);
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
        className="gap-0 overflow-hidden p-0 sm:max-w-xl"
        {...(closeLabel !== undefined ? { closeLabel } : {})}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4">
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
            className="h-12 flex-1 bg-transparent body text-foreground placeholder:text-muted-foreground focus:outline-none"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="hidden items-center gap-0.5 sm:flex">
            <span className="caption-xs font-medium text-muted-foreground rounded border border-border px-1.5 py-0.5">
              esc
            </span>
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto">
          {ordered.length === 0 ? (
            <p role="status" className="px-4 py-8 text-center body text-muted-foreground">
              {emptyText}
            </p>
          ) : (
            <div id={listboxId} role="listbox" aria-label={title} className="py-2">
              {groups.map(([cat, items]) => {
                const headingId = `${listboxId}-group-${cat}`;
                return (
                  <div key={cat} role="group" {...(cat ? { "aria-labelledby": headingId } : {})}>
                    {cat && (
                      <p
                        id={headingId}
                        role="presentation"
                        className="label px-4 py-2 text-muted-foreground"
                      >
                        {cat}
                      </p>
                    )}
                    {items.map((item, i) => {
                      const index = runningIndex++;
                      const isActive = index === safeActive;
                      return (
                        // Options aren't focusable: focus stays in the input and
                        // the active option is conveyed via aria-activedescendant.
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- aria-activedescendant pattern: keyboard selection handled by the input (Arrow/Enter)
                        <div
                          key={item.id ?? `${cat}-${i}`}
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

export { CommandPalette };
export type { CommandPaletteProps };
