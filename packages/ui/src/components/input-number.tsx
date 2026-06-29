"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { useShape } from "../lib/shape-context";

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
  /** Hides the up/down stepper buttons. */
  hideSteppers?: boolean | undefined;
}

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
      hideSteppers = false,
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
        className={cn(
          "inline-flex h-8 items-stretch overflow-hidden border border-border bg-background",
          shape.input,
          "focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
      >
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          spellCheck={false}
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
          className="w-full caption text-foreground px-2 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-right"
          {...rest}
        />
        {unit && (
          <span
            aria-hidden
            className="caption-xs text-muted-foreground self-center pr-1.5 select-none"
          >
            {unit}
          </span>
        )}
        {!hideSteppers && (
          <div className="flex flex-col border-l border-border">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => bump(step)}
              aria-label="Increment"
              className="flex-1 px-1 hover:bg-muted active:bg-muted transition-colors text-muted-foreground"
            >
              <svg viewBox="0 0 8 5" width="8" height="5" fill="currentColor">
                <path d="M0 5 L4 0 L8 5 Z" />
              </svg>
            </button>
            <div className="border-t border-border" />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => bump(-step)}
              aria-label="Decrement"
              className="flex-1 px-1 hover:bg-muted active:bg-muted transition-colors text-muted-foreground"
            >
              <svg viewBox="0 0 8 5" width="8" height="5" fill="currentColor">
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
