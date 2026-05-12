import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
}

function StatCard({ label, value, trend, icon, className }: StatCardProps) {
  const trendColor = {
    up: "text-taupe-800 bg-brand-secondary/30 rounded-full px-2 py-0.5 w-fit",
    down: "text-red-600",
    neutral: "text-taupe-400",
  };

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  return (
    <div className={cn("rounded-xl border border-taupe-100 bg-white p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="label text-taupe-400">{label}</p>
        {icon && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-taupe-50 text-taupe-400">
            {icon}
          </div>
        )}
      </div>
      <p className="heading-xl mt-2 text-taupe-900">{value}</p>
      {trend && (() => {
        const Icon = TrendIcon[trend.direction];
        return (
          <div className={cn("mt-2 flex items-center gap-1", trendColor[trend.direction])}>
            <Icon size={12} />
            <span className="caption font-medium">{trend.value}</span>
          </div>
        );
      })()}
    </div>
  );
}

export { StatCard };
