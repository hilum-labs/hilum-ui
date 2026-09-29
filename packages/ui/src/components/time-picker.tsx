"use client";

import * as React from "react";
import { Clock, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useFormatter } from "../lib/format";
import { useFieldControl } from "../lib/field-context";
import {
  controlSizeClasses,
  controlSurfaceClasses,
  inputFocusWithinClasses,
  motionClasses,
} from "../lib/interaction";

/* ─────────────────────── Time helpers ─────────────────────── */

type HourCycle = "h12" | "h23";
type SegmentType = "hour" | "minute" | "dayPeriod";

/** Parse "HH:mm" (24h) into minutes since midnight, or null. */
function parseTime(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/** Format minutes since midnight as "HH:mm". */
function formatTimeValue(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** The locale's preferred hour cycle ("h12" for en-US, "h23" for de-DE). */
function resolveHourCycle(locale: string | undefined): HourCycle {
  try {
    const cycle = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hourCycle;
    return cycle === "h11" || cycle === "h12" ? "h12" : "h23";
  } catch {
    return "h23";
  }
}

/** Segment order and localized AM/PM labels for a locale. */
function resolveLayout(locale: string | undefined, hourCycle: HourCycle) {
  const sample = new Date(2000, 0, 1, 9, 5);
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    hourCycle,
  });
  const parts = formatter.formatToParts(sample);
  const order: SegmentType[] = [];
  let separator = ":";
  for (const part of parts) {
    if (part.type === "hour" || part.type === "minute" || part.type === "dayPeriod") {
      order.push(part.type);
    } else if (part.type === "literal" && order.length === 1 && order[0] === "hour") {
      separator = part.value.trim() || ":";
    }
  }
  if (!order.includes("hour")) order.unshift("hour");
  if (!order.includes("minute")) order.splice(order.indexOf("hour") + 1, 0, "minute");
  if (hourCycle === "h12" && !order.includes("dayPeriod")) order.push("dayPeriod");
  if (hourCycle === "h23") {
    const index = order.indexOf("dayPeriod");
    if (index !== -1) order.splice(index, 1);
  }
  const period = (hour: number) =>
    new Intl.DateTimeFormat(locale, { hour: "numeric", hourCycle: "h12" })
      .formatToParts(new Date(2000, 0, 1, hour))
      .find((part) => part.type === "dayPeriod")?.value ?? (hour < 12 ? "AM" : "PM");
  return { order, separator, am: period(9), pm: period(21) };
}

/* ─────────────────────── TimePicker ─────────────────────── */

interface TimePickerLabels {
  hour: string;
  minute: string;
  dayPeriod: string;
  clear: string;
  /** Placeholder glyphs for empty segments. */
  placeholder: string;
  /** Spoken value of an empty segment. */
  empty: string;
}

const TIME_PICKER_DEFAULT_LABELS: TimePickerLabels = {
  hour: "Hour",
  minute: "Minute",
  dayPeriod: "AM/PM",
  clear: "Clear time",
  placeholder: "––",
  empty: "Empty",
};

