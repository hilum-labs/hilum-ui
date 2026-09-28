"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/utils";

/** Localizable strings. Every entry has an English default. */
interface RatingLabels {
  /** Accessible name of the read-only variant — "4.5 out of 5 stars". `value` is already formatted. */
  summary: (value: string, max: number) => string;
  /** Accessible name of each radio in the interactive variant — "3 stars". */
  star: (value: number) => string;
}

const RATING_DEFAULT_LABELS: RatingLabels = {
  summary: (value, max) => `${value} out of ${max} stars`,
  star: (value) => `${value} star${value === 1 ? "" : "s"}`,
};

interface RatingProps {
  /** Current rating; fractional values render partial stars (read-only). */
  value: number;
  /** Number of stars. Default: 5. */
  max?: number;
  /** When set, renders an interactive radio group (whole stars). */
  onValueChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  /** Show "4.5" after the stars. */
  showValue?: boolean;
  /** Optional count after the value, e.g. "(128)". */
  count?: number;
  /** Accessible name for the interactive variant. Default: "Rating". */
  label?: string;
  /** Localizable strings; unspecified keys fall back to English. */
  labels?: Partial<RatingLabels>;
  disabled?: boolean;
  className?: string;
}

const SIZE: Record<NonNullable<RatingProps["size"]>, number> = { sm: 12, md: 16, lg: 20 };

/**
 * Star rating. Read-only by default (reviews, product cards); pass
 * `onValueChange` for an accessible radio-group input. Colours are tokens
 * (`foreground` fill on a `border` track) so it works in every theme.
 */
function Rating({
  value,
  max = 5,
  onValueChange,
  size = "md",
  showValue = false,
  count,
  label = "Rating",
  labels: labelsProp,
  disabled = false,
  className,
}: RatingProps) {
  const labels = { ...RATING_DEFAULT_LABELS, ...labelsProp };
  const px = SIZE[size];
  const clamped = Math.max(0, Math.min(max, value));
  const [hover, setHover] = React.useState<number | null>(null);
  const name = React.useId();

  const summary = (showValue || count !== undefined) && (
    <span className="caption tabular-nums text-muted-foreground">
      {showValue && clamped.toFixed(1)}
      {count !== undefined && ` (${new Intl.NumberFormat().format(count)})`}
    </span>
  );

  if (!onValueChange) {
    return (
      <span
        role="img"
        aria-label={labels.summary(clamped.toFixed(1), max)}
        className={cn("inline-flex items-center gap-1.5", className)}
        data-slot="rating"
      >
        <span className="inline-flex items-center gap-0.5" aria-hidden="true">
          {Array.from({ length: max }, (_, i) => {
            const fill = Math.max(0, Math.min(1, clamped - i));
            return (
              <span key={i} className="relative inline-flex" style={{ width: px, height: px }}>
                <Star size={px} className="fill-current text-border" strokeWidth={0} />
                {fill > 0 && (
                  <span
                    className="absolute inset-y-0 start-0 overflow-hidden"
                    style={{ width: `${fill * 100}%` }}
                  >
                    <Star size={px} className="fill-current text-foreground" strokeWidth={0} />
                  </span>
                )}
              </span>
            );
          })}
        </span>
        {summary}
      </span>
    );
  }

  const shown = hover ?? Math.round(clamped);
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} data-slot="rating">
      {/* Hover preview only; keyboard users move through the native radios. */}
      <span onMouseLeave={() => setHover(null)} className="inline-flex">
        <span role="radiogroup" aria-label={label} className="inline-flex items-center gap-0.5">
          {Array.from({ length: max }, (_, i) => {
            const starValue = i + 1;
            const checked = Math.round(clamped) === starValue;
            return (
              <label
                key={starValue}
                className={cn(
                  "inline-flex cursor-pointer rounded-sm has-focus-visible:ring-2 has-focus-visible:ring-ring",
                  disabled && "cursor-not-allowed opacity-50",
                )}
                onMouseEnter={() => !disabled && setHover(starValue)}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={name}
                  value={starValue}
                  checked={checked}
                  disabled={disabled}
                  aria-label={labels.star(starValue)}
                  onChange={() => onValueChange(starValue)}
                />
                <Star
                  size={px}
                  strokeWidth={0}
                  aria-hidden="true"
                  className={cn(
                    "fill-current transition-colors",
                    starValue <= shown ? "text-foreground" : "text-border",
                  )}
                />
              </label>
            );
          })}
        </span>
      </span>
      {summary}
    </span>
  );
}

Rating.displayName = "Rating";

export { Rating, RATING_DEFAULT_LABELS };
export type { RatingProps, RatingLabels };
