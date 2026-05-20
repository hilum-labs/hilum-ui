"use client";

import * as React from "react";
import { ResponsiveContainer, type TooltipContentProps } from "recharts";
import { cn } from "../lib/utils";
import { tokens } from "../tokens/tokens";

export const CHART_COLORS = {
  primary: tokens.brand.primary,           // "#C100F1" — vivid purple
  secondary: tokens.semantic.light.success, // "#CDEA19" — lime
  tertiary: tokens.brand.secondary,         // "#FFF5BF" — pale lemon
  muted: tokens.ground[400],                 // "#a8978a"
  subtle: tokens.ground[200],                // "#e3dcd4"
  dark: tokens.ground[900],                  // "#26181a"
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
    <div className="rounded-xl border border-ground-100 bg-white px-3 py-2 shadow-elevated">
      {label && <p className={cn("mb-1 label text-ground-400", labelClassName)}>{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="caption text-ground-500">{entry.name}:</span>
          <span className="caption font-medium text-ground-900">{entry.value}</span>
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
