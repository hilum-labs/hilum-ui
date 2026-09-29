"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { FieldContext, isAriaInvalid, useFieldControl } from "../lib/field-context";
import { DatePicker } from "./date-picker";
import {
  TimePicker,
  formatTimeValue,
  parseTime,
  type HourCycle,
  type TimePickerLabels,
} from "./time-picker";

interface DateTimePickerProps {
  value?: Date | undefined;
  onChange?: (value: Date | undefined) => void;
  /** Time applied when a date is picked before a time ("HH:mm"). Default "09:00". */
  defaultTime?: string;
  /** Earliest selectable moment. Limits both days and, on that day, times. */
  min?: Date;
  /** Latest selectable moment. */
  max?: Date;
  /** Minute step for the time field. */
  step?: number;
  hourCycle?: HourCycle;
  locale?: string;
  disabled?: boolean;
  clearable?: boolean;
  datePlaceholder?: string;
  /** Accessible names. `date` / `time` label each half; the group uses `aria-label`. */
  labels?: {
    date?: string;
    time?: string;
    /** Clear (×) button of the date half. */
    clearDate?: string;
  } & Partial<TimePickerLabels>;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  /** Set on the time segments (a group or a button can't carry it). */
  "aria-required"?: boolean;
  /**
   * id of the group. Inside a `<Field>` the group is named by the field's
   * label (`aria-labelledby`) and both halves take its hint / error, invalid
   * and disabled state.
   */
  id?: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function withTime(date: Date, time: string) {
  const minutes = parseTime(time) ?? 0;
  const next = new Date(date);
  next.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return next;
}

/**
 * Date + time entry composed from `DatePicker` and `TimePicker`. The value is
 * a single local `Date`; picking a day keeps the current time (or
 * `defaultTime`), editing the time keeps the day.
 */
function DateTimePicker({
  value,
  onChange,
  defaultTime = "09:00",
  min,
  max,
  step,
  hourCycle,
  locale,
  disabled,
  clearable,
  datePlaceholder,
  labels,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalidProp,
  "aria-required": ariaRequired,
  id,
  className,
  ref,
}: DateTimePickerProps) {
  const fieldProps = useFieldControl(
    {
      id,
      disabled,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalidProp,
      "aria-required": ariaRequired,
    },
    { labelable: false },
  );
  const ariaInvalid = isAriaInvalid(fieldProps["aria-invalid"]) ? true : ariaInvalidProp;
  const isDisabled = fieldProps.disabled;
  const describedBy = fieldProps["aria-describedby"];
  // Time typed before a day is chosen is remembered and applied on pick.
  const [pendingTime, setPendingTime] = React.useState<string | null>(null);
  const time = value ? formatTimeValue(value.getHours() * 60 + value.getMinutes()) : pendingTime;

  const minTime =
    value && min && sameDay(value, min)
      ? formatTimeValue(min.getHours() * 60 + min.getMinutes())
      : undefined;
  const maxTime =
    value && max && sameDay(value, max)
      ? formatTimeValue(max.getHours() * 60 + max.getMinutes())
      : undefined;

  const {
    date: dateLabel = "Date",
    time: timeLabel = "Time",
    clearDate,
    ...timeLabels
  } = labels ?? {};

  return (
    <div
      ref={ref}
      role="group"
      id={fieldProps.id}
      aria-label={ariaLabel}
      aria-labelledby={fieldProps["aria-labelledby"]}
      aria-describedby={describedBy}
      data-invalid={ariaInvalid ? "" : undefined}
      data-slot="date-time-picker"
      className={cn("flex min-w-0 flex-wrap items-center gap-2", className)}
    >
      {/* The halves are named "Date" / "Time" inside the group; they don't join the Field themselves. */}
      <FieldContext.Provider value={null}>
        <DatePicker
          {...(value ? { value } : {})}
          onChange={(date) => {
            if (!date) {
              onChange?.(undefined);
              return;
            }
            let next = withTime(date, time ?? defaultTime);
            if (min && next < min) next = new Date(min);
            if (max && next > max) next = new Date(max);
            onChange?.(next);
          }}
          {...(min ? { minDate: startOfDay(min) } : {})}
          {...(max ? { maxDate: max } : {})}
          {...(locale ? { locale } : {})}
          {...(isDisabled !== undefined ? { disabled: isDisabled } : {})}
          {...(clearable !== undefined ? { clearable } : {})}
          {...(datePlaceholder ? { placeholder: datePlaceholder } : {})}
          {...(ariaInvalid !== undefined ? { "aria-invalid": ariaInvalid } : {})}
          {...(describedBy ? { "aria-describedby": describedBy } : {})}
          aria-label={dateLabel}
          {...(clearDate !== undefined ? { labels: { clear: clearDate } } : {})}
          fullWidth={false}
          containerClassName="min-w-0 flex-1 basis-48"
        />
        <TimePicker
          value={time}
          onChange={(next) => {
            if (!value) {
              setPendingTime(next);
              return;
            }
            if (next === null) return;
            onChange?.(withTime(value, next));
          }}
          {...(step !== undefined ? { step } : {})}
          {...(minTime ? { min: minTime } : {})}
          {...(maxTime ? { max: maxTime } : {})}
          {...(hourCycle ? { hourCycle } : {})}
          {...(locale ? { locale } : {})}
          {...(isDisabled !== undefined ? { disabled: isDisabled } : {})}
          {...(ariaInvalid !== undefined ? { "aria-invalid": ariaInvalid } : {})}
          {...(describedBy ? { "aria-describedby": describedBy } : {})}
          {...(fieldProps["aria-required"] ? { "aria-required": true } : {})}
          labels={timeLabels}
          aria-label={timeLabel}
          className="shrink-0"
        />
      </FieldContext.Provider>
    </div>
  );
}
DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker };
export type { DateTimePickerProps };
