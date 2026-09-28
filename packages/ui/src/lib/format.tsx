"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Locale-aware formatting helpers
//
// Product UIs drift quickly when every screen formats dates, money and counts
// by hand ("Sep 26, 2026" next to "9/26/2026", "1 items", raw ISO strings).
// These helpers wrap `Intl` so every surface shares one convention:
//
//   - dates:     medium style ("Sep 26, 2026") unless a caller opts out
//   - datetimes: medium date + short time ("Sep 26, 2026, 3:04 PM")
//   - relative:  "3 hours ago" / "in 2 days", falling back to a date after 7 days
//   - money:     ISO-4217 currency, minor units handled by Intl
//   - counts:    Intl.PluralRules-based ("1 item", "2 items")
//
// Every helper accepts an explicit `locale`; components read defaults from
// the nearest <FormatProvider>.
// ---------------------------------------------------------------------------

export type DateInput = Date | string | number | null | undefined;

/**
 * - `date` / `short` — "Sep 26, 2026" (default; `short` is an alias)
 * - `long`           — "September 26, 2026"
 * - `datetime`       — "Sep 26, 2026, 3:04 PM"
 * - `time`           — "3:04 PM"
 * - `monthDay`       — "Sep 26" (dense timelines, same-year lists)
 * - `month`          — "September 2026"
 * - `iso`            — "2026-09-26" (local calendar date, for APIs)
 */
export type DateFormatStyle =
  "date" | "short" | "long" | "datetime" | "time" | "monthDay" | "month" | "iso";

export interface FormatOptions {
  /** BCP-47 locale. Defaults to the provider locale, then the runtime default. */
  locale?: string | undefined;
  /** IANA time zone, e.g. "America/Lima". Defaults to the runtime zone. */
  timeZone?: string | undefined;
}

