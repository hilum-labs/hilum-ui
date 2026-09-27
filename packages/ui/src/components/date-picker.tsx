"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange as DayPickerDateRange, Matcher } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { Button } from "./button";
import { cn } from "../lib/utils";
import { formatDate, formatDateRange, useFormatter } from "../lib/format";

type DateRange = { from: Date | undefined; to?: Date | undefined };

interface DatePickerBaseProps {
  placeholder?: string;
  disabled?: boolean;
  /** Earliest selectable day. */
  minDate?: Date;
  /** Latest selectable day. */
  maxDate?: Date;
  /** Show a clear (×) button when a value is set. */
  clearable?: boolean;
  /** BCP-47 locale for the trigger label. Defaults to FormatProvider. */
  locale?: string;
  /**
   * Stretch the trigger to its container (default, like Input). Pass `false`
   * for an inline 15rem trigger, or size it with `containerClassName`.
   */
  fullWidth?: boolean;
  /** Classes for the trigger wrapper (width, margins). `className` targets the button. */
  containerClassName?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  className?: string;
}

interface DatePickerProps extends DatePickerBaseProps {
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
}

function disabledMatchers(minDate?: Date, maxDate?: Date): Matcher[] | undefined {
  const matchers: Matcher[] = [];
  if (minDate) matchers.push({ before: minDate });
  if (maxDate) matchers.push({ after: maxDate });
  return matchers.length ? matchers : undefined;
}

interface TriggerProps extends DatePickerBaseProps {
  label: React.ReactNode;
  empty: boolean;
  onClear: () => void;
}

const DatePickerTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  (
    {
      label,
      empty,
      onClear,
      clearable,
      disabled,
      fullWidth = true,
      containerClassName,
      className,
      id,
      "aria-label": ariaLabel,
      "aria-invalid": ariaInvalid,
      ...rest
    },
    ref,
  ) => (
    <div
      className={cn(
        "relative inline-flex",
        fullWidth ? "w-full" : "w-60 max-w-full",
        containerClassName,
      )}
    >
      <Button
        ref={ref}
        type="button"
        variant="outline"
        id={id}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        className={cn(
          "w-full justify-start gap-2 text-left font-normal",
          empty && "text-muted-foreground",
          clearable && !empty && "pr-8",
          ariaInvalid && "border-destructive",
          className,
        )}
        disabled={disabled}
        {...rest}
      >
        <CalendarIcon size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="min-w-0 truncate">{label}</span>
      </Button>
      {clearable && !empty && !disabled && (
        <button
          type="button"
          aria-label="Clear date"
          onClick={(event) => {
            event.stopPropagation();
            onClear();
          }}
          className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </div>
  ),
);
DatePickerTrigger.displayName = "DatePickerTrigger";

/**
 * Single-date picker — a button trigger + calendar popover. Replaces native
 * `<input type="date">` so dates look and localise the same everywhere.
 * Pair with `toISODate()` / `toDate()` when your API speaks "YYYY-MM-DD".
 */
function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  locale,
  ...rest
}: DatePickerProps) {
  const fmt = useFormatter();
  const [open, setOpen] = React.useState(false);
  const resolvedLocale = locale ?? fmt.locale;
  const label = value
    ? formatDate(value, { style: "long", ...(resolvedLocale ? { locale: resolvedLocale } : {}) })
    : placeholder;
  const disabledDays = disabledMatchers(minDate, maxDate);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <DatePickerTrigger
          {...rest}
          label={label}
          empty={!value}
          onClear={() => onChange?.(undefined)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-elevated" align="start">
        <Calendar
          mode="single"
          {...(value !== undefined && { selected: value, defaultMonth: value })}
          {...(disabledDays && { disabled: disabledDays })}
          onSelect={(date: Date | undefined) => {
            onChange?.(date);
            if (date) setOpen(false);
          }}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- moves focus into the calendar when the popover opens (dialog focus management)
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
DatePicker.displayName = "DatePicker";

interface DateRangePreset {
  label: string;
  range: () => DateRange;
}

function daysAgo(days: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d;
}

function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Common analytics / reporting presets. */
const DEFAULT_DATE_RANGE_PRESETS: DateRangePreset[] = [
  { label: "Today", range: () => ({ from: today(), to: today() }) },
  { label: "Last 7 days", range: () => ({ from: daysAgo(6), to: today() }) },
  { label: "Last 30 days", range: () => ({ from: daysAgo(29), to: today() }) },
  { label: "Last 90 days", range: () => ({ from: daysAgo(89), to: today() }) },
  {
    label: "Month to date",
    range: () => {
      const t = today();
      return { from: new Date(t.getFullYear(), t.getMonth(), 1), to: t };
    },
  },
  {
    label: "Year to date",
    range: () => {
      const t = today();
      return { from: new Date(t.getFullYear(), 0, 1), to: t };
    },
  },
];

interface DateRangePickerProps extends DatePickerBaseProps {
  value?: DateRange | undefined;
  /** Shorthand for `value={{ from, to }}`. Ignored when `value` is set. */
  from?: Date | undefined;
  /** Shorthand for `value={{ from, to }}`. Ignored when `value` is set. */
  to?: Date | undefined;
  onChange?: (range: DateRange | undefined) => void;
  /** Quick ranges shown beside the calendar. Pass `[]` to hide. */
  presets?: DateRangePreset[];
  /** Months shown side-by-side from `sm` up. Default: 2. */
  numberOfMonths?: number;
}

/**
 * Date-range picker with optional presets ("Last 30 days") — for analytics
 * filters, reports and exports. Replaces pairs of native date inputs.
 */
function DateRangePicker({
  value: valueProp,
  from,
  to,
  onChange,
  placeholder = "Pick a date range",
  minDate,
  maxDate,
  locale,
  presets = DEFAULT_DATE_RANGE_PRESETS,
  numberOfMonths = 2,
  ...rest
}: DateRangePickerProps) {
  const fmt = useFormatter();
  const [open, setOpen] = React.useState(false);
  const value = valueProp ?? (from || to ? { from, to } : undefined);
  const resolvedLocale = locale ?? fmt.locale;
  const label = value?.from
    ? formatDateRange(value.from, value.to ?? value.from, {
        ...(resolvedLocale ? { locale: resolvedLocale } : {}),
      })
    : placeholder;
  const disabledDays = disabledMatchers(minDate, maxDate);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <DatePickerTrigger
          {...rest}
          label={label}
          empty={!value?.from}
          onClear={() => onChange?.(undefined)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0 shadow-elevated" align="start">
        <div className="flex flex-col sm:flex-row">
          {presets.length > 0 && (
            <div
              role="group"
              aria-label="Preset ranges"
              className="flex gap-1 overflow-x-auto border-b border-border p-2 [scrollbar-width:none] sm:w-40 sm:flex-col sm:overflow-visible sm:border-r sm:border-b-0"
            >
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="shrink-0 justify-start"
                  onClick={() => {
                    onChange?.(preset.range());
                    setOpen(false);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}
          <Calendar
            mode="range"
            numberOfMonths={numberOfMonths}
            {...(value?.from && {
              selected: value as DayPickerDateRange,
              defaultMonth: value.from,
            })}
            {...(disabledDays && { disabled: disabledDays })}
            onSelect={(range: DayPickerDateRange | undefined) =>
              onChange?.(range ? { from: range.from, to: range.to } : undefined)
            }
            // eslint-disable-next-line jsx-a11y/no-autofocus -- moves focus into the calendar when the popover opens (dialog focus management)
            autoFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
DateRangePicker.displayName = "DateRangePicker";

export { DatePicker, DateRangePicker, DEFAULT_DATE_RANGE_PRESETS };
export type { DatePickerProps, DateRangePickerProps, DateRange, DateRangePreset };
