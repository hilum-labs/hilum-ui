"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";
import { controlInvalidClasses, controlSizeClasses } from "../lib/interaction";
import { useShape } from "../lib/shape-context";
import { useFieldControl } from "../lib/field-context";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  statusColor?: string;
  avatar?: string;
}

/** ARIA attributes the combobox manages itself and therefore doesn't accept. */
type ManagedAria =
  | "aria-expanded"
  | "aria-controls"
  | "aria-activedescendant"
  | "aria-autocomplete"
  | "aria-haspopup";

interface ComboboxLabels {
  /** Toggle button accessible name while the list is closed. */
  open: string;
  /** Toggle button accessible name while the list is open. */
  close: string;
  /** Mobile backdrop button that dismisses the list. */
  closeOptions: string;
}

const DEFAULT_LABELS: ComboboxLabels = {
  open: "Open",
  close: "Close",
  closeOptions: "Close options",
};

interface ComboboxProps extends Omit<React.AriaAttributes, ManagedAria> {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  /**
   * id of the text input (e.g. for a `<label htmlFor>`). Inside a `<Field>`
   * the input takes the field's label, hint / error, invalid, required and
   * disabled state automatically.
   */
  id?: string;
  /** Form field name. Submits the selected option's `value` via a hidden input. */
  name?: string;
  disabled?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Override the English UI strings (i18n). */
  labels?: Partial<ComboboxLabels>;
  ref?: React.Ref<HTMLInputElement> | undefined;
}

function Combobox({
  ref,
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  id,
  name,
  disabled: disabledProp,
  onBlur,
  labels: labelsProp,
  ...ariaProps
}: ComboboxProps) {
  const shape = useShape();
  const fieldProps = useFieldControl({
    id,
    disabled: disabledProp,
    "aria-describedby": ariaProps["aria-describedby"],
    "aria-invalid": ariaProps["aria-invalid"],
    "aria-required": ariaProps["aria-required"],
  });
  const disabled = fieldProps.disabled ?? false;
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = React.useId();
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

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

  // Keep the keyboard-active option visible in the scrollable list.
  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [open, activeIndex, listboxId]);

  // Close when disabled while open.
  React.useEffect(() => {
    if (disabled) {
      setOpen(false);
      setQuery("");
    }
  }, [disabled]);

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
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const target = activeIndex >= 0 ? filtered[activeIndex] : filtered[0];
      if (target) selectOption(target);
    } else if (e.key === "Tab") {
      closeDropdown();
    }
  }

  return (
    <div ref={containerRef} data-slot="combobox" className={cn("relative", className)}>
      {/* Trigger */}
      <div className="relative flex items-center">
        {selectedOption?.avatar && !open && (
          <div className="pointer-events-none absolute start-2.5 flex size-5 items-center justify-center rounded-full bg-muted caption-xs font-semibold text-muted-foreground shrink-0">
            {selectedOption.avatar}
          </div>
        )}
        {selectedOption?.statusColor && !open && (
          <div
            className="pointer-events-none absolute start-3 size-2 rounded-full shrink-0"
            style={{ backgroundColor: selectedOption.statusColor }}
          />
        )}
        <input
          {...ariaProps}
          {...fieldProps}
          ref={inputRef}
          type="text"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          className={cn(
            "flex w-full border border-border bg-background pe-10 text-foreground",
            controlSizeClasses,
            shape.input,
            "placeholder:text-muted-foreground",
            "focus-visible:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            controlInvalidClasses,
            selectedOption?.avatar && !open
              ? "ps-8"
              : selectedOption?.statusColor && !open
                ? "ps-7"
                : "ps-3",
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
          onBlur={onBlur}
          onKeyDown={handleInputKeyDown}
        />
        {name !== undefined && <input type="hidden" name={name} value={value ?? ""} />}
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label={open ? labels.close : labels.open}
          className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-muted-foreground hover:text-muted-foreground transition-colors"
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
        <>
          <button
            type="button"
            aria-label={labels.closeOptions}
            className="fixed inset-0 z-40 hidden bg-black/30 backdrop-blur-sm max-md:block"
            onClick={closeDropdown}
          />
          <div
            className={cn(
              "absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-elevated",
              "max-md:fixed max-md:inset-x-3 max-md:bottom-3 max-md:[bottom:max(0.75rem,env(safe-area-inset-bottom))] max-md:top-auto max-md:mt-0 max-md:w-auto",
              "max-md:max-h-[min(70dvh,28rem)] max-md:rounded-2xl max-md:p-2 max-md:pt-5",
              "max-md:before:absolute max-md:before:left-1/2 max-md:before:top-2 max-md:before:h-1 max-md:before:w-9 max-md:before:-translate-x-1/2 max-md:before:rounded-full max-md:before:bg-muted-foreground/35",
            )}
          >
            <ul
              id={listboxId}
              role="listbox"
              className="max-h-60 overflow-auto py-1 max-md:max-h-[calc(min(70dvh,28rem)-3rem)]"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-2 body text-muted-foreground">{emptyText}</li>
              ) : (
                filtered.map((option, idx) => {
                  const isSelected = option.value === value;
                  const isActive = idx === activeIndex;
                  return (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- aria-activedescendant listbox: keyboard selection is handled by the input (Arrow/Enter), options are pointer targets only
                    <li
                      key={option.value}
                      id={`${listboxId}-option-${idx}`}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "flex min-h-10 cursor-pointer select-none items-center gap-2.5 px-3 py-2 body transition-colors",
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
                            isSelected
                              ? "bg-card/20 text-background"
                              : "bg-muted text-muted-foreground",
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
        </>
      )}
    </div>
  );
}

Combobox.displayName = "Combobox";

export { Combobox, DEFAULT_LABELS as COMBOBOX_DEFAULT_LABELS };
export type { ComboboxProps, ComboboxLabels };