const DATE_STYLE_OPTIONS: Record<Exclude<DateFormatStyle, "iso">, Intl.DateTimeFormatOptions> = {
  date: { year: "numeric", month: "short", day: "numeric" },
  datetime: { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" },
  time: { hour: "numeric", minute: "2-digit" },
  short: { year: "numeric", month: "short", day: "numeric" },
  monthDay: { month: "short", day: "numeric" },
  long: { year: "numeric", month: "long", day: "numeric" },
  month: { year: "numeric", month: "long" },
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse a date-ish value. Date-only ISO strings ("2026-09-26") are read as
 * local calendar dates instead of UTC midnight, so they never shift a day
 * backwards in western time zones. Returns `null` for empty/invalid input.
 */
export function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "string" && DATE_ONLY_PATTERN.test(value)) {
    const [y, m, d] = value.split("-").map(Number) as [number, number, number];
    return new Date(y, m - 1, d);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a Date as a local calendar date string ("YYYY-MM-DD"). */
export function toISODate(value: DateInput): string {
  const date = toDate(value);
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface FormatDateOptions extends FormatOptions {
  /** Preset style. Default: `"date"` ("Sep 26, 2026"). */
  style?: DateFormatStyle;
  /** Rendered for empty/invalid input. Default: "—". */
  fallback?: string;
}

export function formatDate(value: DateInput, options: FormatDateOptions = {}): string {
  const { style = "date", fallback = "—", locale, timeZone } = options;
  const date = toDate(value);
  if (!date) return fallback;
  if (style === "iso") return toISODate(date);
  return new Intl.DateTimeFormat(locale, {
    ...DATE_STYLE_OPTIONS[style],
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

export function formatDateTime(value: DateInput, options: Omit<FormatDateOptions, "style"> = {}) {
  return formatDate(value, { ...options, style: "datetime" });
}

export interface FormatDateRangeOptions extends FormatOptions {
  style?: Exclude<DateFormatStyle, "iso" | "time">;
  fallback?: string;
}

/** "Sep 1 – 26, 2026" — collapses shared parts via Intl.DateTimeFormat#formatRange. */
export function formatDateRange(
  start: DateInput,
  end: DateInput,
  options: FormatDateRangeOptions = {},
): string {
  const { style = "date", fallback = "—", locale, timeZone } = options;
  const from = toDate(start);
  const to = toDate(end);
  if (!from && !to) return fallback;
  if (!from || !to) return formatDate(from ?? to, { style, locale, timeZone, fallback });
  const formatter = new Intl.DateTimeFormat(locale, {
    ...DATE_STYLE_OPTIONS[style],
    ...(timeZone ? { timeZone } : {}),
  });
  return typeof formatter.formatRange === "function"
    ? formatter.formatRange(from, to)
    : `${formatter.format(from)} – ${formatter.format(to)}`;
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

export interface FormatRelativeTimeOptions extends FormatOptions {
  /** Reference time. Default: now. */
  now?: DateInput;
  /**
   * After this many seconds the absolute date is shown instead
   * ("Sep 26, 2026"). Default: 7 days. Pass `Infinity` to always be relative.
   */
  maxRelativeSeconds?: number;
  fallback?: string;
}

/** "just now", "5 minutes ago", "in 2 days"; absolute date past `maxRelativeSeconds`. */
export function formatRelativeTime(
  value: DateInput,
  options: FormatRelativeTimeOptions = {},
): string {
  const { locale, timeZone, now, maxRelativeSeconds = 7 * 24 * 60 * 60, fallback = "—" } = options;
  const date = toDate(value);
  if (!date) return fallback;
  const reference = toDate(now) ?? new Date();
  const diffSeconds = Math.round((date.getTime() - reference.getTime()) / 1000);
  const abs = Math.abs(diffSeconds);
  if (abs > maxRelativeSeconds) return formatDate(date, { locale, timeZone });

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (abs < 45) return rtf.format(0, "second");
  for (const [unit, seconds] of RELATIVE_UNITS) {
    if (abs >= seconds) return rtf.format(Math.round(diffSeconds / seconds), unit);
  }
  return rtf.format(0, "second");
}

export interface FormatNumberOptions extends FormatOptions, Intl.NumberFormatOptions {
  fallback?: string;
}

export function formatNumber(
  value: number | string | null | undefined,
  options: FormatNumberOptions = {},
): string {
  const { locale, timeZone: _timeZone, fallback = "—", ...intl } = options;
  const num = typeof value === "string" ? Number(value) : value;
  if (num === null || num === undefined || Number.isNaN(num)) return fallback;
  return new Intl.NumberFormat(locale, intl).format(num);
}

export interface FormatCurrencyOptions extends FormatNumberOptions {
  /** ISO-4217 code. Default: provider currency, then "USD". */
  currency?: string;
  /** When true, `value` is in minor units (cents) and divided by 10^fractionDigits. */
  minorUnits?: boolean;
}

export function formatCurrency(
  value: number | string | null | undefined,
  options: FormatCurrencyOptions = {},
): string {
  const { currency = "USD", minorUnits = false, ...rest } = options;
  const num = typeof value === "string" ? Number(value) : value;
  if (num === null || num === undefined || Number.isNaN(num)) return rest.fallback ?? "—";
  let amount = num;
  if (minorUnits) {
    const digits =
      new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions()
        .maximumFractionDigits ?? 2;
    amount = num / 10 ** digits;
  }
  return formatNumber(amount, { style: "currency", currency, ...rest });
}

export function formatPercent(
  value: number | null | undefined,
  options: FormatNumberOptions = {},
): string {
  return formatNumber(value, { style: "percent", maximumFractionDigits: 1, ...options });
}

export interface PluralizeOptions extends FormatOptions {
  /** Plural form. Default: `${singular}s`. */
  plural?: string;
  /** Omit the number ("items" instead of "2 items"). */
  hideCount?: boolean;
}

/**
 * "1 item", "2 items", "1,204 orders". Uses Intl.PluralRules to pick the form
 * and Intl.NumberFormat for the count.
 */
export function pluralize(count: number, singular: string, options: PluralizeOptions = {}) {
  const { plural = `${singular}s`, hideCount = false, locale } = options;
  const rule = new Intl.PluralRules(locale).select(count);
  const word = rule === "one" ? singular : plural;
  return hideCount ? word : `${new Intl.NumberFormat(locale).format(count)} ${word}`;
}

// ---------------------------------------------------------------------------
// FormatProvider — app-wide locale/currency/timeZone defaults
// ---------------------------------------------------------------------------

export interface FormatContextValue {
  locale?: string | undefined;
  currency?: string | undefined;
  timeZone?: string | undefined;
}

const FormatContext = createContext<FormatContextValue>({});

export interface FormatProviderProps extends FormatContextValue {
  children: ReactNode;
}

export function FormatProvider({ locale, currency, timeZone, children }: FormatProviderProps) {
  const value = useMemo(() => ({ locale, currency, timeZone }), [locale, currency, timeZone]);
  return <FormatContext.Provider value={value}>{children}</FormatContext.Provider>;
}

/** Formatters bound to the nearest FormatProvider's locale/currency/timeZone. */
export function useFormatter() {
  const ctx = useContext(FormatContext);
  return useMemo(() => {
    const base = {
      ...(ctx.locale ? { locale: ctx.locale } : {}),
      ...(ctx.timeZone ? { timeZone: ctx.timeZone } : {}),
    };
    return {
      locale: ctx.locale,
      currencyCode: ctx.currency,
      timeZone: ctx.timeZone,
      date: (value: DateInput, options: FormatDateOptions = {}) =>
        formatDate(value, { ...base, ...options }),
      dateTime: (value: DateInput, options: Omit<FormatDateOptions, "style"> = {}) =>
        formatDateTime(value, { ...base, ...options }),
      dateRange: (start: DateInput, end: DateInput, options: FormatDateRangeOptions = {}) =>
        formatDateRange(start, end, { ...base, ...options }),
      relative: (value: DateInput, options: FormatRelativeTimeOptions = {}) =>
        formatRelativeTime(value, { ...base, ...options }),
      number: (value: number | string | null | undefined, options: FormatNumberOptions = {}) =>
        formatNumber(value, { ...base, ...options }),
      currency: (value: number | string | null | undefined, options: FormatCurrencyOptions = {}) =>
        formatCurrency(value, {
          ...base,
          ...(ctx.currency ? { currency: ctx.currency } : {}),
          ...options,
        }),
      percent: (value: number | null | undefined, options: FormatNumberOptions = {}) =>
        formatPercent(value, { ...base, ...options }),
      pluralize: (count: number, singular: string, options: PluralizeOptions = {}) =>
        pluralize(count, singular, { ...base, ...options }),
    };
  }, [ctx.locale, ctx.currency, ctx.timeZone]);
}
