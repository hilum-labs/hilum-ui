"use client";

import {
  type Ref,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "../lib/motion";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { fontWeights } from "../lib/font-weight";
import { useShape } from "../lib/shape-context";
import { useSurface, SurfaceProvider } from "../lib/surface-context";
import { surfaceClasses } from "../lib/surface-classes";
import { useIcon } from "../lib/icon-context";
import {
  buildParsed,
  clamp01,
  colorsRepresentSameValue,
  formatValueByFormat,
  hslToRgb,
  hsvToRgb,
  oklchToRgb,
  parseColor,
  rgbToHexStr,
  rgbToHsl,
  rgbToHsv,
  rgbToOklch,
  type ColorFormat,
  type ParsedColor,
} from "../lib/color";
import {
  AlphaSlider,
  COLOR_PICKER_DEFAULT_LABELS,
  ColorPickerLabelsContext,
  ColorPickerPortalContainer,
  ColorSwatch,
  ColorTile,
  EyeDropperButton,
  HueSlider,
  PANEL_WIDTH,
  SaturationSquare,
  SwatchStrip,
  type ColorPickerLabels,
  type ColorSwatchProps,
} from "./color-picker-controls";
import { FormatDropdown } from "./color-picker-format";
import { ColorInputsRow } from "./color-picker-inputs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ColorPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string, parsed: ParsedColor) => void;
  ariaLabel?: string;
  format?: ColorFormat;
  defaultFormat?: ColorFormat;
  onFormatChange?: (format: ColorFormat) => void;
  swatches?: string[];
  presets?: string[];
  hideEyedropper?: boolean;
  disabled?: boolean;
  /** Controls the format dropdown's open state. When provided, the dropdown
   *  is fully controlled and ignores user toggles. */
  formatOpen?: boolean;
  /** Initial open state for the format dropdown (uncontrolled). */
  defaultFormatOpen?: boolean;
  /** Override the English UI strings (i18n). */
  labels?: Partial<ColorPickerLabels>;
}

interface ColorPickerPopoverProps extends ColorPickerProps {
  triggerLabel?: string;
  triggerLabelPosition?: "left" | "right";
  triggerShowValue?: boolean;
  triggerShowRemove?: boolean;
  onTriggerRemove?: () => void;
  triggerClassName?: string;
  /** Accessible name of the trigger when it shows no text (`triggerShowValue={false}`, no `triggerLabel`). */
  triggerAriaLabel?: string;
  /** Controls the popover's open state. When provided, the popover is fully
   *  controlled and ignores trigger clicks. */
  open?: boolean;
  /** Initial open state for the popover (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when the open state would change (fires even when controlled). */
  onOpenChange?: (open: boolean) => void;
}

// ---------------------------------------------------------------------------
// ColorPicker (panel)
// ---------------------------------------------------------------------------

