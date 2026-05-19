import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Input, Separator } from "@hilum/ui";
import { createTheme } from "@hilum/ui/create-theme";

/* ------------------------------------------------------------------ *
 *  Code snippets                                                       *
 * ------------------------------------------------------------------ */

const INSTALL_PNPM = `pnpm add @hilum/ui`;
const INSTALL_NPM = `npm install @hilum/ui`;
const INSTALL_YARN = `yarn add @hilum/ui`;

const SETUP_CSS = `/* globals.css */
@import "tailwindcss";
@import "@hilum/ui/tokens.css";`;

const USAGE_PROVIDER = `import { ThemeProvider } from "@hilum/ui/create-theme"

export function App() {
  return (
    <ThemeProvider primary="#0066FF" secondary="#FF9900">
      <Router />
    </ThemeProvider>
  )
}`;

const USAGE_APPLY = `import { applyTheme } from "@hilum/ui/create-theme"

// Call once at app startup (browser / Electron only)
applyTheme({ primary: "#0066FF", secondary: "#FF9900" })`;

const USAGE_CREATE = `import { createTheme } from "@hilum/ui/create-theme"

// Pure function — works in Node too (build scripts, SSG)
const { css, palette } = createTheme({
  primary:   "#0066FF",   // 500-level anchor → 11 shades generated
  secondary: "#FF9900",
})

// css  → inject into <style> or write to a .css file
// palette.primary["50"]  → "#f2f7ff"  (lightest tint)
// palette.primary["500"] → "#0066ff"  (your exact input)
// palette.primary["950"] → "#000723"  (darkest shade)`;

const USAGE_MANUAL_CSS = `/* product-theme.css — loaded after tokens.css */
:root {
  --color-brand-primary:   #0066FF;
  --color-brand-secondary: #FF9900;
  --primary:               #0066FF;
  --primary-foreground:    #ffffff;
  --accent:                #f2f7ff;
  --accent-foreground:     #003d9f;
  --ring:                  #0066FF;
}`;

/* ------------------------------------------------------------------ *
 *  Palette generator — interactive demo                               *
 * ------------------------------------------------------------------ */

const SHADE_KEYS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

function relativeLuminance(hex: string): number {
  const toL = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return (
    0.2126 * toL(parseInt(hex.slice(1, 3), 16) / 255) +
    0.7152 * toL(parseInt(hex.slice(3, 5), 16) / 255) +
    0.0722 * toL(parseInt(hex.slice(5, 7), 16) / 255)
  );
}

function PaletteGenerator() {
  const [primary, setPrimary] = useState("#c100f1");
  const [secondary, setSecondary] = useState("#fff5bf");

  const { palette } = useMemo(
    () => createTheme({ primary, secondary }),
    [primary, secondary],
  );

  const pfg = relativeLuminance(primary) > 0.179 ? "#26181a" : "#ffffff";

  const previewVars = {
    "--color-brand-primary": primary,
    "--color-brand-secondary": secondary,
    "--primary": primary,
    "--primary-foreground": pfg,
    "--accent": palette.primary["50"],
    "--accent-foreground": palette.primary["700"],
    "--ring": primary,
    "--warning": palette.secondary["200"],
  } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-6">
      {/* Color pickers */}
      <div className="flex flex-wrap items-end gap-6">
        <ColorPicker
          label="Primary"
          value={primary}
          onChange={setPrimary}
          palette={palette.primary}
        />
        <ColorPicker
          label="Secondary"
          value={secondary}
          onChange={setSecondary}
          palette={palette.secondary}
        />
      </div>

      {/* Palette swatches */}
      <div className="flex flex-col gap-3">
        <PaletteRow label="Primary" shades={palette.primary} />
        <PaletteRow label="Secondary" shades={palette.secondary} />
      </div>

      {/* Live component preview */}
      <div>
        <p className="caption mb-3 text-taupe-400">Live component preview</p>
        <div
          className="flex flex-wrap items-center gap-3 rounded-xl border border-taupe-100 p-5"
          style={previewVars}
        >
          <Button>Primary</Button>
          <Button variant="brand">Brand</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Separator orientation="vertical" className="h-8" />
          <Badge variant="brand">Brand</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Separator orientation="vertical" className="h-8" />
          <Input placeholder="Focus ring color →" className="w-48" />
        </div>
      </div>
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
  palette,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  palette: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="caption font-medium text-taupe-500">{label}</p>
      <div className="flex items-center gap-2">
        <label className="relative cursor-pointer">
          <div
            className="size-9 rounded-md border border-taupe-200 shadow-natural"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value.trim();
            if (/^#([0-9a-fA-F]{3}){1,2}$/.test(v)) onChange(v);
          }}
          spellCheck={false}
          className="h-9 w-28 rounded-md border border-taupe-200 bg-white px-3 font-mono caption text-taupe-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        />
      </div>
      <p className="caption-xs text-taupe-300">
        {label}-500 anchor · 11 shades generated
      </p>
    </div>
  );
}

