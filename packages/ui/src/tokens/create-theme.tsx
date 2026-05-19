// @hilum/ui — createTheme: per-product color theming API.
//
// Generates a full 11-shade OKLCH palette from primary and secondary hex anchors,
// then emits a CSS override string that products inject after tokens.css.
//
// No external dependencies — OKLCH math is inlined (~100 lines).
// createTheme() is pure and works in Node (build scripts) and browser.
// applyTheme() and ThemeProvider require a browser / Electron environment.

import * as React from "react";

export interface ThemeConfig {
  /** Hex color used as the 500-level anchor for the primary palette. */
  primary: string;
  /** Hex color used as the 500-level anchor for the secondary palette. */
  secondary: string;
}

export interface ThemeResult {
  /** Complete CSS override string. Inject via <style> or write to a .css file. */
  css: string;
  /** Generated palette shades for programmatic access. */
  palette: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
  };
}

/* ------------------------------------------------------------------ *
 *  OKLCH math (Björn Ottosson — no external deps)                     *
 * ------------------------------------------------------------------ */

function toLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function toGamma(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}

function hexToOklch(hex: string): [number, number, number] {
  const r = toLinear(parseInt(hex.slice(1, 3), 16) / 255);
  const g = toLinear(parseInt(hex.slice(3, 5), 16) / 255);
  const b = toLinear(parseInt(hex.slice(5, 7), 16) / 255);

  // linear sRGB → XYZ D65
  const X = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const Y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
  const Z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;

  // XYZ → OKLab
  const l_ = Math.cbrt(0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z);
  const m_ = Math.cbrt(0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z);
  const s_ = Math.cbrt(0.0482003018 * X + 0.2643662691 * Y + 0.6338517070 * Z);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bv = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + bv * bv);
  let H = (Math.atan2(bv, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return [L, C, H];
}

function oklchToLinearRgb(L: number, C: number, H: number): [number, number, number] {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const bv = C * Math.sin(hRad);

  // OKLab → XYZ
  const l_ = L + 0.3963377774 * a + 0.2158037573 * bv;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bv;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * bv;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // XYZ → linear sRGB
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  return [r, g, b];
}

function inSrgbGamut(r: number, g: number, b: number): boolean {
  return r >= -1e-6 && r <= 1 + 1e-6 && g >= -1e-6 && g <= 1 + 1e-6 && b >= -1e-6 && b <= 1 + 1e-6;
}

function oklchToHex(L: number, C: number, H: number): string {
  // Reduce chroma via binary search until in sRGB gamut.
  if (!inSrgbGamut(...oklchToLinearRgb(L, C, H))) {
    let lo = 0;
    let hi = C;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      inSrgbGamut(...oklchToLinearRgb(L, mid, H)) ? (lo = mid) : (hi = mid);
    }
    C = lo;
  }
  const [r, g, b] = oklchToLinearRgb(L, C, H);
  const ch = (c: number) =>
    Math.round(Math.max(0, Math.min(1, toGamma(c))) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(r)}${ch(g)}${ch(b)}`;
}

/* ------------------------------------------------------------------ *
 *  Palette generation                                                  *
 * ------------------------------------------------------------------ */

const SHADE_KEYS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function generatePalette(hex: string): Record<string, string> {
  const [L0, C0, H] = hexToOklch(hex);
  const palette: Record<string, string> = {};

  SHADE_KEYS.forEach((key, i) => {
    if (i === 5) {
      palette[key] = hex.toLowerCase();
      return;
    }
    let L: number, C: number;
    if (i < 5) {
      // Lighter shades: interpolate toward 0.975, fade chroma
      const t = (5 - i) / 5;
      L = lerp(L0, 0.975, t);
      C = C0 * (1 - t * 0.8);
    } else {
      // Darker shades: interpolate toward 0.145, fade chroma slightly
      const t = (i - 5) / 5;
      L = lerp(L0, 0.145, t);
      C = C0 * (1 - t * 0.4);
    }
    palette[key] = oklchToHex(L, C, H);
  });

  return palette;
}

/* ------------------------------------------------------------------ *
 *  Foreground auto-detection                                           *
 * ------------------------------------------------------------------ */

const TAUPE_900 = "#26181a";

// WCAG relative luminance Y (XYZ). Threshold ≈ 0.179 gives equal contrast
// with black and white: use dark text above, white text at or below.
function relativeLuminance(hex: string): number {
  const r = toLinear(parseInt(hex.slice(1, 3), 16) / 255);
  const g = toLinear(parseInt(hex.slice(3, 5), 16) / 255);
  const b = toLinear(parseInt(hex.slice(5, 7), 16) / 255);
  return 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
}

function autoFg(hex: string): string {
  return relativeLuminance(hex) > 0.179 ? TAUPE_900 : "#ffffff";
}

/* ------------------------------------------------------------------ *
 *  CSS emission                                                        *
 * ------------------------------------------------------------------ */

function buildCss(
  p: Record<string, string>,
  s: Record<string, string>,
  primaryHex: string,
  secondaryHex: string,
): string {
  const pfg = autoFg(primaryHex);

  const lightBlock = [
    `  --color-brand-primary: ${primaryHex};`,
    `  --color-brand-secondary: ${secondaryHex};`,
    `  --primary: ${primaryHex};`,
    `  --primary-foreground: ${pfg};`,
    `  --accent: ${p["50"]};`,
    `  --accent-foreground: ${p["700"]};`,
    `  --ring: ${primaryHex};`,
    `  --warning: ${s["200"]};`,
    `  --warning-foreground: ${TAUPE_900};`,
    // Palette vars for product CSS use (not registered as Tailwind utilities)
    ...SHADE_KEYS.map((k) => `  --color-primary-${k}: ${p[k]};`),
    ...SHADE_KEYS.map((k) => `  --color-secondary-${k}: ${s[k]};`),
  ].join("\n");

  const darkBlock = [
    `  --color-brand-primary: ${primaryHex};`,
    `  --color-brand-secondary: ${secondaryHex};`,
    `  --primary: ${primaryHex};`,
    `  --primary-foreground: #ffffff;`,
    `  --accent: ${p["900"]};`,
    `  --accent-foreground: ${p["100"]};`,
    `  --ring: ${primaryHex};`,
    `  --warning: ${s["900"]};`,
    `  --warning-foreground: ${s["100"]};`,
  ].join("\n");

  const darkMediaBlock = darkBlock
    .split("\n")
    .map((l) => `  ${l}`)
    .join("\n");

  return `/* @hilum/ui theme override — generated by createTheme() */
:root {
${lightBlock}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${darkMediaBlock}
  }
}

[data-theme="dark"] {
${darkBlock}
}
`;
}