function ColorPicker({
  ref,
  value,
  defaultValue = "#6B97FF",
  onChange,
  onValueChange,
  ariaLabel,
  format,
  defaultFormat = "hex",
  onFormatChange,
  swatches,
  presets,
  hideEyedropper,
  formatOpen,
  defaultFormatOpen,
  disabled = false,
  labels: labelsProp,
  className,
  ...props
}: ColorPickerProps & { ref?: Ref<HTMLDivElement> | undefined }) {
  const labels = useMemo(() => ({ ...COLOR_PICKER_DEFAULT_LABELS, ...labelsProp }), [labelsProp]);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);
  const currentRawValue = isControlled ? (value as string) : internalValue;

  const isFormatControlled = format !== undefined;
  const [internalFormat, setInternalFormat] = useState<ColorFormat>(defaultFormat);
  const currentFormat = isFormatControlled ? (format as ColorFormat) : internalFormat;

  // Internal HSV state (canonical). H is preserved across S=0 / V=0 transitions.
  // Seeded once from the initial value; later external changes are synced
  // by the effect below.
  const [hsv, setHsv] = useState(() => {
    const p = parseColor(currentRawValue);
    if (!p) return { h: 0, s: 1, v: 1, a: 1 };
    const initial = rgbToHsv(p.r, p.g, p.b);
    return { h: initial.s === 0 ? 0 : initial.h, s: initial.s, v: initial.v, a: p.a };
  });

  // Sticky OKLCH hue: preserves the user's stated OKLCH H across the lossy
  // RGB round-trip (so the displayed H doesn't drift after release) and
  // across achromatic colors (where RGB-derived H would collapse to 0).
  // Cleared whenever the color changes through a non-OKLCH-internal channel.
  const [oklchHue, setOklchHue] = useState<number | null>(null);

  // External value sync — when controlled value changes from outside, sync HSV
  const lastEmittedRef = useRef<string>("");
  useEffect(() => {
    if (!isControlled) return;
    const emitted = lastEmittedRef.current;
    const cur = value as string;
    // Controlled consumers commonly normalize emitted hex strings (for
    // example, Pappery uppercases them). Treat a formatting-only round trip
    // as an acknowledgement of our last emission so the precise in-flight
    // HSV position is not replaced with RGB-quantized coordinates mid-drag.
    if (cur === emitted || colorsRepresentSameValue(cur, emitted)) return;
    const p = parseColor(cur);
    if (!p) return;
    setOklchHue(null);
    const newHsv = rgbToHsv(p.r, p.g, p.b);
    setHsv((prev) => ({
      h: newHsv.s === 0 ? prev.h : newHsv.h,
      s: newHsv.s,
      v: newHsv.v,
      a: p.a,
    }));
  }, [value, isControlled]);

  const parsed = useMemo(() => buildParsed(hsv.h, hsv.s, hsv.v, hsv.a), [hsv]);

  const updateHsv = useCallback(
    (next: { h?: number; s?: number; v?: number; a?: number }) => {
      const merged = { ...hsv, ...next };
      setHsv(merged);
      const p = buildParsed(merged.h, merged.s, merged.v, merged.a);
      const formatted = formatValueByFormat(p, currentFormat);
      lastEmittedRef.current = formatted;
      if (!isControlled) setInternalValue(formatted);
      onChange?.(formatted);
      onValueChange?.(formatted, p);
    },
    [hsv, currentFormat, isControlled, onChange, onValueChange],
  );

  const handleFormatChange = useCallback(
    (f: ColorFormat) => {
      if (!isFormatControlled) setInternalFormat(f);
      onFormatChange?.(f);
      // Re-emit value in new format
      const formatted = formatValueByFormat(parsed, f);
      lastEmittedRef.current = formatted;
      if (!isControlled) setInternalValue(formatted);
      onChange?.(formatted);
      onValueChange?.(formatted, parsed);
    },
    [isFormatControlled, isControlled, onFormatChange, onChange, onValueChange, parsed],
  );

  const handleHexCommit = useCallback(
    (input: string) => {
      const p = parseColor(input);
      if (!p) return;
      setOklchHue(null);
      const newHsv = rgbToHsv(p.r, p.g, p.b);
      const merged = {
        h: newHsv.s === 0 ? hsv.h : newHsv.h,
        s: newHsv.s,
        v: newHsv.v,
        a: p.a,
      };
      setHsv(merged);
      const next = buildParsed(merged.h, merged.s, merged.v, merged.a);
      const formatted = formatValueByFormat(next, currentFormat);
      lastEmittedRef.current = formatted;
      if (!isControlled) setInternalValue(formatted);
      onChange?.(formatted);
      onValueChange?.(formatted, next);
    },
    [hsv.h, currentFormat, isControlled, onChange, onValueChange],
  );

  const handleSwatchPick = useCallback(
    (sw: string) => {
      handleHexCommit(sw);
    },
    [handleHexCommit],
  );

  const handleEyedrop = useCallback(
    (hex: string) => {
      handleHexCommit(hex);
    },
    [handleHexCommit],
  );

  const solidHueRgb = useMemo(() => hsvToRgb(hsv.h, hsv.s, hsv.v), [hsv.h, hsv.s, hsv.v]);
  const solidR = Math.round(solidHueRgb.r);
  const solidG = Math.round(solidHueRgb.g);
  const solidB = Math.round(solidHueRgb.b);
  const solidColorString = `rgb(${solidR}, ${solidG}, ${solidB})`;
  const shape = useShape();
  const substrate = useSurface();
  // The picker panel uses bg-card (surface-3) by default; when wrapped in
  // ColorPickerPopover the className override pushes it higher. Either way,
  // announce the panel's effective level so descendants (FormatDropdown,
  // etc.) elevate above it instead of colliding at the same surface.
  const pickerLevel = Math.max(substrate, 3);

  return (
    <ColorPickerLabelsContext.Provider value={labels}>
      <SurfaceProvider value={pickerLevel}>
        <div
          ref={ref}
          data-slot="color-picker"
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          data-disabled={disabled ? "" : undefined}
          // `inert` removes the whole panel from pointer + keyboard interaction.
          inert={disabled || undefined}
          className={cn(
            "flex flex-col gap-2 p-3",
            surfaceClasses(pickerLevel, 1),
            shape.container,
            disabled && "pointer-events-none select-none opacity-50",
            className,
          )}
          style={{ width: PANEL_WIDTH }}
          {...props}
        >
          <SaturationSquare
            h={hsv.h}
            s={hsv.s}
            v={hsv.v}
            onChange={(s, v) => updateHsv({ s, v })}
          />

          {/* Hue + alpha strips: slider boxes carry 8px hit slop top/bottom; the
              negative margins collapse that so the strips sit 12px apart. */}
          <div className="-my-2 flex flex-col [&>*]:mb-0 [&>*+*]:-mt-3">
            <HueSlider
              h={hsv.h}
              onChange={(h) => {
                setOklchHue(null);
                updateHsv({ h });
              }}
            />
            <AlphaSlider
              a={hsv.a}
              solidColor={solidColorString}
              solidR={solidR}
              solidG={solidG}
              solidB={solidB}
              onChange={(a) => updateHsv({ a })}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <FormatDropdown
              value={currentFormat}
              onChange={handleFormatChange}
              {...(formatOpen !== undefined ? { open: formatOpen } : {})}
              {...(defaultFormatOpen !== undefined ? { defaultOpen: defaultFormatOpen } : {})}
            />
            {!hideEyedropper && <EyeDropperButton onPick={handleEyedrop} />}
          </div>

          <ColorInputsRow
            parsed={parsed}
            format={currentFormat}
            oklchHue={oklchHue}
            onChannelChange={(channel, value) => {
              const p = { ...parsed };
              switch (channel) {
                case "hex":
                  handleHexCommit(value as string);
                  return;
                case "r":
                case "g":
                case "b": {
                  setOklchHue(null);
                  const r = channel === "r" ? Number(value) : p.r;
                  const g = channel === "g" ? Number(value) : p.g;
                  const b = channel === "b" ? Number(value) : p.b;
                  const hsvVal = rgbToHsv(r, g, b);
                  updateHsv({
                    h: hsvVal.s === 0 ? hsv.h : hsvVal.h,
                    s: hsvVal.s,
                    v: hsvVal.v,
                  });
                  return;
                }
                case "hSL":
                case "sSL":
                case "lSL": {
                  if (channel === "hSL") setOklchHue(null);
                  const hsl = rgbToHsl(p.r, p.g, p.b);
                  const h2 = channel === "hSL" ? Number(value) : hsl.h;
                  const s2 = channel === "sSL" ? Number(value) / 100 : hsl.s;
                  const l2 = channel === "lSL" ? Number(value) / 100 : hsl.l;
                  const rgb = hslToRgb(h2, clamp01(s2), clamp01(l2));
                  const hsvVal = rgbToHsv(rgb.r, rgb.g, rgb.b);
                  updateHsv({
                    h: hsvVal.s === 0 ? h2 : hsvVal.h,
                    s: hsvVal.s,
                    v: hsvVal.v,
                  });
                  return;
                }
                case "L":
                case "C":
                case "H": {
                  const cur = rgbToOklch(p.r, p.g, p.b);
                  // For L/C edits, anchor on the user's last stated H so we
                  // don't drift along with chroma changes.
                  const baseH = oklchHue ?? cur.H;
                  const L = channel === "L" ? Number(value) / 100 : cur.L;
                  const C = channel === "C" ? Number(value) : cur.C;
                  const H = channel === "H" ? Number(value) : baseH;
                  setOklchHue(H);
                  const rgb = oklchToRgb(clamp01(L), Math.max(0, C), H);
                  const hsvVal = rgbToHsv(rgb.r, rgb.g, rgb.b);
                  updateHsv({
                    h: hsvVal.s === 0 ? hsv.h : hsvVal.h,
                    s: hsvVal.s,
                    v: hsvVal.v,
                  });
                  return;
                }
                case "alphaPercent": {
                  const a = clamp01(Number(value) / 100);
                  updateHsv({ a });
                  return;
                }
              }
            }}
          />

          {(swatches ?? presets) && (swatches ?? presets)!.length > 0 && (
            <SwatchStrip
              swatches={(swatches ?? presets)!}
              current={parsed.hex}
              onPick={handleSwatchPick}
            />
          )}
        </div>
      </SurfaceProvider>
    </ColorPickerLabelsContext.Provider>
  );
}

