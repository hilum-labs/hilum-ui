"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { useShape } from "../lib/shape-context";
import { useDensity } from "../lib/density-context";
import { inputFocusWithinClasses } from "../lib/interaction";

interface InputNumberProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange"
> {
  value: number | null;
  onChange: (next: number) => void;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;
  /** Suffix shown after the number (e.g. "px", "mm", "°", "%"). */
  unit?: string | undefined;
  /** Number of decimals to display. Default: 0. */
  precision?: number | undefined;
  /** Text shown when value is null. Useful for mixed multi-selection values. */
  mixedLabel?: string | undefined;
  /** Calls onChange while typing instead of waiting for blur/Enter. */
  commitOnChange?: boolean | undefined;
  /**
   * Hides the up/down stepper buttons. Defaults to `true` under
   * data-density="compact" (editor chrome relies on arrow keys + label
   * scrubbing there) and `false` otherwise.
   */
  hideSteppers?: boolean | undefined;
  /**
   * Short prefix label rendered inside the field (e.g. "X", "W", an icon).
   * It doubles as a scrub handle: drag horizontally to change the value
   * (Shift = 10×), like Figma's inspector fields.
   */
  label?: React.ReactNode;
  /** Accessible name for the scrub handle when `label` is not plain text. */
  scrubLabel?: string | undefined;
  /**
   * Horizontal alignment of the number. Defaults to `"left"` when a `label`
   * is given or under compact density (value sits next to its label), and
   * `"right"` otherwise.
   */
  align?: "left" | "right" | undefined;
}

/** Pixels of pointer travel per step while scrubbing a label. */
const SCRUB_PX_PER_STEP = 2;

/**
 * Numeric input with up/down steppers, unit suffix, and arrow-key step (Shift = 10×).
 * Designed for designer property panels — see PHASE_0_AUDIT.md §P0.2.
 */
