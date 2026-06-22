import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { ColorSwatch, TokenRow } from "@/components/catalog/color-swatch";
import { cn } from "@hilum/ui";
import { tokens } from "@hilum/ui/tokens";

/* ------------------------------------------------------------------ */
/*  Color data                                                         */
/* ------------------------------------------------------------------ */

const brandHeroes = [
  {
    name: "Primary",
    token: "brand-primary",
    hex: tokens.brand.primary,
    role: "Primary actions, CTAs, focus rings",
    lightText: true,
  },
  {
    name: "Secondary",
    token: "brand-secondary",
    hex: tokens.brand.secondary,
    role: "Brand secondary, warning surfaces",
    lightText: false,
  },
];

const shadeUsage: Record<string, Record<string, string>> = {
  purple: { 500: "brand primary" },
  butter: { 200: "brand secondary" },
  ground: {
    50: "muted surface",
    100: "borders, skeleton",
    200: "hover borders",
    300: "muted elements",
    400: "muted icons",
    500: "body text",
    700: "secondary text",
    800: "hover states",
    900: "headings",
    950: "code bg",
  },
};

const semanticColors = [
  { name: "destructive", hex: tokens.destructive, usage: "destructive, error", lightText: true },
];

const semanticUsage: Record<string, string> = {
  background: "Page background",
  foreground: "Primary text and headings",
  card: "Card and elevated surface backgrounds",
  cardForeground: "Text on card backgrounds",
  surface: "Subtle product surfaces",
  surfaceForeground: "Text on subtle product surfaces",
  border: "Default borders and dividers",
  input: "Input borders and controls",
  muted: "Sidebar and muted surface areas",
  mutedForeground: "Body text and descriptions",
  accent: "Subtle hover and accent surfaces",
  accentForeground: "Text on accent surfaces",
  primary: "Primary buttons, CTAs, focus rings",
  primaryForeground: "Text on primary backgrounds",
  secondary: "Secondary buttons and tag backgrounds",
  secondaryForeground: "Text on secondary backgrounds",
  destructive: "Destructive and error states",
  destructiveForeground: "Text on destructive backgrounds",
  success: "Success states and positive charts",
  successForeground: "Text on success backgrounds",
  warning: "Warning banners and callouts",
  warningForeground: "Text on warning backgrounds",
  ring: "Focus ring color",
};

function scale(name: "purple" | "butter" | "ground") {
  return Object.entries(tokens[name]).map(([shade, hex]) => ({
    name: shade,
    hex,
    usage: shadeUsage[name]?.[shade],
    lightText: shade === "400" ? name === "purple" : Number(shade) >= 500,
  }));
}

const purpleScale = scale("purple");
const butterScale = scale("butter");
const groundScale = scale("ground");

const semanticModes = Object.entries(tokens.semantic).map(([mode, values]) => ({
  mode,
  rows: Object.entries(values).map(([token, hex]) => ({
    token,
    value: hex,
    hex,
    usage: semanticUsage[token] ?? "Semantic color",
    lightText: ![
      "background",
      "card",
      "surface",
      "muted",
      "accent",
      "primaryForeground",
      "destructiveForeground",
      "warning",
      "success",
    ].includes(token),
  })),
}));

const fontFamilies = Object.entries(tokens.fontFamily).map(([name, value]) => ({
  name,
  value,
}));

/* ------------------------------------------------------------------ */
/*  Type scale data                                                    */
/* ------------------------------------------------------------------ */

