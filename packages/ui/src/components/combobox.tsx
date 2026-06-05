"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  statusColor?: string;
  avatar?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = React.useId();

  const selectedOption = options.find((o) => o.value === value);

  const filtered =
    query === ""
      ? options
      : options.filter(
          (o) =>
            o.label.toLowerCase().includes(query.toLowerCase()) ||
            o.description?.toLowerCase().includes(query.toLowerCase()),
        );

  // Reset active index when the filtered list changes
  React.useEffect(() => {
    setActiveIndex(-1);
  }, [filtered.length, open]);

  // Close on outside click
  React.useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  function closeDropdown() {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }

  function selectOption(opt: ComboboxOption) {
    onValueChange?.(opt.value);
    closeDropdown();
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      closeDropdown();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      const target = activeIndex >= 0 ? filtered[activeIndex] : filtered[0];
      if (target) selectOption(target);
    } else if (e.key === "Tab") {
      closeDropdown();
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <div className="relative flex items-center">
        {selectedOption?.avatar && !open && (
          <div className="pointer-events-none absolute left-2.5 flex size-5 items-center justify-center rounded-full bg-muted caption-xs font-semibold text-muted-foreground shrink-0">
            {selectedOption.avatar}
          </div>
        )}
        {selectedOption?.statusColor && !open && (
          <div
            className="pointer-events-none absolute left-3 size-2 rounded-full shrink-0"
            style={{ backgroundColor: selectedOption.statusColor }}
          />
        )}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          aria-autocomplete="list"
          className={cn(
            "flex h-9 w-full rounded-lg border border-border bg-card pr-8 body text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-border",
            "disabled:cursor-not-allowed disabled:opacity-50",
            selectedOption?.avatar && !open
              ? "pl-8"
              : selectedOption?.statusColor && !open
                ? "pl-7"
                : "pl-3",
          )}
          placeholder={open ? searchPlaceholder : (selectedOption?.label ?? placeholder)}
          value={open ? query : (selectedOption?.label ?? "")}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onKeyDown={handleInputKeyDown}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Close" : "Open"}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground hover:text-muted-foreground transition-colors"
          onClick={() => {
            if (open) {
              closeDropdown();
            } else {
              setOpen(true);
              inputRef.current?.focus();
            }
          }}
        >
          <ChevronsUpDown size={14} />
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-elevated">
          <ul id={listboxId} role="listbox" className="max-h-60 overflow-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 body text-muted-foreground">{emptyText}</li>
            ) : (
              filtered.map((option, idx) => {
                const isSelected = option.value === value;
                const isActive = idx === activeIndex;
                return (
                  <li
                    key={option.value}
                    id={`${listboxId}-option-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "flex cursor-pointer select-none items-center gap-2.5 px-3 py-2 body transition-colors",
                      isSelected
                        ? "bg-brand-primary text-background"
                        : isActive
                          ? "bg-muted text-foreground"
                          : "text-foreground hover:bg-muted",
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => selectOption(option)}
                  >
                    {/* Avatar */}
                    {option.avatar && (
                      <div
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full caption-xs font-semibold",
                          isSelected ? "bg-card/20 text-background" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {option.avatar}
                      </div>
                    )}
                    {/* Status dot */}
                    {option.statusColor && !option.avatar && (
                      <div
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: option.statusColor }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate", isSelected && "font-semibold")}>
                        {option.label}
                      </p>
                      {option.description && (
                        <p
                          className={cn(
                            "caption truncate",
                            isSelected ? "text-background/70" : "text-muted-foreground",
                          )}
                        >
                          {option.description}
                        </p>
                      )}
                    </div>
                    {isSelected && <Check size={14} className="shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

Combobox.displayName = "Combobox";

export { Combobox };
