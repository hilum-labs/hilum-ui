"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface InputNumberProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange"
> {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Suffix shown after the number (e.g. "px", "mm", "°", "%"). */
  unit?: string;
  /** Number of decimals to display. Default: 0. */
  precision?: number;
  /** Hides the up/down stepper buttons. */
  hideSteppers?: boolean;
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
      hideSteppers = false,
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [text, setText] = React.useState<string>(value.toFixed(precision));

    React.useEffect(() => {
      setText(value.toFixed(precision));
    }, [value, precision]);

    const clamp = React.useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max]);

    const commit = (raw: string) => {
      const n = parseFloat(raw);
      if (Number.isFinite(n)) {
        const next = clamp(n);
        onChange(next);
        setText(next.toFixed(precision));
      } else {
        setText(value.toFixed(precision));
      }
    };

    const bump = (delta: number) => {
      const next = clamp(value + delta);
      onChange(next);
      setText(next.toFixed(precision));
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
          "inline-flex h-8 items-stretch rounded-md border border-taupe-200 bg-white overflow-hidden",
          "focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:border-brand-primary",
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
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          className="w-full caption text-taupe-900 px-2 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-right"
          {...rest}
        />
        {unit && (
          <span aria-hidden className="caption-xs text-taupe-400 self-center pr-1.5 select-none">
            {unit}
          </span>
        )}
        {!hideSteppers && (
          <div className="flex flex-col border-l border-taupe-100">
            <button
              type="button"
              tabIndex={-1}
              onClick={() => bump(step)}
              aria-label="Increment"
              className="flex-1 px-1 hover:bg-taupe-50 active:bg-taupe-100 transition-colors text-taupe-500"
            >
              <svg viewBox="0 0 8 5" width="8" height="5" fill="currentColor">
                <path d="M0 5 L4 0 L8 5 Z" />
              </svg>
            </button>
            <div className="border-t border-taupe-100" />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => bump(-step)}
              aria-label="Decrement"
              className="flex-1 px-1 hover:bg-taupe-50 active:bg-taupe-100 transition-colors text-taupe-500"
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
