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
    up: "text-muted-foreground bg-brand-secondary/30 rounded-full px-2 py-0.5 w-fit",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="label text-muted-foreground">{label}</p>
        {icon && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      <p className="heading-xl mt-2 text-foreground">{value}</p>
      {trend &&
        (() => {
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

StatCard.displayName = "StatCard";

export { StatCard };
