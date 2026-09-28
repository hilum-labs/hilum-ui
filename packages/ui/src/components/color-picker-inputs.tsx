"use client";

import { type Ref, useRef, useState, useEffect, useCallback, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { fontWeights } from "../lib/font-weight";
import { Tooltip } from "./tooltip";
import { rgbToHsl, rgbToOklch, type ColorFormat, type ParsedColor } from "../lib/color";
import { useColorPickerLabels } from "./color-picker-controls";

// ---------------------------------------------------------------------------
// ColorInput (a single styled text input, used for hex)
// ---------------------------------------------------------------------------

interface ColorInputProps {
  value: string;
  onCommit: (next: string) => void;
  ariaLabel: string;
  width?: string;
  className?: string;
  inputClassName?: string;
  align?: "left" | "center" | "right";
  prefix?: ReactNode;
  inputMode?: "numeric" | "decimal" | "text";
  nudgeStep?: number;
  nudgeShiftStep?: number;
  hasPercent?: boolean;
  decimals?: number;
  scrubbable?: boolean;
  min?: number;
  max?: number;
  /** When true with min and max, wrap (modulo) instead of clamping. Used for angular values like hue. */
  wrap?: boolean;
}

export function ColorInput({
  ref,
  value,
  onCommit,
  ariaLabel,
  width,
  className,
  inputClassName,
  align = "left",
  prefix,
  inputMode = "text",
  nudgeStep,
  nudgeShiftStep,
  hasPercent = false,
  decimals,
  scrubbable = false,
  min,
  max,
  wrap = false,
}: ColorInputProps & { ref?: Ref<HTMLInputElement> | undefined }) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const interactingRef = useRef(false);
  // Set by Escape so the blur it triggers discards the draft instead of
  // committing it (the blur handler still sees the pre-reset draft).
  const cancelEditRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<{
    startX: number;
    startValue: number;
    scrubbing: boolean;
    pointerId: number;
  } | null>(null);

  useEffect(() => {
    if (!interactingRef.current) setDraft(value);
  }, [value]);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [ref],
  );

  const formatNumber = (n: number) =>
    decimals != null ? n.toFixed(decimals) : String(Math.round(n));

  const commitNumber = (n: number) => {
    let bounded = n;
    if (wrap && min != null && max != null) {
      const range = max - min;
      bounded = ((((bounded - min) % range) + range) % range) + min;
    } else {
      if (min != null) bounded = Math.max(min, bounded);
      if (max != null) bounded = Math.min(max, bounded);
    }
    const formatted = formatNumber(bounded);
    const withSuffix = hasPercent ? `${formatted}%` : formatted;
    setDraft(withSuffix);
    onCommit(withSuffix);
  };

  const nudge = (direction: 1 | -1, shift: boolean) => {
    const baseStep = shift ? (nudgeShiftStep ?? 10) : (nudgeStep ?? 1);
    const cur = parseFloat(draft.replace("%", ""));
    if (Number.isNaN(cur)) return;
    commitNumber(cur + direction * baseStep);
  };

  const onWrapperPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbable || editing) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const cur = parseFloat(draft.replace("%", ""));
    if (Number.isNaN(cur)) return;
    scrubRef.current = {
      startX: e.clientX,
      startValue: cur,
      scrubbing: false,
      pointerId: e.pointerId,
    };
    // Block focus while we wait to see if this is a click or a drag
    e.preventDefault();
    wrapperRef.current?.setPointerCapture(e.pointerId);
  };

  const onWrapperPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = scrubRef.current;
    if (!state) return;
    const dx = e.clientX - state.startX;
    if (!state.scrubbing && Math.abs(dx) > 3) {
      state.scrubbing = true;
      interactingRef.current = true;
    }
    if (state.scrubbing) {
      const baseStep = e.shiftKey ? (nudgeShiftStep ?? 10) : (nudgeStep ?? 1);
      commitNumber(state.startValue + dx * baseStep);
    }
  };

  const onWrapperPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = scrubRef.current;
    if (!state) return;
    scrubRef.current = null;
    try {
      wrapperRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    if (state.scrubbing) {
      interactingRef.current = false;
      // Sync draft back to the (possibly clamped) value from parent
      setDraft(value);
      return;
    }
    // Click without drag → enter edit mode and focus the input
    setEditing(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  return (
    <div
      ref={wrapperRef}
      data-slot="color-picker-input"
      onPointerDown={onWrapperPointerDown}
      onPointerMove={onWrapperPointerMove}
      onPointerUp={onWrapperPointerUp}
      onPointerCancel={onWrapperPointerUp}
      className={cn(
        "flex h-6 min-w-0 items-center rounded-[5px] border border-border bg-background px-1.5 text-[12px] tabular-nums select-none",
        "transition-[border-color,box-shadow] duration-80 hover:border-border-strong",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/35",
        scrubbable && !editing && "cursor-ew-resize",
        className,
      )}
      style={{ width }}
    >
      {prefix && (
        <span className="text-[11px] text-muted-foreground me-1 select-none">{prefix}</span>
      )}
      <input
        ref={setInputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => {
          interactingRef.current = true;
          setEditing(true);
          e.currentTarget.select();
        }}
        onBlur={() => {
          interactingRef.current = false;
          setEditing(false);
          if (cancelEditRef.current) {
            cancelEditRef.current = false;
            setDraft(value);
            return;
          }
          if (draft !== value) {
            const numeric = parseFloat(draft.replace("%", ""));
            if (!Number.isNaN(numeric) && (min != null || max != null)) {
              commitNumber(numeric);
            } else {
              onCommit(draft);
            }
          } else setDraft(value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.currentTarget as HTMLInputElement).blur();
          } else if (e.key === "Escape") {
            cancelEditRef.current = true;
            setDraft(value);
            (e.currentTarget as HTMLInputElement).blur();
          } else if (
            (nudgeStep != null || nudgeShiftStep != null) &&
            (e.key === "ArrowUp" || e.key === "ArrowDown")
          ) {
            e.preventDefault();
            nudge(e.key === "ArrowUp" ? 1 : -1, e.shiftKey);
          }
        }}
        inputMode={inputMode}
        aria-label={ariaLabel}
        className={cn(
          "flex-1 min-w-0 bg-transparent text-foreground text-[13px] outline-none tabular-nums",
          align === "center" && "text-center",
          align === "right" && "text-right",
          scrubbable && !editing && "pointer-events-none",
          inputClassName,
        )}
        style={{ fontVariationSettings: fontWeights.medium }}
      />
    </div>
  );
}

