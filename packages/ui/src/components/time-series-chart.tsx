"use client";

import * as React from "react";
import * as Recharts from "recharts";
import { cn } from "../lib/utils";
import { useFormatter, toDate, type DateInput } from "../lib/format";
import { usePrefersReducedMotion } from "../lib/motion-provider";
import { ChartContainer, type ChartConfig } from "./chart";
import { Skeleton } from "./skeleton";

/** One line / area of the chart. `key` is the field holding its values in each point. */
interface TimeSeriesChartSeries {
  /** Field name in each data point (use an identifier: letters, digits, `_`, `-`). */
  key: string;
  /** Legend and tooltip name, e.g. "Total sales". */
  label: string;
  /** Any CSS colour (tokens welcome: `var(--primary)`). Default: the Hilum series palette. */
  color?: string;
  /** Dashed stroke, e.g. the comparison period. */
  dashed?: boolean;
}

/** Where a formatted value is shown: a y-axis tick (keep it short) or the tooltip (full). */
interface TimeSeriesValueFormatInfo {
  context: "axis" | "tooltip";
}

type TimeSeriesValueFormat =
  "number" | "currency" | "percent" | ((value: number, info: TimeSeriesValueFormatInfo) => string);
type TimeSeriesDateFormat = Intl.DateTimeFormatOptions | ((date: Date) => string);

/** Localizable strings. Every entry has an English default. */
interface TimeSeriesChartLabels {
  /** Shown when there are no data points. */
  empty: string;
  /** Accessible name of the loading placeholder. */
  loading: string;
}

const TIME_SERIES_CHART_DEFAULT_LABELS: TimeSeriesChartLabels = {
  empty: "No data for this period",
  loading: "Loading chart",
};

/** Series colours in order: brand, neutral (comparison), then categorical hues. */
const SERIES_PALETTE = [
  "var(--primary)",
  "var(--muted-foreground)",
  "var(--categorical-blue)",
  "var(--categorical-orange)",
  "var(--categorical-teal)",
  "var(--categorical-pink)",
];

interface TimeSeriesChartProps {
  /** Points in date order. Each has a date (see `dateKey`) and a value per series key. */
  data: ReadonlyArray<Record<string, unknown>>;
  /** Field holding each point's date (Date, "YYYY-MM-DD", ISO string or timestamp). Default "date". */
  dateKey?: string;
  series: TimeSeriesChartSeries[];
  /** Filled area (default) or plain line. */
  variant?: "area" | "line";
  /** Chart height in px. Default 240. */
  height?: number;
  /**
   * Value formatting for the y-axis (compact) and tooltip (full): "number"
   * (default), "currency", "percent" (0.12 → 12%) or a function. A function
   * gets `{ context: "axis" | "tooltip" }` as its second argument, e.g.
   * `(value, { context }) => formatMoney(value, context === "axis" ? { notation: "compact" } : {})`.
   */
  valueFormat?: TimeSeriesValueFormat;
  /** ISO-4217 code for `valueFormat="currency"`. Default: FormatProvider currency, then USD. */
  currency?: string;
  /**
   * How `valueFormat="currency"` shows the currency, as in Intl /
   * `formatCurrency`: "symbol" (default: "$", "CA$", "S/" in es-PE, "PEN" in
   * en), "narrowSymbol" ("$" for CAD too), "code" ("PEN") or "name".
   */
  currencyDisplay?: Intl.NumberFormatOptions["currencyDisplay"];
  /**
   * Replaces Intl's currency sign on the axis and in the tooltip, e.g. "S/"
   * for PEN in an English locale, where Intl only has "PEN" (as in
   * `formatCurrency`).
   */
  currencySymbol?: string;
  /** Values are in minor units (cents) for `valueFormat="currency"`. */
  minorUnits?: boolean;
  /** X-axis tick format. Default: "Sep 26". */
  dateFormat?: TimeSeriesDateFormat;
  /** Tooltip heading format. Default: "Sep 26, 2026". */
  tooltipDateFormat?: TimeSeriesDateFormat;
  /** Show a skeleton instead of the chart. */
  loading?: boolean;
  /** Replaces the default empty message when `data` is empty. */
  emptyState?: React.ReactNode;
  /** Legend under the chart. Default: shown with more than one series. */
  showLegend?: boolean;
  /** Horizontal grid lines. Default true. */
  showGrid?: boolean;
  /** Accessible name of the chart, e.g. "Total sales over time". */
  "aria-label": string;
  /** Localizable strings; unspecified keys fall back to English. */
  labels?: Partial<TimeSeriesChartLabels>;
  className?: string;
}

