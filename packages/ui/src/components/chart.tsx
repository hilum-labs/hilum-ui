"use client";

import * as React from "react";
import { ResponsiveContainer, type TooltipContentProps } from "recharts";
import { cn } from "../lib/utils";

// Color palette for charts
export const CHART_COLORS = {
  primary: "#FF4D01", // brand-primary
  secondary: "#CDEA19", // brand-secondary
  tertiary: "#FDE086", // brand-secondary
  muted: "#a8978a", // taupe-400
  subtle: "#e3dcd4", // taupe-200
  dark: "#26181a", // taupe-900
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
    <div className="rounded-xl border border-taupe-100 bg-white px-3 py-2 shadow-elevated">
      {label && <p className={cn("mb-1 label text-taupe-400", labelClassName)}>{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="caption text-taupe-500">{entry.name}:</span>
          <span className="caption font-medium text-taupe-900">{entry.value}</span>
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