ColorPicker.displayName = "ColorPicker";

// ---------------------------------------------------------------------------
// ColorPickerPopover (trigger button + portal panel)
// ---------------------------------------------------------------------------

function ColorPickerPopover({
  ref,
  triggerLabel,
  triggerLabelPosition = "left",
  triggerShowValue = true,
  triggerShowRemove = false,
  onTriggerRemove,
  triggerClassName,
  triggerAriaLabel,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...pickerProps
}: ColorPickerPopoverProps & { ref?: Ref<HTMLDivElement> | undefined }) {
  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isOpenControlled ? openProp : internalOpen;
  const setOpen = useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      const resolved = typeof next === "function" ? next(open) : next;
      if (!isOpenControlled) setInternalOpen(resolved);
      onOpenChange?.(resolved);
    },
    [open, isOpenControlled, onOpenChange],
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelEl, setPanelEl] = useState<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const shape = useShape();
  const substrate = useSurface();
  const level = Math.min(substrate + 2, 8);

  const isControlled = pickerProps.value !== undefined;
  const [internalValue, setInternalValue] = useState(
    pickerProps.value ?? pickerProps.defaultValue ?? "#6B97FF",
  );
  const currentValue = isControlled ? (pickerProps.value as string) : internalValue;

  const onValueChange = useCallback(
    (v: string, parsed: ParsedColor) => {
      if (!isControlled) setInternalValue(v);
      pickerProps.onValueChange?.(v, parsed);
    },
    [isControlled, pickerProps],
  );

  useEffect(() => {
    if (!open || !triggerRef.current) {
      setRect(null);
      return;
    }
    const update = () => {
      if (triggerRef.current) {
        setRect(triggerRef.current.getBoundingClientRect());
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, { capture: true } as EventListenerOptions);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        !panelRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  const XIcon = useIcon("x");
  const removeLabel = pickerProps.labels?.removeColor ?? COLOR_PICKER_DEFAULT_LABELS.removeColor;
  const parsed = useMemo(() => parseColor(currentValue), [currentValue]);
  const swatchColor = parsed ? rgbToHexStr(parsed.r, parsed.g, parsed.b, parsed.a) : currentValue;
  const valueLabel = parsed
    ? rgbToHexStr(parsed.r, parsed.g, parsed.b, 1).replace(/^#/, "").toUpperCase()
    : currentValue;

  return (
    <div ref={ref} data-slot="color-picker-popover" className="inline-flex">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={pickerProps.disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        {...(triggerAriaLabel ? { "aria-label": triggerAriaLabel } : {})}
        className={cn(
          "flex items-center gap-2 h-9 px-2 border border-border bg-transparent hover:bg-hover hover:border-border-strong transition-colors duration-80 outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
          "disabled:pointer-events-none disabled:opacity-50",
          shape.input,
          "compact:h-6 compact:gap-1.5 compact:px-1 compact:rounded-[5px]",
          triggerClassName,
        )}
        style={{ fontVariationSettings: fontWeights.medium }}
      >
        {triggerLabel && triggerLabelPosition === "left" && (
          <span className="text-[13px] text-muted-foreground px-1 select-none">{triggerLabel}</span>
        )}
        <ColorTile color={swatchColor} size={20} />
        {triggerShowValue && (
          <span className="text-[13px] text-foreground tabular-nums">{valueLabel}</span>
        )}
        {triggerLabel && triggerLabelPosition === "right" && (
          <span className="text-[13px] text-muted-foreground px-1 select-none">{triggerLabel}</span>
        )}
        {triggerShowRemove && (
          <span
            role="button"
            aria-label={removeLabel}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onTriggerRemove?.();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                e.preventDefault();
                onTriggerRemove?.();
              }
            }}
            className="ms-1 text-muted-foreground hover:text-foreground cursor-pointer flex items-center"
          >
            <XIcon size={14} strokeWidth={1.5} />
          </span>
        )}
      </button>
      {open &&
        rect &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: rect.bottom + 6,
              left: rect.left,
              zIndex: 50,
            }}
          >
            <AnimatePresence>
              <motion.div
                ref={(node) => {
                  (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                  setPanelEl(node);
                }}
                initial={{ opacity: 0, y: -4, scaleY: 0.96 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
                transition={spring.moderate}
                style={{ transformOrigin: "top left" }}
              >
                <ColorPickerPortalContainer value={panelEl}>
                  <SurfaceProvider value={level}>
                    <ColorPicker
                      {...pickerProps}
                      value={currentValue}
                      onValueChange={onValueChange}
                      className={cn(surfaceClasses(level, 3), pickerProps.className)}
                    />
                  </SurfaceProvider>
                </ColorPickerPortalContainer>
              </motion.div>
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </div>
  );
}

ColorPickerPopover.displayName = "ColorPickerPopover";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  ColorPicker,
  ColorPickerPopover,
  ColorPickerPortalContainer,
  ColorSwatch,
  ColorTile,
  COLOR_PICKER_DEFAULT_LABELS,
  parseColor,
  buildParsed,
};

export type {
  ColorPickerProps,
  ColorPickerPopoverProps,
  ColorPickerLabels,
  ColorSwatchProps,
  ColorFormat,
  ParsedColor,
};
