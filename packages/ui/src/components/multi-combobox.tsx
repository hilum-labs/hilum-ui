"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "../lib/utils";
import {
  controlInvalidWithinClasses,
  controlSurfaceClasses,
  controlTextClass,
  inputFocusWithinClasses,
  motionClasses,
} from "../lib/interaction";
import { useShape } from "../lib/shape-context";
import { isAriaInvalid, useFieldContext, useFieldControl } from "../lib/field-context";
import { useControllableState } from "../lib/use-controllable-state";
import { useDensityAttributes } from "../lib/density-context";
import {
  mobilePopperSheetMotionClassName,
  mobilePopperSheetPositionClassName,
  mobilePopperSheetSurfaceClassName,
} from "../lib/mobile-popper-sheet";
import type { ComboboxOption } from "./combobox";
import { Tag } from "./tag-input";
import { Spinner } from "./spinner";

/** Localizable strings. Every entry has an English default. */
interface MultiComboboxLabels {
  /** Toggle button accessible name while the list is closed. */
  open: string;
  /** Toggle button accessible name while the list is open. */
  close: string;
  /**
   * @deprecated Unused since the list renders in a popover layer: on phones
   * it is a bottom sheet whose backdrop (like Select's) dismisses it.
   */
  closeOptions: string;
  /** Accessible name of a chip's remove button. */
  remove: (label: string) => string;
  /** Clear-all button (`clearable`). */
  clearAll: string;
  /** Shown while `loading`. */
  loading: string;
  /**
   * Chip label for a selected value whose option isn't known yet (not in
   * `options`, `selectedOptions` or `getOptionLabel`) while `loading`.
   */
  loadingOption: string;
  /** Chip label for a selected value with no known option (e.g. deleted). */
  unknownOption: string;
  /** Screen-reader summary of the selection, read with the input. */
  selectedSummary: (labels: string[]) => string;
  /** Announced when an option is selected. */
  selected: (label: string) => string;
  /** Announced when an option is deselected. */
  deselected: (label: string) => string;
  /** Announced when `maxSelected` stops a selection. */
  limitReached: (max: number) => string;
}

const MULTI_COMBOBOX_DEFAULT_LABELS: MultiComboboxLabels = {
  open: "Open",
  close: "Close",
  closeOptions: "Close options",
  remove: (label) => `Remove ${label}`,
  clearAll: "Clear all",
  loading: "Loading…",
  loadingOption: "Loading…",
  unknownOption: "Unknown item",
  selectedSummary: (labels) =>
    labels.length === 0 ? "" : `${labels.length} selected: ${labels.join(", ")}`,
  selected: (label) => `${label} selected`,
  deselected: (label) => `${label} removed`,
  limitReached: (max) => `You can select up to ${max}`,
};

/** ARIA attributes the combobox manages itself and therefore doesn't accept. */
type ManagedAria =
  | "aria-expanded"
  | "aria-controls"
  | "aria-activedescendant"
  | "aria-autocomplete"
  | "aria-haspopup";

interface MultiComboboxProps extends Omit<React.AriaAttributes, ManagedAria> {
  /** Options to choose from (the current search results when `onSearchChange` is set). */
  options: ComboboxOption[];
  /**
   * Options for selected values that may not be in `options`: the selection
   * loaded with a record while search results are fetched separately, or a
   * value whose option is on another page. Chips use their labels.
   */
  selectedOptions?: ComboboxOption[];
  /**
   * Label for a selected value that isn't in `options` or `selectedOptions`
   * (e.g. from a lookup map). Return `undefined` when unknown.
   */
  getOptionLabel?: (value: string) => string | undefined;
  /** Selected option values (controlled). */
  value?: string[];
  /** Initially selected values (uncontrolled). */
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  /** Search field placeholder while nothing is selected. */
  placeholder?: string;
  /** Shown when no option matches. */
  emptyText?: string;
  /**
   * Called with the search text as the user types (and "" when the list
   * closes). Use it to fetch `options` from a server; the component then
   * stops filtering them itself unless `filterOptions` is true.
   */
  onSearchChange?: (query: string) => void;
  /** Filter `options` by the search text. Default: true, or false with `onSearchChange`. */
  filterOptions?: boolean;
  /** Show a loading row (e.g. while `onSearchChange` results load). */
  loading?: boolean;
  /** Most options that can be selected; the rest are disabled once reached. */
  maxSelected?: number;
  /** Close the list after each selection. Default false. */
  closeOnSelect?: boolean;
  /** Show a clear-all (×) button while something is selected. */
  clearable?: boolean;
  disabled?: boolean;
  /** id of the search input. Inside a `<Field>` it is wired automatically. */
  id?: string;
  /** Form field name: every selected value posts as a hidden input. */
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Classes for the root element. */
  className?: string;
  /** Override the English UI strings (i18n). */
  labels?: Partial<MultiComboboxLabels>;
  ref?: React.Ref<HTMLInputElement> | undefined;
}