const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      value,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      unit,
      precision = 0,
      mixedLabel = "Mixed",
      commitOnChange = false,
      hideSteppers: hideSteppersProp,
      label,
      scrubLabel,
      align: alignProp,
      className,
      disabled,
      onBlur,
      onFocus,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const shape = useShape();
    const density = useDensity();
    const compact = density === "compact";
    const hideSteppers = hideSteppersProp ?? compact;
    const align = alignProp ?? (label !== undefined || compact ? "left" : "right");

    const formatValue = React.useCallback(
      (next: number | null) => (next === null ? mixedLabel : next.toFixed(precision)),
      [mixedLabel, precision],
    );

    const [text, setText] = React.useState<string>(formatValue(value));

    React.useEffect(() => {
      setText(formatValue(value));
    }, [formatValue, value]);

    const clamp = React.useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max]);

    const parseAndClamp = React.useCallback(
      (raw: string) => {
        const n = parseFloat(raw);
        if (Number.isFinite(n)) {
          return clamp(n);
        }
        return null;
      },
      [clamp],
    );

    const commit = (raw: string) => {
      const next = parseAndClamp(raw);
      if (next === null) {
        setText(formatValue(value));
        return;
      }
      onChange(next);
      setText(next.toFixed(precision));
    };

    const bump = (delta: number) => {
      const next = clamp((value ?? 0) + delta);
      onChange(next);
      setText(next.toFixed(precision));
    };

    // Label scrubbing — drag the prefix label to nudge the value.
    const scrubRef = React.useRef<{ x: number; start: number; last: number } | null>(null);
    const handleScrubDown = (e: React.PointerEvent<HTMLSpanElement>) => {
      if (disabled || rest.readOnly || e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      const start = value ?? 0;
      scrubRef.current = { x: e.clientX, start, last: start };
    };
    const handleScrubMove = (e: React.PointerEvent<HTMLSpanElement>) => {
      const scrub = scrubRef.current;
      if (!scrub) return;
      const steps = Math.round((e.clientX - scrub.x) / SCRUB_PX_PER_STEP);
      const next = clamp(scrub.start + steps * step * (e.shiftKey ? 10 : 1));
      const rounded = Number(next.toFixed(precision));
      if (rounded === scrub.last) return;
      scrub.last = rounded;
      onChange(rounded);
      setText(rounded.toFixed(precision));
    };
    const handleScrubEnd = (e: React.PointerEvent<HTMLSpanElement>) => {
      if (!scrubRef.current) return;
      scrubRef.current = null;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        bump(step * (e.shiftKey ? 10 : 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        bump(-step * (e.shiftKey ? 10 : 1));
      } else if (e.key === "Enter") {
        commit((e.target as HTMLInputElement).value);
      }
    };

    return (
      <div
        data-slot="input-number"
        className={cn(
          // w-48 ≈ the old intrinsic width of the native input (size=20), kept as an
          // overridable default; min-w-fit stops narrow widths clipping digits.
          "inline-flex h-8 w-48 min-w-fit items-stretch overflow-hidden border border-border bg-background",
          "transition-[border-color,box-shadow] duration-150 hover:border-border-strong",
          shape.input,
          "compact:h-6 compact:rounded-[5px]",
          inputFocusWithinClasses,
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
      >
        {label !== undefined && (
          <span
            aria-hidden
            title={scrubLabel}
            onPointerDown={handleScrubDown}
            onPointerMove={handleScrubMove}
            onPointerUp={handleScrubEnd}
            onPointerCancel={handleScrubEnd}
            className={cn(
              // Fixed-width prefix column so values in stacked fields line up.
              "flex w-6 shrink-0 cursor-ew-resize select-none items-center justify-center",
              "caption-xs font-medium leading-none text-muted-foreground transition-colors hover:text-foreground",
              "compact:w-5 compact:text-[11px] [&_svg]:size-3",
            )}
          >
            {label}
          </span>
        )}
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          spellCheck={false}
          // Neutralise the native 20-char intrinsic width so the container's
          // min-w-fit is driven by the explicit min-width below, not `size`.
          size={1}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (commitOnChange) {
              const next = parseAndClamp(e.target.value);
              if (next !== null) {
                onChange(next);
              }
            }
          }}
          onFocus={(e) => {
            if (value === null) {
              setText("");
            }
            onFocus?.(e);
          }}
          onBlur={(e) => {
            commit(e.target.value);
            onBlur?.(e);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label={
            typeof label === "string" && !rest["aria-labelledby"] ? label : undefined
          }
          className={cn(
            // min-width fits three tabular digits + padding so "100" never clips.
            "w-full min-w-[calc(3ch+1rem)] caption tabular-nums text-foreground px-2 bg-transparent focus:outline-none",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            "compact:min-w-[calc(3ch+0.75rem)] compact:px-1.5 compact:text-[12px]",
            label !== undefined && "pl-0.5 compact:pl-0.5",
            align === "right" ? "text-right" : "text-left",
          )}
          {...rest}
        />
        {unit && (
          <span
            aria-hidden
            className="caption-xs text-muted-foreground self-center pr-2 select-none compact:pr-1.5 compact:text-[11px]"
          >
            {unit}
          </span>
        )}
        {!hideSteppers && (
          <div className="flex w-5 shrink-0 flex-col border-l border-border">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => bump(step)}
              aria-label="Increment"
              className="flex flex-1 items-center justify-center text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active"
            >
              <svg viewBox="0 0 8 5" width="8" height="5" fill="currentColor" aria-hidden>
                <path d="M0 5 L4 0 L8 5 Z" />
              </svg>
            </button>
            <div className="border-t border-border" />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => bump(-step)}
              aria-label="Decrement"
              className="flex flex-1 items-center justify-center text-muted-foreground transition-colors hover:bg-hover hover:text-foreground active:bg-active"
            >
              <svg viewBox="0 0 8 5" width="8" height="5" fill="currentColor" aria-hidden>
                <path d="M0 0 L4 5 L8 0 Z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  },
);
InputNumber.displayName = "InputNumber";

export { InputNumber };
export type { InputNumberProps };
