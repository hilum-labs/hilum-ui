import * as React from "react";
import { cn } from "../lib/utils";

type UsageBarTone = "primary" | "warning" | "destructive" | "success" | "muted";
type UsageBarLayout = "stacked" | "inline";

interface UsageBarProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  value?: number;
  max?: number;
  percent?: number;
  valueLabel?: React.ReactNode;
  showPercent?: boolean;
  layout?: UsageBarLayout;
  tone?: UsageBarTone;
  barClassName?: string;
  indicatorClassName?: string;
}

const toneClassName: Record<UsageBarTone, string> = {
  primary: "bg-primary",
  warning: "bg-warning",
  destructive: "bg-destructive",
  success: "bg-success",
  muted: "bg-muted-foreground",
};

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
}

function inferTone(percent: number): UsageBarTone {
  if (percent >= 90) return "destructive";
  if (percent >= 75) return "warning";
  return "primary";
}

function formatUsageValue(value: number | undefined, max: number | undefined) {
  if (typeof value !== "number" || typeof max !== "number") return undefined;
  return `${value.toLocaleString()} / ${max.toLocaleString()}`;
}

function UsageBar({
  label,
  value,
  max,
  percent,
  valueLabel,
  showPercent,
  layout = "stacked",
  tone,
  className,
  barClassName,
  indicatorClassName,
  ...props
}: UsageBarProps) {
  const resolvedPercent = clampPercent(
    typeof percent === "number" ? percent : max && max > 0 && typeof value === "number" ? (value / max) * 100 : 0,
  );
  const resolvedTone = tone ?? inferTone(resolvedPercent);
  const resolvedValueLabel = valueLabel ?? formatUsageValue(value, max);
  const percentLabel = `${Math.round(resolvedPercent)}%`;

  const bar = (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", layout === "inline" && "w-28", barClassName)}
      aria-hidden="true"
    >
      <div
        className={cn("h-full rounded-full transition-all", toneClassName[resolvedTone], indicatorClassName)}
        style={{ width: `${resolvedPercent}%` }}
      />
    </div>
  );

  if (layout === "inline") {
    return (
      <div className={cn("flex min-w-0 items-center gap-2", className)} {...props}>
        {label ? <span className="caption shrink-0 text-muted-foreground">{label}</span> : null}
        {bar}
        {showPercent !== false ? (
          <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground">{percentLabel}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {(label || resolvedValueLabel || showPercent) && (
        <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
          {label ? <span className="min-w-0 truncate text-muted-foreground">{label}</span> : <span />}
          <span className="shrink-0 font-medium tabular-nums text-foreground">
            {resolvedValueLabel ?? (showPercent ? percentLabel : null)}
          </span>
        </div>
      )}
      {bar}
    </div>
  );
}

export { UsageBar };
export type { UsageBarProps, UsageBarLayout, UsageBarTone };
