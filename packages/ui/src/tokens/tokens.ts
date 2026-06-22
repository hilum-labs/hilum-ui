// @hilum/ui/tokens — JS-first design tokens (D6).
//
// This module is the single source of truth for the Hilum visual identity.
// A build step (scripts/build-tokens.mjs) reads the compiled output of this
// file and emits dist/tokens.css for consumers to `@import`.
//
// Brand model: D8 — base palette is fixed here. Per-product overrides are
//               applied at runtime via createTheme() in @hilum/ui/create-theme.
// Color modes:  D7 — light + dark, both auto (`prefers-color-scheme`) and
//                    explicit via `[data-theme]`.
//
// Core brand colors:
//   brand.primary   #C100F1 — vivid purple — purple-500 on the scale below
//   brand.secondary #FFF5BF — pale lemon   — butter-200 on the scale below
//
// ground — neutral spine for text, borders, and structure (values: Tailwind neutral)

export const tokens = {
  /* ============================================================== *
   *  PALETTE — concrete colors                                      *
   * ============================================================== */

  ground: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
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
      foreground: "#171717", // ground-900
      card: "#ffffff",
      cardForeground: "#171717",
      surface: "#fafafa", // ground-50
      surfaceForeground: "#262626", // ground-800
      border: "#f5f5f5", // ground-100
      input: "#f5f5f5",
      muted: "#fafafa",
      mutedForeground: "#737373", // ground-500
      accent: "#fdf0ff", // purple-50
      accentForeground: "#740092", // purple-700
      primary: "#c100f1", // purple-500 = brand.primary
      primaryForeground: "#ffffff",
      secondary: "#fafafa", // ground-50
      secondaryForeground: "#404040", // ground-700
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#CDEA19", // lime — functional semantic only
      successForeground: "#171717",
      warning: "#fff5bf", // butter-200 = brand.secondary
      warningForeground: "#171717", // ground-900
      ring: "#c100f1", // purple-500 = brand.primary
    },
    // Mid — a neutral medium-gray theme (from the Pappery designer "mid" palette,
    // mapped onto the ground scale). Sits between light and dark.
    mid: {
      background: "#737373", // ground-500 — main surface (designer panel)
      foreground: "#fafafa", // ground-50
      card: "#525252", // ground-600 — elevated items (designer item-bg)
      cardForeground: "#fafafa",
      surface: "#525252", // ground-600 (designer canvas/pane)
      surfaceForeground: "#fafafa",
      border: "#a3a3a3", // ground-400 (designer border — lighter so it reads on the gray)
      input: "#404040", // ground-700 (designer input-bg)
      muted: "#525252", // ground-600
      mutedForeground: "#e5e5e5", // ground-200 (designer text-secondary)
      accent: "#404040", // ground-700 (designer item-hover-bg)
      accentForeground: "#fafafa",
      primary: "#c100f1", // brand stays consistent across themes
      primaryForeground: "#ffffff",
      secondary: "#525252", // ground-600
      secondaryForeground: "#fafafa",
      destructive: "#ef4444", // red-500
      destructiveForeground: "#ffffff",
      success: "#CDEA19", // lime — functional semantic only
      successForeground: "#171717",
      warning: "#fff5bf", // butter-200
      warningForeground: "#171717",
      ring: "#c100f1",
    },
    dark: {
      background: "#171717", // ground-900 — designer canvas (deepest)
      foreground: "#fafafa", // ground-50
      card: "#262626", // ground-800 — designer panel-bg (elevated over bg)
      cardForeground: "#fafafa",
      surface: "#1a1a1a", // designer item-hover depth
      surfaceForeground: "#f5f5f5",
      border: "#404040", // ground-700 — designer border (reads on the dark)
      input: "#262626", // ground-800
      muted: "#262626", // ground-800
      mutedForeground: "#a3a3a3", // ground-400
      accent: "#404040", // ground-700 — neutral elevated/hover (designer item-hover)
      accentForeground: "#fafafa",
      primary: "#c100f1", // purple-500 — brand stays consistent (D8)
      primaryForeground: "#ffffff",
      secondary: "#262626", // ground-800
      secondaryForeground: "#f5f5f5",
      destructive: "#ef4444", // red-500 (slightly lighter for dark)
      destructiveForeground: "#ffffff",
      success: "#CDEA19", // lime — functional semantic only
      successForeground: "#0a0a0a",
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
    display:
      'Gabarito, Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'ui-monospace, "SFMono-Regular", "Menlo", "Consolas", monospace',
  },

  /** Type scale utilities — emitted as Tailwind v4 `@utility` blocks. */
  typeScale: {
    "display-xl": {
      family: "display",
      size: "3rem",
      weight: 400,
      lineHeight: "1.15",
      textWrap: "balance",
    },
    display: {
      family: "display",
      size: "2.25rem",
      weight: 400,
      lineHeight: "1.15",
      textWrap: "balance",
    },
    "heading-xl": {
      family: "display",
      size: "1.875rem",
      weight: 400,
      lineHeight: "1.2",
      textWrap: "balance",
    },
    heading: {
      family: "display",
      size: "1.5rem",
      weight: 400,
      lineHeight: "1.2",
      textWrap: "balance",
    },
    subheading: {
      family: "display",
      size: "1.25rem",
      weight: 400,
      lineHeight: "1.4",
      textWrap: "balance",
    },
    "body-lg": {
      family: "sans",
      size: "1rem",
      weight: 400,
      lineHeight: "1.625",
      textWrap: "pretty",
    },
    body: {
      family: "sans",
      size: "0.875rem",
      weight: 400,
      lineHeight: "1.625",
      textWrap: "pretty",
    },
    "body-sm": {
      family: "sans",
      size: "0.75rem",
      weight: 500,
      lineHeight: "1.625",
      textWrap: "pretty",
    },
    caption: {
      family: "sans",
      size: "0.75rem",
      weight: 400,
      lineHeight: "1.625",
      textWrap: "pretty",
    },
    "caption-xs": { family: "sans", size: "0.625rem", weight: 400, lineHeight: "1.625" },

    /* --- "Eyebrow" family — uppercase tracked label used above headlines, --- *
     *   on badges, and on section markers. `eyebrow` is the canonical name;   *
     *   `overline` (Material parlance), `kicker` (editorial parlance) and     *
     *   `label` (legacy) are aliases of the same scale so consumers can pick  *
     *   whichever vocabulary reads best in their context. `eyebrow-sm` is    *
     *   the compact variant for badge-sized chips and tiny status pills.      */
    eyebrow: {
      family: "sans",
      size: "0.75rem",
      weight: 600,
      lineHeight: "1",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
    },
    "eyebrow-sm": {
      family: "sans",
      size: "0.625rem",
      weight: 600,
      lineHeight: "1",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
    },
    overline: {
      family: "sans",
      size: "0.75rem",
      weight: 600,
      lineHeight: "1",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
    },
    kicker: {
      family: "sans",
      size: "0.75rem",
      weight: 600,
      lineHeight: "1",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
    },
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
    lg: "calc(0.5rem + 2px)",
    xl: "calc(0.5rem + 4px)",
    full: "9999px",
  },

  /* ============================================================== *
   *  Z-INDEX — semantic layering scale                              *
   * ============================================================== */

  zIndex: {
    dropdown: 40,
    sticky: 50,
    fixed: 60,
    modal: 100,
    popover: 110,
    tooltip: 120,
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
