"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { useShape } from "../lib/shape-context";
import { useDensity } from "../lib/density-context";
import {
  controlHeightClass,
  controlInvalidWithinClasses,
  controlSurfaceClasses,
  controlTextClass,
  inputFocusWithinClasses,
} from "../lib/interaction";
import { useFormatter } from "../lib/format";
import { isAriaInvalid, useFieldControl } from "../lib/field-context";

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
  /**
   * BCP-47 locale for displaying and parsing the number (decimal/group
   * separators, digits). Defaults to the nearest FormatProvider's locale, then
   * `"en-US"` (deterministic across server and client).
   */
  locale?: string | undefined;
  /**
   * Extra Intl.NumberFormat options. By default the value is shown with
   * `precision` fraction digits and no grouping; set `useGrouping: true` for
   * "1,234". `style: "percent"` formats 0.5 as "50%" (and parses it back).
   */
  formatOptions?: Intl.NumberFormatOptions | undefined;
  /** Localizable strings. Every entry has an English default. */
  labels?: Partial<InputNumberLabels> | undefined;
}

/** Localizable strings. Every entry has an English default. */
interface InputNumberLabels {
  /** Accessible name of the step-up button. */
  increment: string;
  /** Accessible name of the step-down button. */
  decrement: string;
}

const INPUT_NUMBER_DEFAULT_LABELS: InputNumberLabels = {
  increment: "Increment",
  decrement: "Decrement",
};

interface NumberCodec {
  format: (n: number) => string;
  parse: (raw: string) => number | null;
}

/** Build a locale-aware formatter + parser pair around Intl.NumberFormat. */
function createNumberCodec(
  locale: string,
  precision: number,
  formatOptions: Intl.NumberFormatOptions | undefined,
): NumberCodec {
  let formatter: Intl.NumberFormat;
  try {
    formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
      useGrouping: false,
      ...formatOptions,
    });
  } catch {
    formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
      useGrouping: false,
    });
  }

  // Discover separators with grouping forced on — the display formatter may
  // have grouping off, but users still type/paste grouped numbers.
  const resolvedLocale = formatter.resolvedOptions().locale;
  const parts = new Intl.NumberFormat(resolvedLocale, {
    useGrouping: true,
    minimumFractionDigits: 1,
  }).formatToParts(-12345.6);
  const group = parts.find((p) => p.type === "group")?.value;
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  // Locale digits (e.g. Arabic-Indic) → ASCII.
  const digitFormatter = new Intl.NumberFormat(resolvedLocale, {
    useGrouping: false,
  });
  const digitMap = new Map<string, string>();
  for (let d = 0; d <= 9; d++) digitMap.set(digitFormatter.format(d), String(d));
  const isPercent = formatter.resolvedOptions().style === "percent";

  const parse = (raw: string): number | null => {
    let s = raw.trim();
    if (!s) return null;
    s = Array.from(s, (ch) => digitMap.get(ch) ?? ch).join("");
    // Spaces (incl. NBSP / narrow NBSP) are always grouping noise.
    s = s.replace(/[\s\u00a0\u202f]/g, "");
    if (group && group.trim()) s = s.split(group).join("");
    if (decimal !== ".") s = s.split(decimal).join(".");
    s = s.replace(/[\u2212\u2012\u2013\u2014]/g, "-");
    // Drop currency symbols, percent signs and unit text around the number.
    const match = s.match(/[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/i);
    if (!match) return null;
    const n = parseFloat(match[0]);
    if (!Number.isFinite(n)) return null;
    return isPercent ? n / 100 : n;
  };

  return { format: (n) => formatter.format(n), parse };
}

/** Pixels of pointer travel per step while scrubbing a label. */
const SCRUB_PX_PER_STEP = 2;

/**
 * Numeric input (ARIA spinbutton) with up/down steppers, unit suffix and
 * keyboard stepping: Arrow Up/Down = step (Shift = 10×), PageUp/PageDown =
 * 10 steps, Home/End = min/max. Display and parsing are locale-aware.
 * Designed for designer property panels — see PHASE_0_AUDIT.md §P0.2.
 */
