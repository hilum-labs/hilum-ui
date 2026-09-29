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

// Surface elevation ladder helper. Level 1 is a hairline ring only; every
// step above adds one more (progressively softer, larger) drop layer, so
// shadow weight grows monotonically with the surface level. `ring` is the
// hairline edge colour, `drop` the drop-shadow colour at a given alpha.
const surfaceShadowRamp = (ring: string, drop: (alpha: number) => string) => {
  const layers = [
    `0 0 0 1px ${ring}`,
    `0 1px 1px -0.5px ${drop(0.06)}, 0 3px 3px -1.5px ${drop(0.06)}`,
    `0 6px 6px -3px ${drop(0.06)}`,
    `0 12px 12px -6px ${drop(0.04)}`,
    `0 24px 24px -12px ${drop(0.04)}`,
    `0 24px 24px 2px ${drop(0.08)}`,
    `0 32px 40px 4px ${drop(0.1)}`,
    `0 48px 56px 8px ${drop(0.12)}`,
  ];
  return [1, 2, 3, 4, 5, 6, 7, 8].map((level) => layers.slice(0, level).join(", "));
};

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

  // Categorical hues — label/tag colours (Badge `color`, chart series, …).
  // Theme-independent: consumers tint them against the current background
  // (e.g. `color-mix(in srgb, var(--categorical-red) 15%, var(--background))`).
  // Emitted as `--categorical-<name>` on :root and as Tailwind colours
  // (`bg-categorical-red`, `text-categorical-blue`, …).
  categorical: {
    gray: "#a3a3a3",
    red: "#ef4444",
    orange: "#f97316",
    amber: "#f59e0b",
    yellow: "#eab308",
    lime: "#84cc16",
    green: "#22c55e",
    emerald: "#10b981",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    blue: "#3b82f6",
    indigo: "#6366f1",
    violet: "#8b5cf6",
    purple: "#a855f7",
    fuchsia: "#d946ef",
    pink: "#ec4899",
    rose: "#f43f5e",
  },

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
      // ground-200 on white ≈ 1.26:1 — the same hairline weight Figma/Linear use
      // for panel and field edges (#f5f5f5 was ~1.09:1 and read as invisible).
      border: "#e5e5e5", // ground-200
      borderStrong: "#d4d4d4", // ground-300 — hover / emphasised edges
      input: "#e5e5e5", // input edge (border-input) — matches border
      muted: "#fafafa",
      mutedForeground: "#737373", // ground-500
      accent: "#fdf0ff", // purple-50
      accentForeground: "#740092", // purple-700
      // Neutral interaction washes behind `bg-hover` / `bg-active` (tabs,
      // accordions, radio/checkbox groups, ghost + outline buttons).
      hover: "rgba(23, 23, 23, 0.05)",
      active: "rgba(23, 23, 23, 0.08)",
      primary: "#c100f1", // purple-500 = brand.primary
      primaryForeground: "#ffffff",
      // Brand-coloured text that stays readable (≥ 4.5:1) on every surface and
      // on the brand tint behind active nav items (`bg-brand-primary/10`–`/15`).
      // brand.primary itself is only 3.9:1 on its own 10% tint.
      brandText: "#9c00c0", // purple-600
      secondary: "#fafafa", // ground-50
      secondaryForeground: "#404040", // ground-700
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#CDEA19", // lime — functional semantic only
      successForeground: "#171717",
      warning: "#fff5bf", // butter-200 = brand.secondary
      warningForeground: "#171717", // ground-900
      ring: "#c100f1", // purple-500 = brand.primary
      // Transparency checkerboard (colour picker alpha track, swatches).
      checkerA: "#ffffff",
      checkerB: "#e5e5e5",
      // Editor workspace behind floating chrome (Figma-style grey canvas),
      // one step below panels so they read as raised in every theme.
      canvas: "#f5f5f5", // ground-100
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
      borderStrong: "#bdbdbd", // hover / emphasised edges
      input: "#a3a3a3", // input edge (border-input) — matches border
      muted: "#525252", // ground-600
      mutedForeground: "#e5e5e5", // ground-200 (designer text-secondary)
      accent: "#404040", // ground-700 (designer item-hover-bg)
      accentForeground: "#fafafa",
      hover: "rgba(255, 255, 255, 0.08)",
      active: "rgba(255, 255, 255, 0.13)",
      primary: "#c100f1", // brand stays consistent across themes
      primaryForeground: "#ffffff",
      // No purple is readable on the mid gray (#fdf0ff is 4.3:1 on the
      // hovered tint); the brand tint behind it carries the colour.
      brandText: "#ffffff",
      secondary: "#525252", // ground-600
      secondaryForeground: "#fafafa",
      destructive: "#ef4444", // red-500
      destructiveForeground: "#ffffff",
      success: "#CDEA19", // lime — functional semantic only
      successForeground: "#171717",
      warning: "#fff5bf", // butter-200
      warningForeground: "#171717",
      ring: "#c100f1",
      checkerA: "#8a8a8a",
      checkerB: "#6b6b6b",
      canvas: "#636363",
    },
    dark: {
      background: "#171717", // ground-900 — designer canvas (deepest)
      foreground: "#fafafa", // ground-50
      card: "#262626", // ground-800 — designer panel-bg (elevated over bg)
      cardForeground: "#fafafa",
      surface: "#1a1a1a", // designer item-hover depth
      surfaceForeground: "#f5f5f5",
      // ≈2:1 against the page background and ~1.7:1 against card panels;
      // #404040 (1.73:1 vs bg) blended into panels at small sizes.
      border: "#4a4a4a",
      borderStrong: "#5c5c5c", // hover / emphasised edges
      input: "#4a4a4a", // input edge (border-input) — matches border
      muted: "#262626", // ground-800
      mutedForeground: "#a3a3a3", // ground-400
      accent: "#404040", // ground-700 — neutral elevated/hover (designer item-hover)
      accentForeground: "#fafafa",
      hover: "rgba(250, 250, 250, 0.06)",
      active: "rgba(250, 250, 250, 0.1)",
      primary: "#c100f1", // purple-500 — brand stays consistent (D8)
      primaryForeground: "#ffffff",
      brandText: "#d870f9", // purple-300
      secondary: "#262626", // ground-800
      secondaryForeground: "#f5f5f5",
      destructive: "#ef4444", // red-500 (slightly lighter for dark)
      destructiveForeground: "#ffffff",
      success: "#CDEA19", // lime — functional semantic only
      successForeground: "#0a0a0a",
      warning: "#221600", // butter-950 surface
      warningForeground: "#fffad0", // butter-100
      ring: "#c100f1", // purple-500 = brand.primary
      checkerA: "#4a4a4a",
      checkerB: "#333333",
      canvas: "#1c1c1c",
    },
  },

  /* ============================================================== *
   *  SURFACES — elevation ladder (levels 1–8)                        *
   * ============================================================== *
   * Consumed via surfaceClasses() / <Elevated> / SurfaceProvider:
   * `bg-surface-N`, `shadow-surface-N`, and the raw `var(--surface-N)`
   * (scroll-fade gradients). Level 1 is the page substrate; each nested
   * layer (popover +2, dialog +4, …) walks up the ladder. Index 0 = level 1.
   *
   * Light: surfaces stay white (matching card/popover) and elevation is
   *        carried by the shadow ramp, the house style.
   * Mid/Dark: surfaces step lighter/darker per level so nested layers stay
   *        distinguishable where drop shadows barely read. */
  surfaces: {
    light: {
      bg: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
      shadow: surfaceShadowRamp("rgba(0, 0, 0, 0.06)", (a) => `rgba(0, 0, 0, ${a})`),
    },
    mid: {
      // background (#737373) → card (#525252) → ground-700 (#404040)
      bg: ["#737373", "#6b6b6b", "#636363", "#5b5b5b", "#525252", "#4d4d4d", "#474747", "#404040"],
      shadow: surfaceShadowRamp(
        "rgba(0, 0, 0, 0.14)",
        (a) => `rgba(0, 0, 0, ${Math.min(a * 2.5, 0.3)})`,
      ),
    },
    dark: {
      // background (#171717) → card (#262626) → accent (#404040)
      bg: ["#171717", "#1f1f1f", "#262626", "#2b2b2b", "#303030", "#353535", "#3a3a3a", "#404040"],
      shadow: surfaceShadowRamp(
        "rgba(255, 255, 255, 0.08)",
        (a) => `rgba(0, 0, 0, ${Math.min(a * 4, 0.4)})`,
      ),
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
    /** 11px — dense metadata (table sub-lines, chips, editor hints). Use instead of text-[11px]. */
    "caption-sm": { family: "sans", size: "0.6875rem", weight: 400, lineHeight: "1.5" },
    /** 10px — the floor. Use instead of text-[10px]; keep to non-essential metadata. */
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
   *  DENSITY — control sizing tiers                                  *
   * ============================================================== *
   * Emitted as `--density-*` custom properties: `:root` carries the
   * default tier, `[data-density="compact"]` the editor-chrome tier.
   * Components switch via the `compact:` Tailwind variant (same
   * attribute); consumers can read the vars for bespoke controls.
   * `field` / `fieldHover` are the compact tier's filled field surfaces
   * and `divider` its section hairline; the default tier maps them to
   * the plain background and border. */
  density: {
    default: {
      controlHeight: "32px",
      inputHeight: "36px",
      rowHeight: "36px",
      text: "14px",
      label: "12px",
      menuItemHeight: "40px",
      menuText: "14px",
      paddingX: "12px",
      radius: "8px",
      field: "var(--background)",
      fieldHover: "var(--background)",
      divider: "var(--border)",
    },
    compact: {
      controlHeight: "24px",
      inputHeight: "24px",
      rowHeight: "28px",
      text: "12px",
      label: "11px",
      menuItemHeight: "28px",
      menuText: "13px",
      paddingX: "8px",
      radius: "5px",
      field: "color-mix(in srgb, var(--foreground) 5%, transparent)",
      fieldHover: "color-mix(in srgb, var(--foreground) 8%, transparent)",
      divider: "color-mix(in srgb, var(--foreground) 8%, transparent)",
    },
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
    "hilum-orbit": "hilum-orbit 1.4s ease-in-out infinite",
    "hilum-spring-in": "hilum-spring-in 180ms cubic-bezier(0.2, 0.9, 0.2, 1.15)",
    "hilum-thinking": "hilum-thinking 1.1s ease-in-out infinite",
  },
} as const;

export type Tokens = typeof tokens;
export type SemanticTokens = typeof tokens.semantic.light;