interface TimePickerProps {
  /** "HH:mm" in 24-hour time, or null/undefined when empty. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  /** Minute increment for arrow keys; typed minutes snap to it. Default 1. */
  step?: number;
  /** Earliest time ("HH:mm"). Values are clamped into range. */
  min?: string;
  /** Latest time ("HH:mm"). */
  max?: string;
  /** Force 12- or 24-hour display. Defaults to the locale's preference. */
  hourCycle?: HourCycle;
  /** BCP-47 locale. Defaults to FormatProvider, then the runtime. */
  locale?: string;
  disabled?: boolean;
  /** Show a clear button when a value is set. */
  clearable?: boolean;
  /** Name for a hidden input so the value posts with native forms. */
  name?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  labels?: Partial<TimePickerLabels>;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

interface Draft {
  hour: number | null; // 0–23
  minute: number | null;
  period: "am" | "pm";
}

function draftFromValue(value: string | null | undefined): Draft {
  const total = parseTime(value);
  if (total === null) return { hour: null, minute: null, period: "am" };
  const hour = Math.floor(total / 60);
  return { hour, minute: total % 60, period: hour >= 12 ? "pm" : "am" };
}

/**
 * Segmented time field (hour / minute / AM-PM spinbuttons). Arrow keys step,
 * digits type, Backspace clears, Home/End jump to the range ends. 12/24-hour
 * display follows the locale; the value is always "HH:mm".
 */
function TimePicker({
  value: valueProp,
  defaultValue,
  onChange,
  step = 1,
  min,
  max,
  hourCycle: hourCycleProp,
  locale: localeProp,
  disabled: disabledProp,
  clearable = false,
  name,
  id: idProp,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedByProp,
  "aria-invalid": ariaInvalidProp,
  labels: labelsProp,
  className,
  ref,
}: TimePickerProps) {
  const fmt = useFormatter();
  const locale = localeProp ?? fmt.locale;
  const labels = { ...TIME_PICKER_DEFAULT_LABELS, ...labelsProp };
  const hourCycle = hourCycleProp ?? resolveHourCycle(locale);
  const layout = React.useMemo(() => resolveLayout(locale, hourCycle), [locale, hourCycle]);
  const fieldProps = useFieldControl({
    id: idProp,
    disabled: disabledProp,
    "aria-describedby": ariaDescribedByProp,
    "aria-invalid": ariaInvalidProp,
  });
  const disabled = Boolean(fieldProps.disabled);

  const controlled = valueProp !== undefined;
  const [draft, setDraft] = React.useState<Draft>(() =>
    draftFromValue(controlled ? valueProp : defaultValue),
  );
  const lastEmitted = React.useRef<string | null>(controlled ? (valueProp ?? null) : null);

  // Sync from a controlled value that changed externally.
  React.useEffect(() => {
    if (!controlled) return;
    const next = valueProp ?? null;
    if (next === lastEmitted.current) return;
    lastEmitted.current = next;
    setDraft(draftFromValue(next));
  }, [controlled, valueProp]);

  const minMinutes = parseTime(min);
  const maxMinutes = parseTime(max);
  const segmentRefs = React.useRef(new Map<SegmentType, HTMLDivElement>());
  const typed = React.useRef<{ segment: SegmentType | null; buffer: string }>({
    segment: null,
    buffer: "",
  });

  const commit = (next: Draft) => {
    let emitted: string | null = null;
    let resolved = next;
    if (next.hour !== null && next.minute !== null) {
      let total = next.hour * 60 + next.minute;
      if (minMinutes !== null && total < minMinutes) total = minMinutes;
      if (maxMinutes !== null && total > maxMinutes) total = maxMinutes;
      const hour = Math.floor(total / 60);
      resolved = { hour, minute: total % 60, period: hour >= 12 ? "pm" : "am" };
      emitted = formatTimeValue(total);
    }
    setDraft(resolved);
    const previous = lastEmitted.current;
    if (emitted !== previous && (emitted !== null || previous !== null)) {
      lastEmitted.current = emitted;
      onChange?.(emitted);
    }
  };

  const focusSegment = (segment: SegmentType | undefined) => {
    if (segment) segmentRefs.current.get(segment)?.focus();
  };
  const neighbour = (segment: SegmentType, delta: 1 | -1) =>
    layout.order[layout.order.indexOf(segment) + delta];

  /* ── Display values ── */
  const displayHour = (hour: number | null) => {
    if (hour === null) return null;
    if (hourCycle === "h23") return hour;
    const h = hour % 12;
    return h === 0 ? 12 : h;
  };
  const numberFormat = React.useMemo(
    () => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }),
    [locale],
  );

  /* ── Mutations ── */
  const withHour = (hour24: number) => ({
    ...draft,
    hour: hour24,
    period: hour24 >= 12 ? ("pm" as const) : ("am" as const),
  });

  const stepSegment = (segment: SegmentType, direction: 1 | -1) => {
    if (segment === "hour") {
      let next: number;
      if (draft.hour === null) {
        const base = hourCycle === "h12" && draft.period === "pm" ? 12 : 0;
        next = direction === 1 ? base : base + (hourCycle === "h12" ? 11 : 23);
      } else if (hourCycle === "h12") {
        // Cycle within the current AM/PM period, like a physical clock.
        const base = draft.hour >= 12 ? 12 : 0;
        next = base + ((draft.hour - base + direction + 12) % 12);
      } else {
        next = (draft.hour + direction + 24) % 24;
      }
      commit({ ...withHour(next), minute: draft.minute });
    } else if (segment === "minute") {
      const current = draft.minute;
      let next: number;
      if (current === null) next = direction === 1 ? 0 : 60 - step;
      else {
        const snapped = Math.round(current / step) * step;
        next = (snapped + direction * step + 60) % 60;
      }
      commit({ ...draft, minute: next });
    } else {
      const period = draft.period === "am" ? "pm" : "am";
      const hour = draft.hour === null ? null : (draft.hour + 12) % 24;
      commit({ ...draft, hour, period });
    }
  };

  const setBoundary = (segment: SegmentType, end: "min" | "max") => {
    if (segment === "hour") {
      if (hourCycle === "h12") {
        const base = draft.period === "pm" ? 12 : 0;
        commit({ ...withHour(end === "min" ? base : base + 11), minute: draft.minute });
      } else commit({ ...withHour(end === "min" ? 0 : 23), minute: draft.minute });
    } else if (segment === "minute") {
      commit({ ...draft, minute: end === "min" ? 0 : 60 - step });
    }
  };

  const typeDigit = (segment: "hour" | "minute", digit: string) => {
    const state = typed.current;
    const maxValue = segment === "hour" ? (hourCycle === "h12" ? 12 : 23) : 59;
    let buffer = state.segment === segment ? state.buffer + digit : digit;
    if (Number(buffer) > maxValue) buffer = digit;
    const numeric = Number(buffer);
    const done = buffer.length >= 2 || numeric * 10 > maxValue;
    if (segment === "hour") {
      let hour24 = numeric;
      if (hourCycle === "h12") hour24 = (numeric % 12) + (draft.period === "pm" ? 12 : 0);
      // A lone "0" in 12-hour mode waits for the next digit (01–09).
      if (!(hourCycle === "h12" && numeric === 0 && !done)) {
        commit({ ...withHour(hour24), minute: draft.minute });
      }
    } else {
      const minute = done && step > 1 ? Math.min(59, Math.round(numeric / step) * step) : numeric;
      commit({ ...draft, minute });
    }
    typed.current = done ? { segment: null, buffer: "" } : { segment, buffer };
    if (done) focusSegment(neighbour(segment, 1));
  };

  const onSegmentKeyDown =
    (segment: SegmentType) => (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          stepSegment(segment, 1);
          return;
        case "ArrowDown":
          event.preventDefault();
          stepSegment(segment, -1);
          return;
        case "ArrowRight":
          event.preventDefault();
          focusSegment(neighbour(segment, rtl ? -1 : 1));
          return;
        case "ArrowLeft":
          event.preventDefault();
          focusSegment(neighbour(segment, rtl ? 1 : -1));
          return;
        case "Home":
          event.preventDefault();
          setBoundary(segment, "min");
          return;
        case "End":
          event.preventDefault();
          setBoundary(segment, "max");
          return;
        case "Backspace":
        case "Delete":
          event.preventDefault();
          typed.current = { segment: null, buffer: "" };
          if (segment === "hour") commit({ ...draft, hour: null });
          else if (segment === "minute") commit({ ...draft, minute: null });
          return;
        default:
          break;
      }
      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        if (segment !== "dayPeriod") typeDigit(segment, event.key);
        return;
      }
      if (segment === "dayPeriod" && event.key.length === 1) {
        const key = event.key.toLowerCase();
        const wantAm = key === "a" || layout.am.toLowerCase().startsWith(key);
        const wantPm = key === "p" || layout.pm.toLowerCase().startsWith(key);
        if (wantAm === wantPm) return;
        event.preventDefault();
        const period = wantAm ? "am" : "pm";
        if (period === draft.period) return;
        const hour = draft.hour === null ? null : (draft.hour + 12) % 24;
        commit({ ...draft, hour, period });
      }
    };

  /* ── Render ── */
  const hourValue = displayHour(draft.hour);
  const segmentClass =
    "rounded-sm px-0.5 tabular-nums caret-transparent outline-none focus:bg-brand-primary focus:text-primary-foreground";

  const renderSegment = (segment: SegmentType) => {
    const common = {
      ref: (element: HTMLDivElement | null) => {
        if (element) segmentRefs.current.set(segment, element);
        else segmentRefs.current.delete(segment);
      },
      role: "spinbutton" as const,
      tabIndex: disabled ? -1 : 0,
      "aria-disabled": disabled || undefined,
      "aria-invalid": fieldProps["aria-invalid"],
      onKeyDown: onSegmentKeyDown(segment),
      onBlur: () => {
        typed.current = { segment: null, buffer: "" };
      },
      "data-segment": segment,
    };
    if (segment === "hour") {
      return (
        <div
          key={segment}
          {...common}
          aria-label={labels.hour}
          aria-valuemin={hourCycle === "h12" ? 1 : 0}
          aria-valuemax={hourCycle === "h12" ? 12 : 23}
          {...(hourValue !== null
            ? { "aria-valuenow": hourValue, "aria-valuetext": String(hourValue) }
            : { "aria-valuetext": labels.empty })}
          className={cn(segmentClass, hourValue === null && "text-muted-foreground")}
        >
          {hourValue === null ? labels.placeholder : numberFormat.format(hourValue)}
        </div>
      );
    }
    if (segment === "minute") {
      return (
        <div
          key={segment}
          {...common}
          aria-label={labels.minute}
          aria-valuemin={0}
          aria-valuemax={59}
          {...(draft.minute !== null
            ? {
                "aria-valuenow": draft.minute,
                "aria-valuetext": String(draft.minute).padStart(2, "0"),
              }
            : { "aria-valuetext": labels.empty })}
          className={cn(segmentClass, draft.minute === null && "text-muted-foreground")}
        >
          {draft.minute === null ? labels.placeholder : numberFormat.format(draft.minute)}
        </div>
      );
    }
    const periodText = draft.period === "am" ? layout.am : layout.pm;
    return (
      <div
        key={segment}
        {...common}
        aria-label={labels.dayPeriod}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={draft.period === "am" ? 0 : 1}
        aria-valuetext={periodText}
        className={cn(segmentClass, "ms-1", draft.hour === null && "text-muted-foreground")}
      >
        {periodText}
      </div>
    );
  };

  const hasValue = draft.hour !== null || draft.minute !== null;
  const currentValue =
    draft.hour !== null && draft.minute !== null
      ? formatTimeValue(draft.hour * 60 + draft.minute)
      : "";

  return (
    <div
      ref={ref}
      role="group"
      id={fieldProps.id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={fieldProps["aria-describedby"]}
      aria-disabled={disabled || undefined}
      data-invalid={fieldProps["aria-invalid"] ? "" : undefined}
      data-slot="time-picker"
      className={cn(
        "relative inline-flex min-w-0 items-center gap-2 rounded-md px-3 text-foreground",
        controlSizeClasses,
        controlSurfaceClasses,
        motionClasses,
        inputFocusWithinClasses,
        fieldProps["aria-invalid"] && "border-destructive",
        disabled && "cursor-not-allowed bg-muted opacity-50",
        "compact:h-6 compact:px-2 compact:text-[12px]",
        className,
      )}
    >
      <Clock size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="flex items-center" dir="ltr">
        {layout.order.map((segment, index) => (
          <React.Fragment key={segment}>
            {index > 0 && segment === "minute" && layout.order[index - 1] === "hour" && (
              <span aria-hidden="true" className="text-muted-foreground">
                {layout.separator}
              </span>
            )}
            {renderSegment(segment)}
          </React.Fragment>
        ))}
      </div>
      {clearable && hasValue && !disabled && (
        <button
          type="button"
          aria-label={labels.clear}
          onClick={() => {
            commit({ hour: null, minute: null, period: draft.period });
            focusSegment(layout.order[0]);
          }}
          className="ms-auto flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X size={12} aria-hidden="true" />
        </button>
      )}
      {name && <input type="hidden" name={name} value={currentValue} />}
    </div>
  );
}
TimePicker.displayName = "TimePicker";

export { TimePicker, TIME_PICKER_DEFAULT_LABELS, parseTime, formatTimeValue, resolveHourCycle };
export type { TimePickerProps, TimePickerLabels, HourCycle };
