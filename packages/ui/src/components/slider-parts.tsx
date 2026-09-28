"use client";

// Shared internals for Slider / SliderComfortable (not part of the public API).

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
} from "react";
import { motion, useTransform, type MotionValue } from "../lib/motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { fontWeights } from "../lib/font-weight";
import { useShape } from "../lib/shape-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SliderValue = number | [number, number];
export type ValuePosition = "left" | "right" | "top" | "bottom" | "tooltip";

/** Localizable strings. Every entry has an English default. */
export interface SliderLabels {
  /** Accessible name of each thumb of a range slider. `name` is `aria-label` / `label`, when set. */
  rangeThumb: (name: string | undefined, thumb: "start" | "end") => string;
  /**
   * Accessible name of the click-to-edit value control. `thumb` is set for range
   * sliders; `value` (already formatted) is set for the button, not the input.
   */
  editValue: (thumb: "start" | "end" | undefined, value: string | undefined) => string;
}

export const SLIDER_DEFAULT_LABELS: SliderLabels = {
  rangeThumb: (name, thumb) => `${name ? `${name} ` : ""}${thumb}`,
  editValue: (thumb, value) =>
    `Edit slider value${thumb ? ` (${thumb})` : ""}${value !== undefined ? `: ${value}` : ""}`,
};

export interface SliderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: SliderValue | number[];
  defaultValue?: number[];
  onChange?: (value: SliderValue) => void;
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  showSteps?: boolean;
  showValue?: boolean;
  valuePosition?: ValuePosition;
  formatValue?: (v: number) => string;
  label?: string;
  disabled?: boolean;
  trackClassName?: string;
  trackStyle?: CSSProperties;
  fillClassName?: string;
  fillStyle?: CSSProperties;
  hideFill?: boolean;
  thumbColor?: string;
  thumbBorderColor?: string;
  /**
   * Track thickness in px. Default 4 (thin track + filled range). Thick tracks
   * (≥ 8px, e.g. colour-picker hue / alpha strips) keep the thumb inside the
   * rounded ends instead of overhanging them.
   */
  trackSize?: number;
  /** Localizable accessible names. */
  labels?: Partial<SliderLabels>;
  ref?: Ref<HTMLDivElement>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// THUMB_SIZE is the thumb's layout / hit box; the visible knob is smaller.
export const THUMB_SIZE = 20;
export const THUMB_SIZE_REST = 14;
export const THUMB_SIZE_REST_COMPACT = 12;
export const THUMB_SIZE_ACTIVE = 16;
// Thin 4px track (Figma / Linear style) with a filled range.
export const TRACK_BG_HEIGHT = 4;
export const DOT_SIZE = 4;
export const PIP_SIZE = 5;
// Step pips are only drawn when they stay legible; beyond this the track
// turns into a dotted texture (e.g. 0–100 step 2 = 50 pips).
export const MAX_STEP_DOTS = 10;
// Inset the track so its ends line up with the thumb centres at min / max.
export const TRACK_INSET = THUMB_SIZE / 2;
// Vertical padding around the thumb box (hit-area slop) per density.
export const TRACK_PAD = 8;
export const TRACK_PAD_COMPACT = 4;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function valueToPixel(v: number, min: number, max: number, trackWidth: number): number {
  if (max === min) return 0;
  const usable = trackWidth - THUMB_SIZE;
  return ((v - min) / (max - min)) * usable;
}

export function pixelToValue(
  px: number,
  min: number,
  max: number,
  step: number,
  trackWidth: number,
): number {
  const usable = trackWidth - THUMB_SIZE;
  if (usable <= 0) return min;
  const raw = (px / usable) * (max - min) + min;
  const snapped = Math.round((raw - min) / step) * step + min;
  return Math.max(min, Math.min(max, snapped));
}

export function toRadixValue(value: SliderValue): [number, ...number[]] {
  return Array.isArray(value) ? value : [value];
}

// ---------------------------------------------------------------------------
// ValueDisplay (internal)
// ---------------------------------------------------------------------------

interface ValueDisplayProps {
  values: number[];
  editingIndex: number | null;
  onStartEdit: (index: number) => void;
  onCommitEdit: (index: number, v: number) => void;
  onCancelEdit: () => void;
  min: number;
  max: number;
  step: number;
  formatValue: (v: number) => string;
  label?: string;
  isRange: boolean;
  isInteracting: boolean;
  disabled?: boolean;
  labels: SliderLabels;
}

