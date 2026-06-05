"use client";

import * as React from "react";
import { ResponsiveContainer, type TooltipContentProps } from "recharts";
import { cn } from "../lib/utils";
import { tokens } from "../tokens/tokens";

export const CHART_COLORS = {
  primary: tokens.semantic.light.primary,
  secondary: tokens.semantic.light.success,
  tertiary: tokens.semantic.light.warning,
  muted: tokens.semantic.light.mutedForeground,
  subtle: tokens.semantic.light.border,
  dark: tokens.semantic.light.foreground,
};

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: number;
}

function ChartContainer({ children, className, height = 300 }: ChartContainerProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
ChartContainer.displayName = "ChartContainer";

// Custom tooltip component styled to match the design system
interface ChartTooltipProps extends Partial<TooltipContentProps<number, string>> {
  labelClassName?: string;
}

function ChartTooltip({ active, payload, label, labelClassName }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-elevated">
      {label && <p className={cn("mb-1 label text-muted-foreground", labelClassName)}>{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="caption text-muted-foreground">{entry.name}:</span>
          <span className="caption font-medium text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
ChartTooltip.displayName = "ChartTooltip";

export { ChartContainer, ChartTooltip };

export {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  type TooltipProps as RechartsTooltipProps,
} from "recharts";
