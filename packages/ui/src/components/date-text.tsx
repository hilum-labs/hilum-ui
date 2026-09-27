"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import {
  formatDate,
  formatRelativeTime,
  toDate,
  useFormatter,
  type DateFormatStyle,
  type DateInput,
} from "../lib/format";

interface DateTextProps extends Omit<React.HTMLAttributes<HTMLTimeElement>, "children"> {
  /** Date, ISO string, or epoch ms. Empty/invalid renders `fallback`. */
  value: DateInput;
  /**
   * Preset. `date`/`short` → "Sep 26, 2026" (default), `datetime` → "Sep 26,
   * 2026, 3:04 PM", `monthDay` → "Sep 26", `long`, `month`, `time`, `iso`, or
   * `relative` → "3 hours ago".
   */
  format?: DateFormatStyle | "relative";
  locale?: string;
  timeZone?: string;
  /** Shown when `value` is empty or invalid. Default: "—". */
  fallback?: string;
}

/**
 * Renders a semantic `<time>` with a consistent, locale-aware format and the
 * full date-time as a hover title. Use it for every date in tables, detail
 * sidebars and timelines instead of `toLocaleDateString()` or raw ISO strings.
 */
function DateText({
  value,
  format = "date",
  locale,
  timeZone,
  fallback = "—",
  className,
  title,
  ...props
}: DateTextProps) {
  const fmt = useFormatter();
  const date = toDate(value);
  const opts = {
    ...(locale ?? fmt.locale ? { locale: locale ?? fmt.locale } : {}),
    ...(timeZone ?? fmt.timeZone ? { timeZone: timeZone ?? fmt.timeZone } : {}),
  };
  if (!date) {
    return <span className={cn("text-muted-foreground", className)}>{fallback}</span>;
  }
  const text =
    format === "relative"
      ? formatRelativeTime(date, opts)
      : formatDate(date, { ...opts, style: format });
  return (
    <time
      dateTime={date.toISOString()}
      title={title ?? formatDate(date, { ...opts, style: "datetime" })}
      className={cn("tabular-nums", className)}
      {...props}
    >
      {text}
    </time>
  );
}

DateText.displayName = "DateText";

interface RelativeTimeProps extends Omit<DateTextProps, "format"> {
  /** Re-render on an interval so "just now" ages. Default: 60s. `0` disables. */
  updateInterval?: number;
}

/** "5 minutes ago" that keeps itself fresh; falls back to a date after 7 days. */
function RelativeTime({ updateInterval = 60_000, ...props }: RelativeTimeProps) {
  const [, force] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => {
    if (!updateInterval) return;
    const id = window.setInterval(force, updateInterval);
    return () => window.clearInterval(id);
  }, [updateInterval]);
  return <DateText {...props} format="relative" />;
}

RelativeTime.displayName = "RelativeTime";

export { DateText, RelativeTime };
export type { DateTextProps, RelativeTimeProps };
