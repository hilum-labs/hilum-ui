"use client";

import { type Ref, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { useShape } from "../lib/shape-context";

/**
 * Badge colours as CSS custom-property references to the categorical token
 * palette (`tokens.categorical` → `--categorical-<name>` in tokens.css).
 * Usable anywhere a CSS colour is accepted; for raw hex values (canvas, JS
 * colour math) read `tokens.categorical` from `@hilum/ui/tokens`.
 */
const badgeColors = {
  gray: "var(--categorical-gray)",
  red: "var(--categorical-red)",
  orange: "var(--categorical-orange)",
  amber: "var(--categorical-amber)",
  yellow: "var(--categorical-yellow)",
  lime: "var(--categorical-lime)",
  green: "var(--categorical-green)",
  emerald: "var(--categorical-emerald)",
  teal: "var(--categorical-teal)",
  cyan: "var(--categorical-cyan)",
  blue: "var(--categorical-blue)",
  indigo: "var(--categorical-indigo)",
  violet: "var(--categorical-violet)",
  purple: "var(--categorical-purple)",
  fuchsia: "var(--categorical-fuchsia)",
  pink: "var(--categorical-pink)",
  rose: "var(--categorical-rose)",
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

function Badge({
  ref,
  className,
  variant: variantProp = "solid",
  size = "md",
  color: colorProp,
  tone,
  children,
  style,
  ...props
}: BadgeProps & { ref?: Ref<HTMLSpanElement> | undefined }) {
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
      data-slot="badge"
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
}

Badge.displayName = "Badge";

export { Badge, badgeVariants, badgeColors, STATUS_TONE_BADGE };
export type { BadgeProps, BadgeColor, StatusTone };
