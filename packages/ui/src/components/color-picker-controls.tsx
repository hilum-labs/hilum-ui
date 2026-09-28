"use client";

import {
  createContext,
  useContext,
  type Ref,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { useShape } from "../lib/shape-context";
import { useIcon } from "../lib/icon-context";
import { Slider } from "./slider";
import { clamp01, hsvToRgb, parseColor, rgbToHexStr } from "../lib/color";

// Internal building blocks of ColorPicker (not part of the public API unless
// re-exported from ./color-picker).

// Allows consumers (e.g. the /demo carousel) to portal popups inside a
// CSS-scaled ancestor so menu/popover layers visually scale with the picker.
export const ColorPickerPortalContainerContext = createContext<HTMLElement | null>(null);

export function ColorPickerPortalContainer({
  value,
  children,
}: {
  value: HTMLElement | null;
  children: ReactNode;
}) {
  return (
    <ColorPickerPortalContainerContext.Provider value={value}>
      {children}
    </ColorPickerPortalContainerContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Labels (i18n)
// ---------------------------------------------------------------------------

export interface ColorPickerLabels {
  /** Saturation/brightness plane. */
  saturationBrightness: string;
  hue: string;
  alpha: string;
  /** EyeDropper button. */
  eyeDropper: string;
  /** Accessible name of a preset swatch. */
  selectColor: (color: string) => string;
  /** Remove button on the ColorPickerPopover trigger. */
  removeColor: string;
  /** Hex channel tooltip. */
  hex: string;
  /** Hex input accessible name. */
  hexValue: string;
  red: string;
  green: string;
  blue: string;
  saturation: string;
  lightness: string;
  chroma: string;
}

export const COLOR_PICKER_DEFAULT_LABELS: ColorPickerLabels = {
  saturationBrightness: "Saturation and brightness",
  hue: "Hue",
  alpha: "Alpha",
  eyeDropper: "Pick color from screen",
  selectColor: (color) => `Select color ${color}`,
  removeColor: "Remove color",
  hex: "Hex",
  hexValue: "Hex value",
  red: "Red",
  green: "Green",
  blue: "Blue",
  saturation: "Saturation",
  lightness: "Lightness",
  chroma: "Chroma",
};

export const ColorPickerLabelsContext = createContext<ColorPickerLabels>(
  COLOR_PICKER_DEFAULT_LABELS,
);

export function useColorPickerLabels() {
  return useContext(ColorPickerLabelsContext);
}

export interface ColorSwatchProps extends Omit<HTMLAttributes<HTMLButtonElement>, "color"> {
  color: string;
  size?: number;
  selected?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PANEL_WIDTH = 280;
const SQUARE_HEIGHT = 156;
export const CHECKER_BG: CSSProperties = {
  backgroundImage:
    "conic-gradient(var(--checker-a) 0 25%, var(--checker-b) 0 50%, var(--checker-a) 0 75%, var(--checker-b) 0)",
  backgroundSize: "8px 8px",
};

// ---------------------------------------------------------------------------
// SaturationSquare
// ---------------------------------------------------------------------------

interface SaturationSquareProps {
  h: number;
  s: number;
  v: number;
  onChange: (s: number, v: number) => void;
}

export function SaturationSquare({ h, s, v, onChange }: SaturationSquareProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const shape = useShape();
  const labels = useColorPickerLabels();

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const x = clamp01((clientX - rect.left) / rect.width);
      const y = clamp01((clientY - rect.top) / rect.height);
      onChange(x, 1 - y);
    },
    [onChange],
  );

  const updateCursorPos = useCallback((clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({
      x: clamp01((clientX - rect.left) / rect.width) * 100,
      y: clamp01((clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      dragging.current = true;
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      updateCursorPos(e.clientX, e.clientY);
      if (!dragging.current) return;
      updateFromPointer(e.clientX, e.clientY);
    },
    [updateFromPointer, updateCursorPos],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    setIsDragging(false);
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 0.1 : 0.01;
      let nextS = s,
        nextV = v,
        handled = true;
      if (e.key === "ArrowLeft") nextS = clamp01(s - step);
      else if (e.key === "ArrowRight") nextS = clamp01(s + step);
      else if (e.key === "ArrowUp") nextV = clamp01(v + step);
      else if (e.key === "ArrowDown") nextV = clamp01(v - step);
      else if (e.key === "PageUp") nextV = clamp01(v + 0.1);
      else if (e.key === "PageDown") nextV = clamp01(v - 0.1);
      else if (e.key === "Home") nextS = 0;
      else if (e.key === "End") nextS = 1;
      else handled = false;
      if (handled) {
        e.preventDefault();
        onChange(nextS, nextV);
      }
    },
    [onChange, s, v],
  );

  const { r, g, b } = hsvToRgb(h, s, v);
  const thumbColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

  return (
    // 2D saturation/brightness area exposed as a slider (the APG pattern for
    // 2D pickers): the value is saturation (Left/Right), brightness is
    // conveyed in aria-valuetext and moved with Up/Down.
    <div
      ref={ref}
      role="slider"
      aria-label={labels.saturationBrightness}
      aria-roledescription="2D slider"
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(s * 100)}
      aria-valuetext={`Saturation ${Math.round(s * 100)}%, brightness ${Math.round(v * 100)}%`}
      tabIndex={0}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) setFocused(true);
      }}
      onBlur={() => setFocused(false)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setCursorPos(null);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
      onKeyDown={onKeyDown}
      className={cn("relative w-full select-none touch-none cursor-none outline-none", shape.bg)}
      style={{
        height: SQUARE_HEIGHT,
        boxShadow: focused ? "0 0 0 2px var(--ring)" : undefined,
      }}
    >
      <div
        className={cn(
          "absolute inset-0 overflow-hidden",
          shape.bg === "rounded-[20px]" ? "rounded-2xl" : shape.bg,
        )}
        style={{
          // Colour-space data, not UI chrome: the HSV plane is defined by pure
          // black/white, so these stay literal rather than theme tokens.
          background: `linear-gradient(to top, rgb(0 0 0), transparent), linear-gradient(to right, rgb(255 255 255), hsl(${h}, 100%, 50%))`,
        }}
      />
      <div
        data-slot="color-picker-thumb"
        aria-hidden="true"
        className="absolute pointer-events-none rounded-full"
        style={{
          left: `${s * 100}%`,
          top: `${(1 - v) * 100}%`,
          width: 18,
          height: 18,
          transform: "translate(-50%, -50%)",
          border: "1px solid white",
          boxShadow: "0 0 0 1px rgba(0,0,0,1)",
          backgroundColor: thumbColor,
        }}
      />
      {hovered && !isDragging && cursorPos && (
        <div
          data-slot="color-picker-hover"
          aria-hidden="true"
          className="absolute pointer-events-none rounded-full"
          style={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
            width: 18,
            height: 18,
            transform: "translate(-50%, -50%)",
            border: "2px solid rgba(255, 255, 255, 0.55)",
            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.2)",
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HueSlider
// ---------------------------------------------------------------------------

export function HueSlider({ h, onChange }: { h: number; onChange: (h: number) => void }) {
  const labels = useColorPickerLabels();
  const hueColor = `hsl(${h}, 100%, 50%)`;
  return (
    <Slider
      value={h}
      onChange={(v) => onChange(typeof v === "number" ? v : v[0])}
      min={0}
      max={360}
      step={1}
      showValue={false}
      hideFill
      thumbColor={hueColor}
      thumbBorderColor="rgba(255,255,255,0.95)"
      trackSize={12}
      trackStyle={{
        background:
          "linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))",
        borderColor: "transparent",
      }}
      aria-label={labels.hue}
    />
  );
}

// ---------------------------------------------------------------------------
// AlphaSlider
// ---------------------------------------------------------------------------

export function AlphaSlider({
  a,
  solidColor,
  solidR,
  solidG,
  solidB,
  onChange,
}: {
  a: number;
  solidColor: string;
  solidR: number;
  solidG: number;
  solidB: number;
  onChange: (a: number) => void;
}) {
  // Use color-aware transparent stop (same hue, alpha 0) so the gradient stays
  // chromatically consistent and reaches fully opaque at 100% with no edge gap.
  const labels = useColorPickerLabels();
  const transparentColor = `rgba(${solidR}, ${solidG}, ${solidB}, 0)`;
  return (
    <Slider
      value={Math.round(a * 100)}
      onChange={(v) => onChange((typeof v === "number" ? v : v[0]) / 100)}
      min={0}
      max={100}
      step={1}
      showValue={false}
      hideFill
      thumbColor={solidColor}
      thumbBorderColor="rgba(255,255,255,0.95)"
      trackSize={12}
      trackStyle={{
        backgroundImage: `linear-gradient(to right, ${transparentColor} 0%, ${solidColor} 98%), conic-gradient(var(--checker-a) 0 25%, var(--checker-b) 0 50%, var(--checker-a) 0 75%, var(--checker-b) 0)`,
        backgroundSize: "100% 100%, 8px 8px",
      }}
      aria-label={labels.alpha}
    />
  );
}

// ---------------------------------------------------------------------------
// EyeDropperButton
// ---------------------------------------------------------------------------

interface EyeDropperGlobal {
  open(): Promise<{ sRGBHex: string }>;
}

export function EyeDropperButton({ onPick }: { onPick: (hex: string) => void }) {
  const [supported, setSupported] = useState(false);
  const PipetteIcon = useIcon("pipette");
  const labels = useColorPickerLabels();

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "EyeDropper" in window);
  }, []);

  if (!supported) return null;

  const handleClick = async () => {
    try {
      const Ctor = (window as unknown as { EyeDropper: new () => EyeDropperGlobal }).EyeDropper;
      const eye = new Ctor();
      const result = await eye.open();
      onPick(result.sRGBHex);
    } catch {
      // user cancelled
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={labels.eyeDropper}
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-[5px] text-muted-foreground bg-transparent hover:bg-hover hover:text-foreground active:bg-active transition-colors duration-80 outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
      )}
    >
      <PipetteIcon size={14} strokeWidth={1.5} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// ColorTile (small colored square — checker behind alpha)
// ---------------------------------------------------------------------------

interface ColorTileProps {
  color: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export function ColorTile({ color, size = 24, className, style }: ColorTileProps) {
  const shape = useShape();
  return (
    <span
      data-slot="color-tile"
      className={cn("inline-block relative shrink-0 overflow-hidden", shape.bg, className)}
      style={{
        width: size,
        height: size,
        ...CHECKER_BG,
        boxShadow: "inset 0 0 0 1px rgba(127,127,127,0.25)",
        ...style,
      }}
    >
      <span className="absolute inset-0" style={{ backgroundColor: color }} />
    </span>
  );
}

// ---------------------------------------------------------------------------
// ColorSwatch (clickable strip swatch)
// ---------------------------------------------------------------------------

export function ColorSwatch({
  ref,
  color,
  size = 28,
  selected,
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ColorSwatchProps & { ref?: Ref<HTMLButtonElement> | undefined }) {
  const shape = useShape();
  const labels = useColorPickerLabels();
  const [hovered, setHovered] = useState(false);
  const ring = selected
    ? "inset 0 0 0 1px rgba(127,127,127,0.25), 0 0 0 2px var(--background), 0 0 0 4px var(--ring)"
    : hovered
      ? "inset 0 0 0 1px rgba(127,127,127,0.25), 0 0 0 2px var(--background), 0 0 0 4px rgba(127,127,127,0.4)"
      : "inset 0 0 0 1px rgba(127,127,127,0.25)";
  return (
    <button
      ref={ref}
      data-slot="color-swatch"
      type="button"
      aria-label={labels.selectColor(color)}
      className={cn(
        "relative shrink-0 overflow-hidden cursor-pointer outline-none transition-shadow duration-100",
        shape.bg,
        className,
      )}
      style={{
        width: size,
        height: size,
        ...CHECKER_BG,
        boxShadow: ring,
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
      {...props}
    >
      <span className="absolute inset-0" style={{ backgroundColor: color }} />
    </button>
  );
}

ColorSwatch.displayName = "ColorSwatch";

// ---------------------------------------------------------------------------
// SwatchStrip
// ---------------------------------------------------------------------------

export function SwatchStrip({
  swatches,
  current,
  onPick,
}: {
  swatches: string[];
  current: string;
  onPick: (color: string) => void;
}) {
  const normalizedCurrent = useMemo(() => {
    const p = parseColor(current);
    return p ? rgbToHexStr(p.r, p.g, p.b, p.a).toLowerCase() : "";
  }, [current]);

  return (
    // Fixed 8-column grid (20px swatches) so rows never end in a lone orphan.
    <div className="grid grid-cols-[repeat(8,20px)] justify-between gap-y-2 pt-1">
      {swatches.map((sw, i) => {
        const parsed = parseColor(sw);
        const normalized = parsed
          ? rgbToHexStr(parsed.r, parsed.g, parsed.b, parsed.a).toLowerCase()
          : sw.toLowerCase();
        const isSelected = normalized === normalizedCurrent;
        return (
          <ColorSwatch
            key={`${sw}-${i}`}
            color={sw}
            size={20}
            selected={isSelected}
            onClick={() => onPick(sw)}
          />
        );
      })}
    </div>
  );
}