function matches(option: ComboboxOption, query: string) {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  return (
    option.label.toLocaleLowerCase().includes(needle) ||
    Boolean(option.description?.toLocaleLowerCase().includes(needle))
  );
}

/**
 * Select several options with a searchable list; the selection shows as
 * removable chips in the field. Supports server-side search
 * (`onSearchChange` + `loading`), `maxSelected`, Backspace to remove the last
 * chip, and `<Field>` wiring. The value is the list of option `value`s, in
 * selection order.
 */
function MultiCombobox({
  options,
  selectedOptions,
  getOptionLabel,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Search…",
  emptyText = "No results found.",
  onSearchChange,
  filterOptions,
  loading = false,
  maxSelected,
  closeOnSelect = false,
  clearable = false,
  disabled: disabledProp,
  id,
  name,
  onBlur,
  className,
  labels: labelsProp,
  ref,
  ...ariaProps
}: MultiComboboxProps) {
  const shape = useShape();
  const labels = { ...MULTI_COMBOBOX_DEFAULT_LABELS, ...labelsProp };
  const field = useFieldContext();
  const summaryId = React.useId();
  const listboxId = React.useId();
  const fieldProps = useFieldControl({
    id,
    disabled: disabledProp,
    "aria-describedby": ariaProps["aria-describedby"],
    "aria-invalid": ariaProps["aria-invalid"],
    "aria-required": ariaProps["aria-required"],
  });
  const disabled = fieldProps.disabled ?? false;
  const [selected, setSelected] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [announcement, setAnnouncement] = React.useState("");
  const densityAttributes = useDensityAttributes();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  // Remember every option seen (in `options` or `selectedOptions`) so chips
  // keep their labels when server-side search replaces `options`.
  const [known, setKnown] = React.useState<Map<string, ComboboxOption>>(() => new Map());
  React.useEffect(() => {
    setKnown((previous) => {
      let changed = false;
      const next = new Map(previous);
      for (const option of [...(selectedOptions ?? []), ...options]) {
        if (next.get(option.value) !== option) {
          next.set(option.value, option);
          changed = true;
        }
      }
      return changed ? next : previous;
    });
  }, [options, selectedOptions]);
  const optionFor = (optionValue: string) =>
    options.find((option) => option.value === optionValue) ??
    selectedOptions?.find((option) => option.value === optionValue) ??
    known.get(optionValue);
  // Never show a raw id: a value with no known option gets a neutral label.
  const labelFor = (optionValue: string) =>
    optionFor(optionValue)?.label ??
    getOptionLabel?.(optionValue) ??
    (loading ? labels.loadingOption : labels.unknownOption);
  const isKnown = (optionValue: string) =>
    optionFor(optionValue) !== undefined || getOptionLabel?.(optionValue) !== undefined;

  const shouldFilter = filterOptions ?? !onSearchChange;
  const filtered = shouldFilter ? options.filter((option) => matches(option, query)) : options;
  const selectedSet = new Set(selected);
  const atLimit = maxSelected !== undefined && selected.length >= maxSelected;

  const updateQuery = (next: string) => {
    setQuery(next);
    onSearchChange?.(next);
  };

  const closeList = () => {
    setOpen(false);
    setActiveIndex(-1);
    if (query) updateQuery("");
  };

  React.useEffect(() => {
    setActiveIndex(-1);
  }, [query, open]);

  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    document
      .getElementById(`${listboxId}-option-${activeIndex}`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [open, activeIndex, listboxId]);

  React.useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const toggle = (option: ComboboxOption) => {
    if (disabled) return;
    if (selectedSet.has(option.value)) {
      setSelected(selected.filter((candidate) => candidate !== option.value));
      setAnnouncement(labels.deselected(option.label));
    } else if (atLimit && maxSelected !== undefined) {
      setAnnouncement(labels.limitReached(maxSelected));
      return;
    } else {
      setSelected([...selected, option.value]);
      setAnnouncement(labels.selected(option.label));
    }
    if (closeOnSelect) closeList();
    else if (query && shouldFilter) updateQuery("");
  };

  const removeValue = (optionValue: string) => {
    if (disabled) return;
    setSelected(selected.filter((candidate) => candidate !== optionValue));
    setAnnouncement(labels.deselected(labelFor(optionValue)));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      else setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const target = activeIndex >= 0 ? filtered[activeIndex] : filtered[0];
      if (target) toggle(target);
    } else if (event.key === "Escape") {
      // The popover layer closes the list first (and marks the event handled).
      if (open && !event.defaultPrevented) {
        event.preventDefault();
        closeList();
      }
    } else if (event.key === "Tab") {
      if (open) closeList();
    } else if (event.key === "Backspace" && query === "" && selected.length > 0) {
      event.preventDefault();
      removeValue(selected[selected.length - 1]!);
    }
  };

  const listVisible = open && filtered.length > 0;
  // The listbox needs a name: the explicit one, the Field label, or the placeholder.
  const listboxName: { "aria-labelledby"?: string; "aria-label"?: string } = ariaProps[
    "aria-labelledby"
  ]
    ? { "aria-labelledby": ariaProps["aria-labelledby"] }
    : ariaProps["aria-label"]
      ? { "aria-label": ariaProps["aria-label"] }
      : field?.labelId
        ? { "aria-labelledby": field.labelId }
        : { "aria-label": placeholder };
  const invalid = isAriaInvalid(fieldProps["aria-invalid"]);
  const summary = labels.selectedSummary(selected.map(labelFor));
  const describedBy =
    [fieldProps["aria-describedby"], summary ? summaryId : undefined].filter(Boolean).join(" ") ||
    undefined;

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) closeList();
      }}
    >
      <div ref={containerRef} data-slot="multi-combobox" className={cn("relative", className)}>
        {/* The field anchors the list, which renders in a portal so a card's
          overflow can't clip it. Clicking the field's padding focuses the
          search input. */}
        <PopoverPrimitive.Anchor asChild>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pointer convenience; the input inside is the keyboard target */}
          <div
            data-invalid={invalid ? "" : undefined}
            data-disabled={disabled ? "" : undefined}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                inputRef.current?.focus();
                setOpen(true);
              }
            }}
            className={cn(
              "flex min-h-9 w-full cursor-text flex-wrap items-center gap-1 py-[5px] ps-1.5 pe-9",
              shape.input,
              controlSurfaceClasses,
              motionClasses,
              inputFocusWithinClasses,
              controlInvalidWithinClasses,
              disabled && "cursor-not-allowed bg-muted opacity-50",
              clearable && selected.length > 0 && "pe-16",
            )}
          >
            {selected.map((optionValue) => (
              <Tag
                key={optionValue}
                data-unknown={isKnown(optionValue) ? undefined : ""}
                className={cn(!isKnown(optionValue) && "italic text-muted-foreground")}
                disabled={disabled}
                removeLabel={labels.remove(labelFor(optionValue))}
                onRemove={() => {
                  removeValue(optionValue);
                  inputRef.current?.focus();
                }}
              >
                {labelFor(optionValue)}
              </Tag>
            ))}
            <input
              {...ariaProps}
              {...fieldProps}
              ref={inputRef}
              type="text"
              role="combobox"
              disabled={disabled}
              aria-describedby={describedBy}
              aria-expanded={listVisible}
              aria-haspopup="listbox"
              aria-controls={listVisible ? listboxId : undefined}
              aria-activedescendant={
                listVisible && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
              }
              aria-autocomplete="list"
              value={query}
              placeholder={selected.length === 0 ? placeholder : undefined}
              onChange={(event) => {
                updateQuery(event.target.value);
                if (!open) setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
              className={cn(
                "h-6 min-w-20 flex-1 bg-transparent px-1.5 text-foreground outline-none placeholder:text-muted-foreground",
                controlTextClass,
                "disabled:cursor-not-allowed",
              )}
            />
            <span id={summaryId} className="sr-only">
              {summary}
            </span>
            <div className="absolute inset-y-0 end-0 flex items-center pe-1">
              {clearable && selected.length > 0 && !disabled && (
                <button
                  type="button"
                  aria-label={labels.clearAll}
                  onClick={() => {
                    setSelected([]);
                    inputRef.current?.focus();
                  }}
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                tabIndex={-1}
                disabled={disabled}
                aria-label={open ? labels.close : labels.open}
                className="flex size-7 items-center justify-center text-muted-foreground"
                onClick={() => {
                  if (open) closeList();
                  else {
                    setOpen(true);
                    inputRef.current?.focus();
                  }
                }}
              >
                <ChevronsUpDown size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </PopoverPrimitive.Anchor>
        {name !== undefined &&
          selected.map((optionValue) => (
            <input key={optionValue} type="hidden" name={name} value={optionValue} />
          ))}

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            {...densityAttributes}
            // Not a dialog: the listbox inside is the combobox's popup.
            role={undefined}
            data-slot="multi-combobox-content"
            data-hilum-mobile-sheet="true"
            side="bottom"
            align="start"
            sideOffset={4}
            // Focus stays in the search input (aria-activedescendant pattern).
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              if (containerRef.current?.contains(event.target as Node)) event.preventDefault();
            }}
            // Inside a modal Dialog the page scroll lock (react-remove-scroll)
            // cancels wheel / touch scrolling outside the dialog, and this
            // layer is portalled out of it: keep those events to the list.
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            className={cn(
              "z-50 w-(--radix-popover-trigger-width) overflow-hidden rounded-lg border border-border bg-card shadow-elevated outline-none",
              mobilePopperSheetPositionClassName,
              mobilePopperSheetSurfaceClassName,
              "max-md:p-2 max-md:pt-5",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              mobilePopperSheetMotionClassName,
              "motion-reduce:animate-none",
            )}
          >
            {filtered.length > 0 && (
              <ul
                id={listboxId}
                role="listbox"
                aria-multiselectable="true"
                aria-busy={loading || undefined}
                {...listboxName}
                className="max-h-60 overflow-auto overscroll-contain py-1 max-md:max-h-[calc(min(70dvh,28rem)-3rem)]"
              >
                {filtered.map((option, index) => {
                  const isSelected = selectedSet.has(option.value);
                  const isDisabled = !isSelected && atLimit;
                  return (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- aria-activedescendant listbox: the input handles the keyboard
                    <li
                      key={option.value}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isDisabled || undefined}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => toggle(option)}
                      className={cn(
                        "flex min-h-10 cursor-pointer select-none items-center gap-2.5 px-3 py-2 body text-foreground transition-colors motion-reduce:transition-none",
                        index === activeIndex ? "bg-muted" : "hover:bg-muted",
                        isDisabled && "cursor-not-allowed opacity-50",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          isSelected
                            ? "border-brand-primary bg-brand-primary text-background"
                            : "border-border bg-card",
                        )}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </span>
                      {option.avatar && (
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted caption-xs font-semibold text-muted-foreground">
                          {option.avatar}
                        </span>
                      )}
                      {option.statusColor && !option.avatar && (
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: option.statusColor }}
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{option.label}</span>
                        {option.description && (
                          <span className="caption block truncate text-muted-foreground">
                            {option.description}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-2 body text-muted-foreground">
                <Spinner size="sm" label={labels.loading} />
                <span aria-hidden="true">{labels.loading}</span>
              </div>
            ) : filtered.length === 0 ? (
              <div role="status" className="px-3 py-2 body text-muted-foreground">
                {emptyText}
              </div>
            ) : null}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </span>
      </div>
    </PopoverPrimitive.Root>
  );
}
MultiCombobox.displayName = "MultiCombobox";

export { MultiCombobox, MULTI_COMBOBOX_DEFAULT_LABELS };
export type { MultiComboboxProps, MultiComboboxLabels };
