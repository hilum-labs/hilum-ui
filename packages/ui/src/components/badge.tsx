"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { useShape } from "../lib/shape-context";

const badgeColors = {
  gray: "#a3a3a3",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
} as const;

type BadgeColor = keyof typeof badgeColors;

/**
 * Semantic tones — the convention every product surface should use instead
 * of picking badge colours by hand:
 *
 * - `success`   — finished and healthy: paid, fulfilled, active, delivered.
 * - `info`      — in motion, nothing to do yet: processing, shipped, scheduled.
 * - `attention` — needs a merchant action soon: unfulfilled, partially paid, on hold.
 * - `warning`   — at risk / waiting on someone else: pending, past due, expiring.
 * - `critical`  — failed or blocked: failed, cancelled, suspended, declined.
 * - `neutral`   — inactive or terminal-but-fine: draft, archived, refunded, closed.
 */
type StatusTone = "success" | "info" | "attention" | "warning" | "critical" | "neutral";

type ToneBadgeVariant = "success" | "brand" | "warning" | "destructive" | "secondary";

const STATUS_TONE_BADGE: Record<StatusTone, { variant: ToneBadgeVariant; color?: BadgeColor }> = {
  success: { variant: "success" },
  info: { variant: "brand", color: "blue" },
  attention: { variant: "warning", color: "orange" },
  warning: { variant: "warning" },
  critical: { variant: "destructive" },
  neutral: { variant: "secondary" },
};

const badgeVariants = cva("inline-flex items-center font-medium whitespace-nowrap", {
  variants: {
    variant: {
      default: "",
      secondary: "",
      outline: "border border-border text-foreground",
      brand: "",
      success: "",
      warning: "",
      destructive: "",
      solid: "",
      dot: "border border-border text-foreground",
    },
    size: {
      sm: "h-5 px-2 text-[11px] gap-1",
      md: "h-6 px-2.5 text-[12px] gap-1.5",
      lg: "h-7 px-3 text-[13px] gap-1.5",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color">, VariantProps<typeof badgeVariants> {
  color?: BadgeColor;
  /** Semantic tone — wins over `variant`/`color`. See `StatusTone`. */
  tone?: StatusTone;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant: variantProp = "solid", size = "md", color: colorProp, tone, children, style, ...props },
    ref,
  ) => {
    const shape = useShape();
    const toneBadge = tone ? STATUS_TONE_BADGE[tone] : undefined;
    const variant = toneBadge?.variant ?? variantProp;
    const color = toneBadge?.color ?? colorProp;
    const resolvedColor =
      color ??
      (variant === "brand"
        ? "blue"
        : variant === "success"
          ? "green"
          : variant === "warning"
            ? "amber"
            : variant === "destructive"
              ? "red"
              : "gray");
    const colorValue = badgeColors[resolvedColor];
    const isSolid = variant !== "dot" && variant !== "outline";
    const dotSize = size === "sm" ? 6 : size === "lg" ? 8 : 7;

    const colorStyle = isSolid
      ? resolvedColor === "gray"
        ? { backgroundColor: "var(--accent)", color: "var(--foreground)" }
        : {
            color: "var(--foreground)",
            backgroundColor: `color-mix(in srgb, ${colorValue} 15%, var(--background))`,
          }
      : {};

    const dotColor = resolvedColor === "gray" ? "var(--muted-foreground)" : colorValue;

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), shape.item, className)}
        {...(tone ? { "data-tone": tone } : {})}
        style={{ ...colorStyle, ...style }}
        {...props}
      >
        {!isSolid && (
          <span
            className="shrink-0 rounded-full"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: dotColor,
            }}
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, badgeColors, STATUS_TONE_BADGE };
export type { BadgeProps, BadgeColor, StatusTone };
