// @hilum/ui/tokens — JS-first design tokens (D6).
//
// This module is the single source of truth for the Hilum visual identity.
// A build step (scripts/build-tokens.mjs) reads the compiled output of this
// file and emits dist/tokens.css for consumers to `@import`.
//
// Brand model: D8 — fully fixed. No per-app overrides.
// Color modes:  D7 — light + dark, both auto (`prefers-color-scheme`) and
//                    explicit via `[data-theme]`.
//
// Core brand colors:
//   brand.primary   #C100F1 — vivid purple — purple-500 on the scale below
//   brand.secondary #FFF5BF — pale lemon   — butter-200 on the scale below
//
// taupe — neutral spine for text, borders, and structure (unchanged)

export const tokens = {
  /* ============================================================== *
   *  PALETTE — concrete colors                                      *
   * ============================================================== */

  taupe: {
    50: "#f9f7f5",
    100: "#f2eeea",
    200: "#e3dcd4",
    300: "#c9beb3",
    400: "#a8978a",
    500: "#7d6960",
    600: "#5d4e47",
    700: "#4a3d38",
    800: "#332924",
    900: "#26181a",
    950: "#160e0a",
  },

  // Pale lemon — anchor: butter-200 = #FFF5BF
  butter: {
    50: "#ffffe8",
    100: "#fffad0",
    200: "#fff5bf",
    300: "#fde870",
    400: "#f6d42a",
    500: "#dab010",
    600: "#a88008",
    700: "#7c5c04",
    800: "#543e02",
    900: "#382801",
    950: "#221600",
  },

  // Vivid purple — anchor: purple-500 = #C100F1 (brand.primary)
  purple: {
    50: "#fdf0ff",
    100: "#f5d6ff",
    200: "#e8a8ff",
    300: "#d870f9",
    400: "#c840f6",
    500: "#c100f1",
    600: "#9c00c0",
    700: "#740092",
    800: "#4e0062",
    900: "#330040",
    950: "#200028",
  },

  // Legacy functional colors — used by components not yet migrated to the new palette.
  brand: {
    primary: "#C100F1", // purple-500
    secondary: "#FFF5BF", // butter-200
  },

  destructive: "#dc2626", // red-600

  /* ============================================================== *
   *  SEMANTIC — what components reference                           *
   * ============================================================== */

  semantic: {
    light: {
      background: "#ffffff",
      foreground: "#26181a", // taupe-900
      card: "#ffffff",
      cardForeground: "#26181a",
      surface: "#f9f7f5", // taupe-50
      surfaceForeground: "#332924", // taupe-800
      border: "#f2eeea", // taupe-100
      input: "#f2eeea",
      muted: "#f9f7f5",
      mutedForeground: "#7d6960", // taupe-500
      accent: "#fdf0ff", // purple-50
      accentForeground: "#740092", // purple-700
      primary: "#c100f1", // purple-500 = brand.primary
      primaryForeground: "#ffffff",
      secondary: "#f9f7f5", // taupe-50
      secondaryForeground: "#4a3d38", // taupe-700
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#CDEA19", // lime — functional semantic only
      successForeground: "#26181a",
      warning: "#fff5bf", // butter-200 = brand.secondary
      warningForeground: "#26181a", // taupe-900
      ring: "#c100f1", // purple-500 = brand.primary
    },
    dark: {
      background: "#160e0a", // taupe-950
      foreground: "#f9f7f5", // taupe-50
      card: "#26181a", // taupe-900
      cardForeground: "#f9f7f5",
      surface: "#26181a",
      surfaceForeground: "#f2eeea",
      border: "#332924", // taupe-800
      input: "#332924",
      muted: "#26181a",
      mutedForeground: "#a8978a", // taupe-400
      accent: "#330040", // purple-900
      accentForeground: "#f5d6ff", // purple-100
      primary: "#c100f1", // purple-500 — brand stays consistent (D8)
      primaryForeground: "#ffffff",
      secondary: "#26181a",
      secondaryForeground: "#f2eeea",
      destructive: "#ef4444", // red-500 (slightly lighter for dark)
      destructiveForeground: "#ffffff",
      success: "#CDEA19", // lime — functional semantic only
      successForeground: "#160e0a",
      warning: "#221600", // butter-950 surface
      warningForeground: "#fffad0", // butter-100
      ring: "#c100f1", // purple-500 = brand.primary
    },
  },

  /* ============================================================== *
   *  TYPOGRAPHY                                                      *
   * ============================================================== */

  fontFamily: {
    sans: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    serif: '"Instrument Serif", ui-serif, Georgia, serif',
    mono: 'ui-monospace, "SFMono-Regular", "Menlo", "Consolas", monospace',
  },

  /** Type scale utilities — emitted as Tailwind v4 `@utility` blocks. */
  typeScale: {
    "display-xl": { family: "serif", size: "3rem", weight: 400, lineHeight: "1.15" },
    display: { family: "serif", size: "2.25rem", weight: 400, lineHeight: "1.15" },
    "heading-xl": { family: "serif", size: "1.875rem", weight: 400, lineHeight: "1.2" },
    heading: { family: "serif", size: "1.5rem", weight: 400, lineHeight: "1.2" },
    subheading: { family: "serif", size: "1.25rem", weight: 400, lineHeight: "1.4" },
    "body-lg": { family: "sans", size: "1rem", weight: 400, lineHeight: "1.625" },
    body: { family: "sans", size: "0.875rem", weight: 400, lineHeight: "1.625" },
    caption: { family: "sans", size: "0.75rem", weight: 400, lineHeight: "1.625" },
    "caption-xs": { family: "sans", size: "0.625rem", weight: 400, lineHeight: "1.625" },
    label: {
      family: "sans",
      size: "0.75rem",
      weight: 600,
      lineHeight: "1",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
    },
  },

  /* ============================================================== *
   *  GEOMETRY                                                        *
   * ============================================================== */

  radius: {
    base: "0.5rem",
    sm: "calc(0.5rem - 4px)",
    md: "calc(0.5rem - 2px)",
    lg: "0.5rem",
    xl: "calc(0.5rem + 4px)",
    full: "9999px",
  },

  shadow: {
    natural:
      "0 0px 0px 1px rgba(0, 0, 0, 0.06), 0 1px 1px -0.5px rgba(0, 0, 0, 0.06), 0 3px 3px -1.5px rgba(0, 0, 0, 0.06)",
    elevated:
      "0 0px 0px 1px rgba(0, 0, 0, 0.06), 0 1px 1px -0.5px rgba(0, 0, 0, 0.06), 0 3px 3px -1.5px rgba(0, 0, 0, 0.06), 0 6px 6px -3px rgba(0, 0, 0, 0.06), 0 12px 12px -6px rgba(0, 0, 0, 0.04), 0 24px 24px -12px rgba(0, 0, 0, 0.04), 0 24px 24px 2px rgba(0, 0, 0, 0.1)",
  },

  /* ============================================================== *
   *  ANIMATION                                                       *
   * ============================================================== */

  animation: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
    "caret-blink": "caret-blink 1.25s ease-out infinite",
  },
} as const;

export type Tokens = typeof tokens;
export type SemanticTokens = typeof tokens.semantic.light;
