"use client";

import * as React from "react";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";
import { Dialog, DialogContent } from "./dialog";

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
}

function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "Search...",
  emptyText = "No results found.",
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [open]);

  const filtered =
    query === ""
      ? items
      : items.filter(
          (item) =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase()) ||
            item.category?.toLowerCase().includes(query.toLowerCase())
        );

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandPaletteItem[]>>((acc, item) => {
    const cat = item.category ?? "";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  function handleSelect(item: CommandPaletteItem) {
    if (item.href) {
      window.location.href = item.href;
    } else {
      item.onSelect?.();
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-taupe-100 px-4">
          <Search size={16} className="shrink-0 text-taupe-400" />
          <input
            ref={inputRef}
            type="text"
            className="h-12 flex-1 bg-transparent body text-taupe-900 placeholder:text-taupe-400 focus:outline-none"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && filtered.length > 0) handleSelect(filtered[0]);
            }}
          />
          <kbd className="hidden items-center gap-0.5 sm:flex">
            <span className="caption-xs font-medium text-taupe-400 rounded border border-taupe-200 px-1.5 py-0.5">esc</span>
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center body text-taupe-400">{emptyText}</p>
          ) : (
            <ul role="list" className="py-2">
              {categories.map((cat) => (
                <li key={cat}>
                  {cat && (
                    <p className="label px-4 py-2 text-taupe-400">{cat}</p>
                  )}
                  {grouped[cat].map((item, i) => (
                    <button
                      key={item.id ?? i}
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-2.5 body text-left transition-colors hover:bg-taupe-50 focus-visible:bg-taupe-50 focus-visible:outline-none"
                      onClick={() => handleSelect(item)}
                    >
                      {item.icon && (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-taupe-200 bg-white text-taupe-500">
                          {item.icon}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-taupe-900 truncate">{item.label}</p>
                        {item.description && (
                          <p className="caption text-taupe-400 truncate">{item.description}</p>
                        )}
                      </div>
                      <ArrowRight size={13} className="shrink-0 text-taupe-300" />
                    </button>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { CommandPalette };