function PaletteRow({
  label,
  shades,
}: {
  label: string;
  shades: Record<string, string>;
}) {
  return (
    <div>
      <p className="caption mb-1.5 text-taupe-400">{label}</p>
      <div className="flex gap-1">
        {SHADE_KEYS.map((k) => {
          const hex = shades[k];
          const isDark = relativeLuminance(hex) <= 0.179;
          return (
            <div key={k} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="h-8 w-full rounded-md"
                style={{ backgroundColor: hex }}
                title={hex}
              />
              <p
                className="caption-xs font-mono text-taupe-400 hidden sm:block"
                style={{ fontSize: "9px" }}
              >
                {k}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Code block                                                          *
 * ------------------------------------------------------------------ */

function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-xl">
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute right-3 top-3 z-10 flex h-7 items-center gap-1.5 rounded-md bg-taupe-800 px-2.5 caption font-medium text-taupe-300 hover:bg-taupe-700 hover:text-white transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="overflow-x-auto bg-taupe-950 px-5 py-5 caption leading-relaxed">
        <code className="font-mono text-taupe-300">{code}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  API reference table                                                 *
 * ------------------------------------------------------------------ */

const apiRows = [
  {
    name: "createTheme(config)",
    sig: "ThemeConfig → ThemeResult",
    desc: "Pure function. Generates palettes and returns { css, palette }. Works in Node and browser.",
  },
  {
    name: "applyTheme(config)",
    sig: "ThemeConfig → () => void",
    desc: "Injects a <style> tag into document.head. Returns a cleanup function. Browser / Electron only.",
  },
  {
    name: "<ThemeProvider>",
    sig: "ThemeConfig + children",
    desc: "React component. Calls applyTheme in useEffect, auto-cleans up on unmount or prop change.",
  },
];

const configRows = [
  { prop: "primary", type: "string", desc: "Hex color. Used as the 500-level anchor for the primary palette." },
  { prop: "secondary", type: "string", desc: "Hex color. Used as the 500-level anchor for the secondary palette." },
];

const resultRows = [
  { prop: "css", type: "string", desc: "Complete CSS override string. Inject via <style> or write to a .css file." },
  { prop: "palette.primary", type: "Record<string, string>", desc: 'Generated shades: { "50": "#f2f7ff", …, "950": "#000723" }' },
  { prop: "palette.secondary", type: "Record<string, string>", desc: "Same structure for the secondary color." },
];

/* ------------------------------------------------------------------ *
 *  What gets overridden table                                          *
 * ------------------------------------------------------------------ */

const overrideRows = [
  { var: "--color-brand-primary", value: "primary hex", affects: "bg-brand-primary, text-brand-primary, ring-brand-primary — Button, Badge, Input focus rings" },
  { var: "--color-brand-secondary", value: "secondary hex", affects: "bg-brand-secondary, border-brand-secondary — Badge success/warning, Button brand" },
  { var: "--primary", value: "primary hex", affects: "Semantic primary token" },
  { var: "--primary-foreground", value: "auto (WCAG)", affects: "Text on primary surfaces" },
  { var: "--accent / --accent-foreground", value: "primary-50 / primary-700", affects: "Hover tints, accent surfaces" },
  { var: "--ring", value: "primary hex", affects: "Focus rings on all interactive elements" },
  { var: "--warning / --warning-foreground", value: "secondary-200 / taupe-900", affects: "Warning banners and callouts" },
  { var: "--color-primary-{50…950}", value: "generated palette", affects: "Product CSS: var(--color-primary-100), etc." },
  { var: "--color-secondary-{50…950}", value: "generated palette", affects: "Product CSS: var(--color-secondary-100), etc." },
];

/* ------------------------------------------------------------------ *
 *  Section heading                                                     *
 * ------------------------------------------------------------------ */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Page                                                               *
 * ------------------------------------------------------------------ */

export default function ThemingPage() {
  const [pkgManager, setPkgManager] = useState<"pnpm" | "npm" | "yarn">("pnpm");
  const installCode = pkgManager === "pnpm" ? INSTALL_PNPM : pkgManager === "npm" ? INSTALL_NPM : INSTALL_YARN;

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <Link to="/" className="hover:text-taupe-700">Design System</Link>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Theming</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Theming</h1>
        <p className="body max-w-lg text-taupe-500">
          Per-product color customization via OKLCH palette generation. Pass two
          hex values — get a full 11-shade palette and a CSS override ready to
          inject.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-taupe-100 pt-5">
          <Badge variant="secondary">@hilum/ui/create-theme</Badge>
          <span className="caption text-taupe-300">No external dependencies · Works in Node + browser</span>
        </div>
      </div>

      <div className="flex flex-col gap-14">

        {/* ── Installation ──────────────────────────────────────────── */}
        <section id="installation">
          <SectionHeading label="Installation" />

          <div className="mb-4 flex gap-1">
            {(["pnpm", "npm", "yarn"] as const).map((pm) => (
              <button
                key={pm}
                onClick={() => setPkgManager(pm)}
                className={[
                  "rounded-md px-3 py-1.5 caption font-medium transition-colors",
                  pkgManager === pm
                    ? "bg-taupe-900 text-white"
                    : "text-taupe-500 hover:bg-taupe-100",
                ].join(" ")}
              >
                {pm}
              </button>
            ))}
          </div>
          <CodeBlock code={installCode} language="bash" />

          <div className="mt-4">
            <p className="caption mb-2 text-taupe-400">
              Then import the base token CSS in your globals:
            </p>
            <CodeBlock code={SETUP_CSS} language="css" />
          </div>

          <div className="mt-4 rounded-xl border border-taupe-100 bg-taupe-50 p-4">
            <p className="caption font-semibold text-taupe-700">Peer dependencies</p>
            <p className="caption mt-1 text-taupe-400">
              <code className="font-mono text-taupe-600">react@^19</code> and{" "}
              <code className="font-mono text-taupe-600">react-dom@^19</code> are required.
              <code className="font-mono text-taupe-600 ml-2">tailwindcss@^4</code> is required in any app that uses the token utilities.
            </p>
          </div>
        </section>

        {/* ── Palette Generator ─────────────────────────────────────── */}
        <section id="palette-generator">
          <SectionHeading label="Palette generator" />
          <p className="body mb-6 max-w-lg text-taupe-500">
            Pick any two hex colors. The algorithm treats your input as the
            500-level anchor and generates 11 perceptually-uniform shades via
            OKLCH color space interpolation.
          </p>
          <div className="overflow-hidden rounded-xl border border-taupe-100">
            <div className="border-b border-taupe-100 bg-white px-5 py-3">
              <p className="subheading text-taupe-900">Interactive preview</p>
              <p className="caption mt-0.5 text-taupe-400">
                Change the colors to see the generated palette and how components adapt
              </p>
            </div>
            <div className="bg-taupe-50 p-6">
              <PaletteGenerator />
            </div>
          </div>
        </section>

        {/* ── Usage ─────────────────────────────────────────────────── */}
        <section id="usage">
          <SectionHeading label="Usage" />

          <div className="flex flex-col gap-6">

            {/* ThemeProvider */}
            <div>
              <p className="subheading mb-1 text-taupe-900">ThemeProvider (recommended)</p>
              <p className="caption mb-3 text-taupe-400">
                Wrap your app root. Re-applies automatically when props change.
              </p>
              <CodeBlock code={USAGE_PROVIDER} />
            </div>

            {/* applyTheme */}
            <div>
              <p className="subheading mb-1 text-taupe-900">applyTheme()</p>
              <p className="caption mb-3 text-taupe-400">
                Imperative alternative. Useful for Electron apps that apply a theme at init before React mounts.
              </p>
              <CodeBlock code={USAGE_APPLY} />
            </div>

            {/* createTheme */}
            <div>
              <p className="subheading mb-1 text-taupe-900">createTheme() — pure / build-time</p>
              <p className="caption mb-3 text-taupe-400">
                Returns the raw CSS string and palette. Works in Node — use it in build scripts, SSG pipelines, or to write a static CSS file per product.
              </p>
              <CodeBlock code={USAGE_CREATE} />
            </div>

            {/* Manual CSS */}
            <div>
              <p className="subheading mb-1 text-taupe-900">Manual CSS override</p>
              <p className="caption mb-3 text-taupe-400">
                For non-React consumers or when full palette generation isn't needed. Import after{" "}
                <code className="font-mono text-taupe-600">tokens.css</code>.
              </p>
              <CodeBlock code={USAGE_MANUAL_CSS} language="css" />
            </div>
          </div>
        </section>

        {/* ── What gets overridden ──────────────────────────────────── */}
        <section id="overrides">
          <SectionHeading label="What gets overridden" />
          <p className="body mb-4 max-w-lg text-taupe-500">
            The generated CSS overrides CSS custom properties that back Tailwind
            v4 utilities. Unlayered <code className="font-mono text-taupe-600">:root</code> rules beat{" "}
            <code className="font-mono text-taupe-600">@layer theme</code>, so the override
            takes effect without rebuilding Tailwind.
          </p>
          <div className="overflow-hidden rounded-xl border border-taupe-100">
            <div className="grid grid-cols-[200px_160px_1fr] border-b border-taupe-100 bg-taupe-50 px-5 py-2">
              <p className="label text-taupe-400">CSS variable</p>
              <p className="label text-taupe-400">Value</p>
              <p className="label text-taupe-400">Affects</p>
            </div>
            {overrideRows.map((row, i) => (
              <div
                key={row.var}
                className={[
                  "grid grid-cols-[200px_160px_1fr] items-start gap-3 px-5 py-3",
                  i !== overrideRows.length - 1 && "border-b border-taupe-100",
                ].filter(Boolean).join(" ")}
              >
                <code className="font-mono caption text-taupe-700 break-all">{row.var}</code>
                <p className="caption text-taupe-500">{row.value}</p>
                <p className="caption text-taupe-400">{row.affects}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── API Reference ─────────────────────────────────────────── */}
        <section id="api">
          <SectionHeading label="API reference" />

          {/* Functions */}
          <div className="mb-8">
            <p className="subheading mb-3 text-taupe-900">Exports</p>
            <div className="overflow-hidden rounded-xl border border-taupe-100">
              <div className="grid grid-cols-[200px_200px_1fr] border-b border-taupe-100 bg-taupe-50 px-5 py-2">
                <p className="label text-taupe-400">Export</p>
                <p className="label text-taupe-400">Signature</p>
                <p className="label text-taupe-400">Description</p>
              </div>
              {apiRows.map((row, i) => (
                <div
                  key={row.name}
                  className={[
                    "grid grid-cols-[200px_200px_1fr] items-start gap-3 px-5 py-3",
                    i !== apiRows.length - 1 && "border-b border-taupe-100",
                  ].filter(Boolean).join(" ")}
                >
                  <code className="font-mono caption font-semibold text-taupe-700">{row.name}</code>
                  <code className="font-mono caption text-taupe-400">{row.sig}</code>
                  <p className="caption text-taupe-400">{row.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ThemeConfig */}
          <div className="mb-8">
            <p className="subheading mb-3 text-taupe-900">ThemeConfig</p>
            <div className="overflow-hidden rounded-xl border border-taupe-100">
              <div className="grid grid-cols-[120px_120px_1fr] border-b border-taupe-100 bg-taupe-50 px-5 py-2">
                <p className="label text-taupe-400">Prop</p>
                <p className="label text-taupe-400">Type</p>
                <p className="label text-taupe-400">Description</p>
              </div>
              {configRows.map((row, i) => (
                <div
                  key={row.prop}
                  className={[
                    "grid grid-cols-[120px_120px_1fr] items-start gap-3 px-5 py-3",
                    i !== configRows.length - 1 && "border-b border-taupe-100",
                  ].filter(Boolean).join(" ")}
                >
                  <code className="font-mono caption font-semibold text-taupe-700">{row.prop}</code>
                  <code className="font-mono caption text-taupe-400">{row.type}</code>
                  <p className="caption text-taupe-400">{row.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ThemeResult */}
          <div>
            <p className="subheading mb-3 text-taupe-900">ThemeResult</p>
            <div className="overflow-hidden rounded-xl border border-taupe-100">
              <div className="grid grid-cols-[180px_200px_1fr] border-b border-taupe-100 bg-taupe-50 px-5 py-2">
                <p className="label text-taupe-400">Field</p>
                <p className="label text-taupe-400">Type</p>
                <p className="label text-taupe-400">Description</p>
              </div>
              {resultRows.map((row, i) => (
                <div
                  key={row.prop}
                  className={[
                    "grid grid-cols-[180px_200px_1fr] items-start gap-3 px-5 py-3",
                    i !== resultRows.length - 1 && "border-b border-taupe-100",
                  ].filter(Boolean).join(" ")}
                >
                  <code className="font-mono caption font-semibold text-taupe-700">{row.prop}</code>
                  <code className="font-mono caption text-taupe-400">{row.type}</code>
                  <p className="caption text-taupe-400">{row.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How palettes are generated ───────────────────────────── */}
        <section id="algorithm">
          <SectionHeading label="How palettes are generated" />
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="body text-taupe-500">
              Palette generation uses the OKLCH color space — a perceptually
              uniform model where equal numerical steps produce equal perceived
              changes. No external dependency; the conversion math is inlined (~100 lines).
            </p>
            <ol className="flex flex-col gap-2">
              {[
                "Your hex input is parsed and converted to OKLCH: (L, C, H)",
                "The input is anchored at shade-500. Shades 50–400 interpolate L toward 0.975 (near-white) with chroma fading 80%. Shades 600–950 interpolate L toward 0.145 (near-black) with chroma fading 40%.",
                "Each generated OKLCH color is clamped to the sRGB gamut via binary search on chroma — ensuring every shade is a valid, displayable color.",
                "Foreground colors (primaryForeground) are chosen using WCAG relative luminance with a 0.179 threshold — the crossover point where white and black have equal contrast.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="caption font-semibold text-taupe-300 shrink-0 w-4">{i + 1}.</span>
                  <p className="caption text-taupe-500">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

      </div>

      <div className="h-16" />
    </div>
  );
}