export function ValueDisplay({
  values,
  editingIndex,
  onStartEdit,
  onCommitEdit,
  onCancelEdit,
  min,
  max,
  step,
  formatValue,
  label,
  isRange,
  isInteracting,
  disabled,
  labels,
}: ValueDisplayProps) {
  const shape = useShape();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed the draft from the value being edited, then select it once the input
  // has mounted.
  const startEdit = (index: number) => {
    setInputValue(String(values[index]));
    onStartEdit(index);
  };
  useEffect(() => {
    if (editingIndex === null) return;
    const frame = requestAnimationFrame(() => inputRef.current?.select());
    return () => cancelAnimationFrame(frame);
  }, [editingIndex]);

  const commitEdit = useCallback(
    (index: number) => {
      const parsed = parseFloat(inputValue);
      if (!isNaN(parsed)) {
        const clamped = Math.max(min, Math.min(max, parsed));
        const snapped = Math.round((clamped - min) / step) * step + min;
        onCommitEdit(index, snapped);
      } else {
        onCancelEdit();
      }
    },
    [inputValue, min, max, step, onCommitEdit, onCancelEdit],
  );

  const thumbName = (index: number) => (isRange ? (index === 0 ? "start" : "end") : undefined);

  const renderValue = (index: number) => {
    if (editingIndex === index) {
      return (
        <span className="inline-grid text-[13px]">
          {/* Ghost for layout stability — widest possible value */}
          <span
            className="col-start-1 row-start-1 invisible"
            style={{ fontVariationSettings: fontWeights.medium }}
            aria-hidden="true"
          >
            {label ? `${label}: ` : ""}
            {formatValue(max)}
          </span>
          <span className="col-start-1 row-start-1 flex items-center gap-1">
            {label && <span className="text-muted-foreground">{label}:</span>}
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              min={min}
              max={max}
              step={step}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={() => commitEdit(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit(index);
                if (e.key === "Escape") onCancelEdit();
              }}
              aria-label={labels.editValue(thumbName(index), undefined)}
              className={cn(
                "w-[5ch] bg-transparent text-foreground outline-none border-b border-border text-center",
                shape.input,
              )}
              style={{ fontVariationSettings: fontWeights.medium }}
            />
          </span>
        </span>
      );
    }

    const value = values[index];
    if (value === undefined) return null;

    return (
      // A real button so the "click to type a value" affordance is also
      // reachable by keyboard (Tab + Enter/Space), not just by pointer.
      <button
        type="button"
        className="cursor-text select-none rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={labels.editValue(thumbName(index), formatValue(value))}
        disabled={disabled}
        onClick={() => startEdit(index)}
      >
        {formatValue(value)}
      </button>
    );
  };

  const widestValue = isRange
    ? `${label ? `${label}: ` : ""}${formatValue(max)} — ${formatValue(max)}`
    : `${label ? `${label}: ` : ""}${formatValue(max)}`;

  return (
    <span
      className={cn(
        "inline-grid shrink-0 text-[13px] leading-none text-muted-foreground transition-[font-variation-settings] duration-100",
        "tabular-nums",
      )}
      style={{
        fontVariationSettings: isInteracting ? fontWeights.medium : fontWeights.normal,
      }}
    >
      {/* Invisible ghost — reserves width of widest possible value */}
      <span
        className="col-start-1 row-start-1 invisible whitespace-nowrap"
        style={{ fontVariationSettings: fontWeights.medium }}
        aria-hidden="true"
      >
        {widestValue}
      </span>
      <span className="col-start-1 row-start-1 whitespace-nowrap">
        {label && editingIndex === null && <span className="text-muted-foreground">{label}: </span>}
        {isRange ? (
          <>
            <span className="sr-only">
              {values[0]} - {values[1]}
            </span>
            {renderValue(0)}
            <span className="mx-1 text-muted-foreground/50" aria-hidden="true">
              -
            </span>
            {renderValue(1)}
          </>
        ) : (
          renderValue(0)
        )}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// TooltipValue (internal)
// ---------------------------------------------------------------------------

interface TooltipValueProps {
  value: number;
  formatValue: (v: number) => string;
  motionX: MotionValue<number>;
}

export function TooltipValue({ value, formatValue, motionX }: TooltipValueProps) {
  const shape = useShape();
  const tooltipX = useTransform(motionX, (x) => x + THUMB_SIZE / 2);
  return (
    <motion.div
      className="absolute -translate-x-1/2 pointer-events-none z-20"
      style={{
        x: tooltipX,
        top: -16,
      }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4, transition: spring.fast.exit }}
      transition={spring.fast}
    >
      <span
        className={cn(
          "text-[12px] text-background tabular-nums whitespace-nowrap bg-foreground px-2 py-1",
          shape.bg,
        )}
        style={{ fontVariationSettings: fontWeights.medium }}
      >
        {formatValue(value)}
      </span>
    </motion.div>
  );
}