const X_KEY = "__hilumDate";

function formatDatePart(date: Date, format: TimeSeriesDateFormat, locale: string | undefined) {
  return typeof format === "function"
    ? format(date)
    : new Intl.DateTimeFormat(locale, format).format(date);
}

interface TooltipPayloadEntry {
  dataKey?: unknown;
  value?: unknown;
  color?: string;
  payload?: Record<string, unknown>;
}

/**
 * High-level time-series chart for app dashboards (sales over time, orders
 * per day): dates on the x-axis, formatted values on the y-axis and in the
 * tooltip, loading and empty states, Hilum token colours and reduced motion.
 * Built on ChartContainer (Recharts), so apps don't import chart primitives.
 */
function TimeSeriesChart({
  data,
  dateKey = "date",
  series,
  variant = "area",
  height = 240,
  valueFormat = "number",
  currency,
  currencyDisplay = "symbol",
  currencySymbol,
  minorUnits = false,
  dateFormat = { month: "short", day: "numeric" },
  tooltipDateFormat = { month: "short", day: "numeric", year: "numeric" },
  loading = false,
  emptyState,
  showLegend,
  showGrid = true,
  "aria-label": ariaLabel,
  labels: labelsProp,
  className,
}: TimeSeriesChartProps) {
  const labels = { ...TIME_SERIES_CHART_DEFAULT_LABELS, ...labelsProp };
  const fmt = useFormatter();
  const reducedMotion = usePrefersReducedMotion();
  const gradientId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const resolvedSeries = series.map((item, index) => ({
    ...item,
    color: item.color ?? SERIES_PALETTE[index % SERIES_PALETTE.length]!,
  }));
  const config: ChartConfig = Object.fromEntries(
    resolvedSeries.map((item) => [item.key, { label: item.label, color: item.color }]),
  );

  const formatValue = (value: number, compact: boolean): string => {
    if (typeof valueFormat === "function") {
      return valueFormat(value, { context: compact ? "axis" : "tooltip" });
    }
    const notation = compact ? ({ notation: "compact" } as const) : {};
    if (valueFormat === "currency") {
      return fmt.currency(value, {
        ...(currency ? { currency } : {}),
        currencyDisplay,
        ...(currencySymbol !== undefined ? { currencySymbol } : {}),
        minorUnits,
        ...notation,
        ...(compact ? { maximumFractionDigits: 1 } : {}),
      });
    }
    if (valueFormat === "percent") return fmt.percent(value, notation);
    return fmt.number(value, notation);
  };

  const points = React.useMemo(
    () =>
      data.flatMap((point) => {
        const date = toDate(point[dateKey] as DateInput);
        return date ? [{ ...point, [X_KEY]: date.getTime() }] : [];
      }),
    [data, dateKey],
  );

  const showLegendResolved = showLegend ?? resolvedSeries.length > 1;

  if (loading) {
    return (
      <div
        data-slot="time-series-chart"
        data-state="loading"
        role="status"
        aria-label={labels.loading}
        className={cn("w-full", className)}
      >
        <Skeleton className="w-full rounded-lg" style={{ height }} />
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div
        data-slot="time-series-chart"
        data-state="empty"
        className={cn(
          "flex w-full items-center justify-center rounded-lg border border-dashed border-border text-center",
          className,
        )}
        style={{ height }}
      >
        {emptyState ?? <p className="body-sm font-normal text-muted-foreground">{labels.empty}</p>}
      </div>
    );
  }

  const renderTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: ReadonlyArray<TooltipPayloadEntry>;
    label?: unknown;
  }) => {
    if (!active || !payload?.length) return null;
    const date = typeof label === "number" ? new Date(label) : null;
    return (
      <div
        data-slot="time-series-chart-tooltip"
        className="grid min-w-36 gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2 text-xs shadow-elevated"
      >
        {date && (
          <p className="font-medium text-foreground">
            {formatDatePart(date, tooltipDateFormat, fmt.locale)}
          </p>
        )}
        {resolvedSeries.map((item) => {
          const entry = payload.find((p) => p.dataKey === item.key);
          const value = typeof entry?.value === "number" ? entry.value : null;
          return (
            <div key={item.key} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-[2px] bg-(--series-color)"
                style={{ "--series-color": item.color } as React.CSSProperties}
              />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{item.label}</span>
              <span className="font-medium tabular-nums text-foreground">
                {value === null ? "—" : formatValue(value, false)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const Chart = variant === "area" ? Recharts.AreaChart : Recharts.LineChart;

  return (
    <div
      data-slot="time-series-chart"
      data-state="ready"
      role="figure"
      aria-label={ariaLabel}
      className={cn("w-full min-w-0", className)}
    >
      <ChartContainer config={config} height={height} className="w-full">
        <Chart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} accessibilityLayer>
          {variant === "area" && (
            <defs>
              {resolvedSeries.map((item) => (
                <linearGradient
                  key={item.key}
                  id={`${gradientId}-${item.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={`var(--color-${item.key})`} stopOpacity={0.24} />
                  <stop offset="100%" stopColor={`var(--color-${item.key})`} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
          )}
          {showGrid && <Recharts.CartesianGrid vertical={false} strokeDasharray="3 3" />}
          <Recharts.XAxis
            dataKey={X_KEY}
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={(value: number) =>
              formatDatePart(new Date(value), dateFormat, fmt.locale)
            }
          />
          <Recharts.YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            width={56}
            tickFormatter={(value: number) => formatValue(value, true)}
          />
          <Recharts.Tooltip
            cursor={{ stroke: "var(--border)" }}
            isAnimationActive={!reducedMotion}
            content={renderTooltip as never}
          />
          {resolvedSeries.map((item) =>
            variant === "area" ? (
              <Recharts.Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={`var(--color-${item.key})`}
                strokeWidth={2}
                {...(item.dashed ? { strokeDasharray: "4 4" } : {})}
                fill={item.dashed ? "none" : `url(#${gradientId}-${item.key})`}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={!reducedMotion}
                connectNulls
              />
            ) : (
              <Recharts.Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={`var(--color-${item.key})`}
                strokeWidth={2}
                {...(item.dashed ? { strokeDasharray: "4 4" } : {})}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={!reducedMotion}
                connectNulls
              />
            ),
          )}
        </Chart>
      </ChartContainer>
      {showLegendResolved && (
        <ul data-slot="time-series-chart-legend" className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {resolvedSeries.map((item) => (
            <li key={item.key} className="flex items-center gap-1.5 caption text-muted-foreground">
              <span
                aria-hidden="true"
                className={cn(
                  "h-0.5 w-3 shrink-0 rounded-full bg-(--series-color)",
                  item.dashed && "bg-transparent border-t-2 border-dashed border-(--series-color)",
                )}
                style={{ "--series-color": item.color } as React.CSSProperties}
              />
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

TimeSeriesChart.displayName = "TimeSeriesChart";

export { TimeSeriesChart, TIME_SERIES_CHART_DEFAULT_LABELS };
export type {
  TimeSeriesChartLabels,
  TimeSeriesChartProps,
  TimeSeriesChartSeries,
  TimeSeriesDateFormat,
  TimeSeriesValueFormat,
  TimeSeriesValueFormatInfo,
};