function InputNumber({
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
  locale: localeProp,
  formatOptions,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  labels: labelsProp,
  ref,
  ...rest
}: InputNumberProps) {
  const labels = { ...INPUT_NUMBER_DEFAULT_LABELS, ...labelsProp };
  const shape = useShape();
  const { locale: providerLocale } = useFormatter();
  const locale = localeProp ?? providerLocale ?? "en-US";
  const fieldProps = useFieldControl({
    id,
    disabled,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
  });
  const isDisabled = fieldProps.disabled ?? false;
  // Stable key so an inline `formatOptions={{…}}` doesn't rebuild the codec every render.
  const formatOptionsKey = JSON.stringify(formatOptions ?? null);
  const codec = React.useMemo(
    () => createNumberCodec(locale, precision, formatOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, precision, formatOptionsKey],
  );
  const density = useDensity();
  const compact = density === "compact";
  const hideSteppers = hideSteppersProp ?? compact;
  const align = alignProp ?? (label !== undefined || compact ? "left" : "right");

  const formatValue = React.useCallback(
    (next: number | null) => (next === null ? mixedLabel : codec.format(next)),
    [mixedLabel, codec],
  );

  const [text, setText] = React.useState<string>(formatValue(value));

  React.useEffect(() => {
    setText(formatValue(value));
  }, [formatValue, value]);

  const clamp = React.useCallback((n: number) => Math.min(max, Math.max(min, n)), [min, max]);

  const parseAndClamp = React.useCallback(
    (raw: string) => {
      const n = codec.parse(raw);
      return n === null ? null : clamp(n);
    },
    [clamp, codec],
  );

  const commit = (raw: string) => {
    const next = parseAndClamp(raw);
    if (next === null) {
      setText(formatValue(value));
      return;
    }
    onChange(next);
    setText(formatValue(next));
  };

  const bump = (delta: number) => {
    // Round to the display precision so repeated steps don't accumulate
    // floating-point drift (0.1 + 0.2 …).
    const next = clamp(Number(((value ?? 0) + delta).toFixed(Math.max(precision, 10))));
    onChange(next);
    setText(formatValue(next));
  };

  const jumpTo = (target: number) => {
    if (!Number.isFinite(target)) return;
    onChange(target);
    setText(formatValue(target));
  };

  // Label scrubbing — drag the prefix label to nudge the value.
  const scrubRef = React.useRef<{ x: number; start: number; last: number } | null>(null);
  const handleScrubDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (isDisabled || rest.readOnly || e.button !== 0) return;
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
    setText(formatValue(rounded));
  };
  const handleScrubEnd = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!scrubRef.current) return;
    scrubRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;

    if (rest.readOnly && e.key !== "Enter") return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      bump(step * (e.shiftKey ? 10 : 1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      bump(-step * (e.shiftKey ? 10 : 1));
    } else if (e.key === "PageUp") {
      e.preventDefault();
      bump(step * 10);
    } else if (e.key === "PageDown") {
      e.preventDefault();
      bump(-step * 10);
    } else if (e.key === "Home" && Number.isFinite(min)) {
      e.preventDefault();
      jumpTo(min);
    } else if (e.key === "End" && Number.isFinite(max)) {
      e.preventDefault();
      jumpTo(max);
    } else if (e.key === "Enter") {
      commit((e.target as HTMLInputElement).value);
    }
  };

  return (
    <div
      data-slot="input-number"
      data-invalid={isAriaInvalid(fieldProps["aria-invalid"]) ? "" : undefined}
      className={cn(
        // w-48 ≈ the old intrinsic width of the native input (size=20), kept as an
        // overridable default; min-w-fit stops narrow widths clipping digits.
        "inline-flex w-48 min-w-fit items-stretch overflow-hidden",
        controlHeightClass,
        controlSurfaceClasses,
        "transition-[background-color,border-color,box-shadow] duration-150",
        shape.input,
        "compact:h-6 compact:rounded-[5px]",
        inputFocusWithinClasses,
        controlInvalidWithinClasses,
        isDisabled && "opacity-50 pointer-events-none",
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
            // Only the prefix is fixed: the unit suffix (also aria-hidden) sizes to its text.
            "flex w-6 shrink-0 cursor-ew-resize select-none items-center justify-center",
            "caption-xs font-medium leading-none text-muted-foreground transition-colors hover:text-foreground",
            "compact:w-[22px] compact:text-[11px] compact:font-normal [&_svg]:size-3",
          )}
        >
          {label}
        </span>
      )}
      <input
        ref={ref}
        type="text"
        role="spinbutton"
        inputMode="decimal"
        aria-valuenow={value ?? undefined}
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-valuetext={
          value === null ? mixedLabel : unit ? `${formatValue(value)} ${unit}` : formatValue(value)
        }
        {...fieldProps}
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
        aria-label={typeof label === "string" && !rest["aria-labelledby"] ? label : undefined}
        className={cn(
          // min-width fits three tabular digits + padding so "100" never clips.
          "w-full min-w-[calc(3ch+1rem)] tabular-nums text-foreground px-2 bg-transparent focus:outline-none",
          controlTextClass,
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          "compact:min-w-[calc(3ch+0.75rem)] compact:px-1.5 compact:text-[12px]",
          label !== undefined && "ps-0.5 compact:ps-0.5",
          align === "right" ? "text-end" : "text-start",
        )}
        {...rest}
      />
      {unit && (
        <span
          aria-hidden
          className="caption-xs text-muted-foreground self-center pe-2 select-none compact:pe-1.5 compact:text-[11px]"
        >
          {unit}
        </span>
      )}
      {!hideSteppers && (
        <div className="flex w-5 shrink-0 flex-col border-s border-border">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => bump(step)}
            aria-label={labels.increment}
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
            aria-label={labels.decrement}
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
}
InputNumber.displayName = "InputNumber";

export { InputNumber };
export { INPUT_NUMBER_DEFAULT_LABELS };
export type { InputNumberProps, InputNumberLabels };