ColorInput.displayName = "ColorInput";

// ---------------------------------------------------------------------------
// ColorInputsRow — adapts inputs to format
// ---------------------------------------------------------------------------

type ChannelKey =
  "hex" | "r" | "g" | "b" | "hSL" | "sSL" | "lSL" | "L" | "C" | "H" | "alphaPercent";

export function ColorInputsRow({
  parsed,
  format,
  oklchHue,
  onChannelChange,
}: {
  parsed: ParsedColor;
  format: ColorFormat;
  /** Sticky OKLCH hue override for display (preserves user's stated H across round-trip drift). */
  oklchHue?: number | null;
  onChannelChange: (key: ChannelKey, value: string) => void;
}) {
  const labels = useColorPickerLabels();
  const alphaPct = Math.round(parsed.a * 100);

  if (format === "hex") {
    const hexNoHash = parsed.hex.replace(/^#/, "").toUpperCase();
    return (
      <div className="grid grid-cols-[minmax(0,1fr)_4rem] gap-1.5">
        <ChannelTooltip label={labels.hex}>
          <ColorInput
            value={hexNoHash}
            onCommit={(next) => onChannelChange("hex", next.startsWith("#") ? next : `#${next}`)}
            ariaLabel={labels.hexValue}
            prefix="#"
          />
        </ChannelTooltip>
        <AlphaInput value={alphaPct} onCommit={(n) => onChannelChange("alphaPercent", String(n))} />
      </div>
    );
  }

  if (format === "rgb") {
    return (
      <div className="grid grid-cols-4 gap-1">
        <ChannelTooltip label={labels.red}>
          <ColorInput
            value={String(parsed.r)}
            onCommit={(n) => onChannelChange("r", n)}
            ariaLabel={labels.red}
            align="center"
            inputMode="numeric"
            nudgeStep={1}
            nudgeShiftStep={10}
            scrubbable
            min={0}
            max={255}
          />
        </ChannelTooltip>
        <ChannelTooltip label={labels.green}>
          <ColorInput
            value={String(parsed.g)}
            onCommit={(n) => onChannelChange("g", n)}
            ariaLabel={labels.green}
            align="center"
            inputMode="numeric"
            nudgeStep={1}
            nudgeShiftStep={10}
            scrubbable
            min={0}
            max={255}
          />
        </ChannelTooltip>
        <ChannelTooltip label={labels.blue}>
          <ColorInput
            value={String(parsed.b)}
            onCommit={(n) => onChannelChange("b", n)}
            ariaLabel={labels.blue}
            align="center"
            inputMode="numeric"
            nudgeStep={1}
            nudgeShiftStep={10}
            scrubbable
            min={0}
            max={255}
          />
        </ChannelTooltip>
        <AlphaInput value={alphaPct} onCommit={(n) => onChannelChange("alphaPercent", String(n))} />
      </div>
    );
  }

  if (format === "hsl") {
    const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
    return (
      <div className="grid grid-cols-4 gap-1">
        <ChannelTooltip label={labels.hue}>
          <ColorInput
            value={String(Math.round(hsl.h))}
            onCommit={(n) => onChannelChange("hSL", n)}
            ariaLabel={labels.hue}
            align="center"
            inputMode="numeric"
            nudgeStep={1}
            nudgeShiftStep={10}
            scrubbable
            min={0}
            max={360}
            wrap
          />
        </ChannelTooltip>
        <ChannelTooltip label={labels.saturation}>
          <ColorInput
            value={String(Math.round(hsl.s * 100))}
            onCommit={(n) => onChannelChange("sSL", n)}
            ariaLabel={labels.saturation}
            align="center"
            inputMode="numeric"
            nudgeStep={1}
            nudgeShiftStep={10}
            scrubbable
            min={0}
            max={100}
          />
        </ChannelTooltip>
        <ChannelTooltip label={labels.lightness}>
          <ColorInput
            value={String(Math.round(hsl.l * 100))}
            onCommit={(n) => onChannelChange("lSL", n)}
            ariaLabel={labels.lightness}
            align="center"
            inputMode="numeric"
            nudgeStep={1}
            nudgeShiftStep={10}
            scrubbable
            min={0}
            max={100}
          />
        </ChannelTooltip>
        <AlphaInput value={alphaPct} onCommit={(n) => onChannelChange("alphaPercent", String(n))} />
      </div>
    );
  }

  // oklch
  const oklch = rgbToOklch(parsed.r, parsed.g, parsed.b);
  const displayH = oklchHue ?? oklch.H;
  return (
    <div className="grid grid-cols-4 gap-1">
      <ChannelTooltip label={labels.lightness}>
        <ColorInput
          value={(oklch.L * 100).toFixed(0)}
          onCommit={(n) => onChannelChange("L", n)}
          ariaLabel={labels.lightness}
          align="center"
          inputMode="decimal"
          nudgeStep={1}
          nudgeShiftStep={10}
          scrubbable
          min={0}
          max={100}
        />
      </ChannelTooltip>
      <ChannelTooltip label={labels.chroma}>
        <ColorInput
          value={oklch.C.toFixed(2)}
          onCommit={(n) => onChannelChange("C", n)}
          ariaLabel={labels.chroma}
          align="center"
          inputMode="decimal"
          nudgeStep={0.01}
          nudgeShiftStep={0.1}
          decimals={2}
          scrubbable
          min={0}
          max={0.4}
        />
      </ChannelTooltip>
      <ChannelTooltip label={labels.hue}>
        <ColorInput
          value={displayH.toFixed(0)}
          onCommit={(n) => onChannelChange("H", n)}
          ariaLabel={labels.hue}
          align="center"
          inputMode="numeric"
          nudgeStep={1}
          nudgeShiftStep={10}
          scrubbable
          min={0}
          max={360}
          wrap
        />
      </ChannelTooltip>
      <AlphaInput value={alphaPct} onCommit={(n) => onChannelChange("alphaPercent", String(n))} />
    </div>
  );
}

function ChannelTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip content={label} delayDuration={300}>
      <div>{children}</div>
    </Tooltip>
  );
}

function AlphaInput({ value, onCommit }: { value: number; onCommit: (n: number) => void }) {
  const labels = useColorPickerLabels();
  return (
    <ChannelTooltip label={labels.alpha}>
      <ColorInput
        value={`${value}%`}
        onCommit={(input) => {
          const n = parseFloat(input.replace("%", ""));
          if (Number.isNaN(n)) return;
          onCommit(Math.max(0, Math.min(100, Math.round(n))));
        }}
        ariaLabel={labels.alpha}
        align="center"
        inputMode="numeric"
        nudgeStep={1}
        nudgeShiftStep={10}
        hasPercent
        scrubbable
        min={0}
        max={100}
      />
    </ChannelTooltip>
  );
}