const typeSamples: Record<string, { sample: string; usage: string }> = {
  "display-xl": { sample: "Bringing design to life", usage: "Hero H1 on landing pages" },
  display: { sample: "Design System", usage: "Page H1, section hero titles" },
  "heading-xl": { sample: "Create, manage and organize", usage: "Section headings" },
  heading: { sample: "Two platforms, one foundation", usage: "Card titles, modal headings" },
  subheading: { sample: "Student Profiles", usage: "Subheadings, sidebar titles" },
  "body-lg": {
    sample: "Powering the best teams, educators, and builders.",
    usage: "Large body text, feature descriptions",
  },
  body: {
    sample: "Turn complex operations into streamlined workflows.",
    usage: "Default body, nav links, descriptions",
  },
  "body-sm": {
    sample: "Compact inspector controls and dense metadata.",
    usage: "Dense UI and designer panels",
  },
  caption: { sample: "Enroll: 8,000+ classes", usage: "Captions, metadata, helper text" },
  "caption-xs": { sample: "Soon · v2.0.0 · 2px", usage: "Tiny metadata, badges, sidebar chips" },
  eyebrow: { sample: "STUDENT PROFILES", usage: "Canonical uppercase label" },
  "eyebrow-sm": { sample: "PRO · BETA · NEW", usage: "Compact uppercase label" },
  overline: { sample: "STUDENT PROFILES", usage: "Alias of eyebrow" },
  kicker: { sample: "STUDENT PROFILES", usage: "Alias of eyebrow" },
  label: { sample: "STUDENT PROFILES", usage: "Legacy alias of eyebrow" },
};

const typeScale = Object.entries(tokens.typeScale).map(([label, def]) => ({
  label,
  size: def.size,
  weight: String(def.weight),
  lineHeight: def.lineHeight,
  font: def.family,
  letterSpacing: "letterSpacing" in def ? def.letterSpacing : "0",
  transform: "textTransform" in def ? def.textTransform : "none",
  sample: typeSamples[label]?.sample ?? "The quick brown fox jumps over the lazy dog.",
  usage: typeSamples[label]?.usage ?? "Type utility",
  className: label,
}));

/* ------------------------------------------------------------------ */
/*  Spacing data                                                       */
/* ------------------------------------------------------------------ */

const spacingScale = [
  { token: "0.5", px: "2px", usage: "" },
  { token: "1", px: "4px", usage: "icon gap" },
  { token: "1.5", px: "6px", usage: "tight icon gap" },
  { token: "2", px: "8px", usage: "inner padding (xs)" },
  { token: "2.5", px: "10px", usage: "badge padding" },
  { token: "3", px: "12px", usage: "button padding sm" },
  { token: "4", px: "16px", usage: "button padding default" },
  { token: "5", px: "20px", usage: "card padding" },
  { token: "6", px: "24px", usage: "section padding sm" },
  { token: "8", px: "32px", usage: "page padding, preview area" },
  { token: "10", px: "40px", usage: "section vertical gap" },
  { token: "12", px: "48px", usage: "" },
  { token: "16", px: "64px", usage: "large section gap" },
];

/* ------------------------------------------------------------------ */
/*  Radius data                                                        */
/* ------------------------------------------------------------------ */

const radii = Object.entries(tokens.radius).map(([name, value]) => ({
  name,
  value,
  usage:
    name === "base"
      ? "Base --radius"
      : name === "full"
        ? "Pills, avatars, badges"
        : "Derived radius token",
}));

/* ------------------------------------------------------------------ */
/*  Shadow data                                                        */
/* ------------------------------------------------------------------ */

const shadows = Object.entries(tokens.shadow).map(([name, css]) => ({
  name: `shadow-${name}`,
  className: `shadow-${name}`,
  css,
  usage: name === "natural" ? "Cards, default elevation" : "Modals, floating panels",
}));

const zIndexTokens = Object.entries(tokens.zIndex).map(([name, value]) => ({
  name,
  value,
}));