/* ------------------------------------------------------------------ *
 *  Public API                                                          *
 * ------------------------------------------------------------------ */

export function createTheme(config: ThemeConfig): ThemeResult {
  const primary = config.primary.trim().toLowerCase();
  const secondary = config.secondary.trim().toLowerCase();
  const p = generatePalette(primary);
  const s = generatePalette(secondary);
  return { css: buildCss(p, s, primary, secondary), palette: { primary: p, secondary: s } };
}

/** Injects the theme CSS into `document.head`. Returns a cleanup function. */
export function applyTheme(config: ThemeConfig): () => void {
  if (typeof document === "undefined") return () => {};
  // Remove any stale theme override from a prior call.
  document.querySelectorAll("style[data-hilum-theme]").forEach((el) => el.remove());
  const { css } = createTheme(config);
  const style = document.createElement("style");
  style.dataset.hilumTheme = "";
  style.textContent = css;
  document.head.appendChild(style);
  return () => {
    if (style.parentNode) style.parentNode.removeChild(style);
  };
}

/** React component that applies the theme on mount and cleans up on unmount. */
export function ThemeProvider({
  primary,
  secondary,
  children,
}: ThemeConfig & { children: React.ReactNode }) {
  React.useEffect(() => applyTheme({ primary, secondary }), [primary, secondary]);
  return <>{children}</>;
}