const animationTokens = Object.entries(tokens.animation).map(([name, value]) => ({
  name,
  value,
}));

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function FoundationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <span>Design System</span>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Foundations</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Foundations</h1>
        <p className="body max-w-md text-ground-400">
          The raw design decisions that every component is built on. Understand these and the whole
          system becomes predictable.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">8 token groups</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">
            Colors · Typography · Spacing · Radius · Shadows · Z-index · Animation · Fonts
          </p>
        </div>
      </div>

      <PageDocs path="/foundations/" />

      <div className="flex flex-col gap-14">
        {/* ── Colors ──────────────────────────────────────────────── */}
        <section id="colors">
          <SectionHeading label="Colors" />

          {/* Core brand colors */}
          <div className="mb-10">
            <PaletteLabel
              name="Brand colors"
              description="The core brand colors. These exact values define the visual identity and anchor the brand scales."
            />
            <div className="mt-5 grid grid-cols-4 gap-3">
              {brandHeroes.map((c) => (
                <div key={c.token} className="flex flex-col gap-2">
                  <div
                    className="h-24 w-full rounded-xl border border-ground-100"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div>
                    <p className="subheading text-ground-900">{c.name}</p>
                    <p className="font-mono caption font-semibold text-ground-500">{c.hex}</p>
                    <p className="caption text-ground-400">{c.token}</p>
                    <p className="caption-xs mt-0.5 text-ground-300">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary — purple */}
          <div className="mb-8">
            <PaletteLabel
              name="Primary — Purple"
              description="Built from brand.primary #C100F1. Use this scale for interactive states, focus rings, and CTA surfaces."
            />
            <div className="mt-4 grid grid-cols-11 gap-2">
              {purpleScale.map((s) => (
                <ColorSwatch
                  key={s.name}
                  name={`purple-${s.name}`}
                  hex={s.hex}
                  usage={s.usage}
                  lightText={s.lightText}
                />
              ))}
            </div>
          </div>

          {/* Secondary — butter */}
          <div className="mb-8">
            <PaletteLabel
              name="Secondary — Butter"
              description="Built from brand.secondary #FFF5BF. Use this scale for secondary CTAs, warning surfaces, and warm highlight moments."
            />
            <div className="mt-4 grid grid-cols-11 gap-2">
              {butterScale.map((s) => (
                <ColorSwatch
                  key={s.name}
                  name={`butter-${s.name}`}
                  hex={s.hex}
                  usage={s.usage}
                  lightText={s.lightText}
                />
              ))}
            </div>
          </div>

          {/* Ground scale */}
          <div className="mb-8">
            <PaletteLabel
              name="Ground"
              description="The neutral spine. Text, borders, muted surfaces, and structural UI draw from this token family."
            />
            <div className="mt-4 grid grid-cols-11 gap-2">
              {groundScale.map((s) => (
                <ColorSwatch
                  key={s.name}
                  name={`ground-${s.name}`}
                  hex={s.hex}
                  usage={s.usage}
                  lightText={s.lightText}
                />
              ))}
            </div>
          </div>

          {/* Semantic palette */}
          <div className="mb-8">
            <PaletteLabel
              name="Semantic"
              description="One reserved color outside the brand palette. Red is reserved exclusively for destructive and error states — it cannot be confused with any brand color."
            />
            <div className="mt-4 grid grid-cols-5 gap-2 max-w-xs">
              {semanticColors.map((s) => (
                <ColorSwatch
                  key={s.name}
                  name={s.name}
                  hex={s.hex}
                  usage={s.usage}
                  lightText={s.lightText}
                />
              ))}
            </div>
          </div>

          {/* Semantic tokens */}
          <div>
            <PaletteLabel
              name="Semantic tokens"
              description="CSS variables that map intent to palette values across light, mid, and dark themes. Components should use these instead of raw hex."
            />
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {semanticModes.map(({ mode, rows }) => (
                <div key={mode} className="overflow-hidden rounded-xl border border-ground-100">
                  <div className="border-b border-ground-100 bg-ground-50 px-4 py-2">
                    <p className="label text-ground-500">{mode}</p>
                  </div>
                  {rows.map((t, i) => (
                    <div
                      key={t.token}
                      className={cn(i !== rows.length - 1 && "border-b border-ground-100")}
                    >
                      <TokenRow
                        token={t.token}
                        value={t.value}
                        hex={t.hex}
                        usage={t.usage}
                        lightText={t.lightText}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Typography ──────────────────────────────────────────── */}
        <section id="typography">
          <SectionHeading label="Typography" />

          {/* Font pairing */}
          <div className="mb-8">
            <PaletteLabel
              name="Font families"
              description="The exact font-family token values emitted by tokens.css."
            />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {fontFamilies.map((f) => (
                <div key={f.name} className="rounded-xl border border-ground-100 p-5">
                  <p className="label mb-3 text-ground-400">{f.name}</p>
                  <p className="body-lg text-ground-900" style={{ fontFamily: f.value }}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                  <p className="mt-3 break-words font-mono caption-xs text-ground-400">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Type scale */}
          <div className="mb-8">
            <PaletteLabel
              name="Type scale"
              description="Every type utility emitted by tokens.css. Use only these steps for catalog and product UI."
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
              <div className="hidden grid-cols-[140px_1fr_260px] border-b border-ground-100 bg-ground-50 px-5 py-2 md:grid">
                <p className="label text-ground-400">Step</p>
                <p className="label text-ground-400">Sample</p>
                <p className="label text-ground-400">Spec</p>
              </div>
              {typeScale.map((step, i) => (
                <div
                  key={step.label}
                  className={cn(
                    "grid items-center gap-4 px-5 py-4 md:grid-cols-[140px_1fr_260px]",
                    i !== typeScale.length - 1 && "border-b border-ground-100",
                  )}
                >
                  <div>
                    <p className="font-mono text-[11px] font-semibold text-ground-500">
                      {step.label}
                    </p>
                  </div>
                  <p className={cn("text-ground-900 leading-tight truncate", step.className)}>
                    {step.sample}
                  </p>
                  <div className="hidden md:block">
                    <p className="font-mono caption-xs text-ground-400">{step.size}</p>
                    <p className="font-mono caption-xs text-ground-300">
                      weight {step.weight} · {step.font} · line {step.lineHeight}
                    </p>
                    <p className="mt-0.5 caption-xs leading-tight text-ground-300">
                      tracking {step.letterSpacing} · transform {step.transform}
                    </p>
                    <p className="mt-0.5 caption-xs leading-tight text-ground-300">{step.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Font weights */}
          <div className="mb-8">
            <PaletteLabel
              name="Weights"
              description="Inter is variable across 100-900. Gabarito ships regular through black for display use."
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
              {[
                {
                  weight: "400",
                  name: "Regular",
                  tailwind: "font-normal",
                  usage: "Body copy, display headings, captions",
                },
                {
                  weight: "500",
                  name: "Medium",
                  tailwind: "font-medium",
                  usage: "UI labels, nav links, metadata",
                },
                {
                  weight: "600",
                  name: "Semibold",
                  tailwind: "font-semibold",
                  usage: "Emphasis, button text",
                },
              ].map((w, i) => (
                <div
                  key={w.weight}
                  className={cn(
                    "flex items-center gap-6 px-5 py-4",
                    i !== 2 && "border-b border-ground-100",
                  )}
                >
                  <div className="w-24 shrink-0">
                    <p className="font-mono text-[11px] font-semibold text-ground-500">
                      {w.tailwind}
                    </p>
                    <p className="font-mono caption-xs text-ground-300">{w.weight}</p>
                  </div>
                  <p
                    className={cn("flex-1 body-lg text-ground-900", w.tailwind)}
                    style={{ fontWeight: w.weight }}
                  >
                    {w.name} — The quick brown fox jumps over the lazy dog
                  </p>
                  <p className="hidden shrink-0 caption-xs text-ground-300 md:block">{w.usage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Letter spacing */}
          <div>
            <PaletteLabel
              name="Letter spacing"
              description="Tokenized letter spacing appears only inside the type utilities above. Body and heading utilities use normal tracking."
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
              {typeScale
                .filter((t) => t.letterSpacing !== "0")
                .map((t, i, rows) => (
                  <div
                    key={t.label}
                    className={cn(
                      "flex items-center gap-6 px-5 py-4",
                      i !== rows.length - 1 && "border-b border-ground-100",
                    )}
                  >
                    <div className="w-36 shrink-0">
                      <p className="font-mono text-[11px] font-semibold text-ground-500">
                        {t.label}
                      </p>
                      <p className="font-mono caption-xs text-ground-300">{t.letterSpacing}</p>
                    </div>
                    <p className={cn("flex-1 text-ground-900 truncate", t.className)}>{t.sample}</p>
                    <p className="hidden shrink-0 caption-xs text-ground-300 md:block">{t.usage}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* ── Spacing ─────────────────────────────────────────────── */}
        <section id="spacing">
          <SectionHeading label="Spacing" />
          <PaletteLabel
            name="Scale"
            description="Tailwind's 4px base unit. Stick to these steps — consistency comes from constraint."
          />
          <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
            <div className="grid grid-cols-[60px_60px_1fr_160px] border-b border-ground-100 bg-ground-50 px-5 py-2">
              <p className="label text-ground-400">Token</p>
              <p className="label text-ground-400">px</p>
              <p className="label text-ground-400">Visual</p>
              <p className="label text-ground-400">Used for</p>
            </div>
            {spacingScale.map((s, i) => (
              <div
                key={s.token}
                className={cn(
                  "grid grid-cols-[60px_60px_1fr_160px] items-center px-5 py-2.5",
                  i !== spacingScale.length - 1 && "border-b border-ground-100",
                )}
              >
                <p className="font-mono caption font-semibold text-ground-700">{s.token}</p>
                <p className="font-mono caption text-ground-400">{s.px}</p>
                <div className="flex items-center">
                  <div className="h-3 rounded-sm bg-ground-900" style={{ width: s.px }} />
                </div>
                <p className="caption-xs text-ground-300">{s.usage}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Border Radius ───────────────────────────────────────── */}
        <section id="radius">
          <SectionHeading label="Border Radius" />
          <PaletteLabel
            name="Scale"
            description="Seven steps from square to full pill. The base --radius is 0.5rem (8px)."
          />
          <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-7">
            {radii.map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-3">
                <div
                  className="size-14 border-2 border-ground-900 bg-ground-50"
                  style={{ borderRadius: r.value }}
                />
                <div className="text-center">
                  <p className="font-mono text-[11px] font-semibold text-ground-700">{r.name}</p>
                  <p className="font-mono caption-xs text-ground-400">{r.value}</p>
                  <p className="mt-0.5 caption-xs leading-tight text-ground-300">{r.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Shadows ─────────────────────────────────────────────── */}
        <section id="shadows">
          <SectionHeading label="Shadows" />
          <PaletteLabel
            name="Elevation"
            description="Two shadow levels only. shadow-natural for cards and default elevation, shadow-elevated for overlays and floating panels."
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
            {shadows.map((s) => (
              <div key={s.name} className="flex flex-col gap-3">
                <div
                  className={cn(
                    "flex h-20 items-center justify-center rounded-xl bg-white",
                    s.className,
                  )}
                >
                  <div className="h-8 w-12 rounded-md bg-ground-100" />
                </div>
                <div>
                  <p className="font-mono text-[11px] font-semibold text-ground-700">{s.name}</p>
                  <p className="mt-0.5 caption-xs leading-tight text-ground-400">{s.usage}</p>
                  <p className="mt-1 font-mono text-[9px] leading-tight text-ground-300">{s.css}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Z-index ─────────────────────────────────────────────── */}
        <section id="z-index">
          <SectionHeading label="Z-index" />
          <PaletteLabel
            name="Layering"
            description="Semantic layering tokens for overlays, sticky UI, popovers, and tooltips."
          />
          <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
            {zIndexTokens.map((z, i) => (
              <div
                key={z.name}
                className={cn(
                  "grid grid-cols-[140px_1fr] items-center px-5 py-3",
                  i !== zIndexTokens.length - 1 && "border-b border-ground-100",
                )}
              >
                <p className="font-mono caption font-semibold text-ground-700">z-{z.name}</p>
                <p className="font-mono caption text-ground-400">{z.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Animation ───────────────────────────────────────────── */}
        <section id="animation">
          <SectionHeading label="Animation" />
          <PaletteLabel
            name="Motion"
            description="Named animation tokens emitted as Tailwind utility values."
          />
          <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
            {animationTokens.map((a, i) => (
              <div
                key={a.name}
                className={cn(
                  "grid gap-3 px-5 py-3 md:grid-cols-[180px_1fr]",
                  i !== animationTokens.length - 1 && "border-b border-ground-100",
                )}
              >
                <p className="font-mono caption font-semibold text-ground-700">animate-{a.name}</p>
                <p className="break-words font-mono caption text-ground-400">{a.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="h-16" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Local sub-components                                               */
/* ------------------------------------------------------------------ */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function PaletteLabel({ name, description }: { name: string; description: string }) {
  return (
    <div>
      <p className="subheading text-ground-900">{name}</p>
      <p className="caption mt-0.5 text-ground-400">{description}</p>
    </div>
  );
}

export const Route = createFileRoute("/foundations/")({
  head: () => createCatalogPageHead("/foundations/"),
  component: FoundationsPage,
});
