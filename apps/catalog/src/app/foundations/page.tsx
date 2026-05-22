import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { ColorSwatch, TokenRow } from "@/components/catalog/color-swatch";
import { cn } from "@hilum/ui";

/* ------------------------------------------------------------------ */
/*  Color data                                                         */
/* ------------------------------------------------------------------ */

const brandHeroes = [
  { name: "Primary",   token: "brand-primary",   hex: "#C100F1", role: "Primary actions, CTAs, focus rings", lightText: true  },
  { name: "Secondary", token: "brand-secondary",  hex: "#FFF5BF", role: "Brand secondary, warning surfaces",  lightText: false },
];

const purpleScale = [
  { name: "50",  hex: "#fdf0ff", lightText: false },
  { name: "100", hex: "#f5d6ff", lightText: false },
  { name: "200", hex: "#e8a8ff", lightText: false },
  { name: "300", hex: "#d870f9", lightText: false },
  { name: "400", hex: "#c840f6", lightText: true  },
  { name: "500", hex: "#c100f1", usage: "brand primary", lightText: true },
  { name: "600", hex: "#9c00c0", lightText: true  },
  { name: "700", hex: "#740092", lightText: true  },
  { name: "800", hex: "#4e0062", lightText: true  },
  { name: "900", hex: "#330040", lightText: true  },
  { name: "950", hex: "#200028", lightText: true  },
];

const butterScale = [
  { name: "50",  hex: "#ffffe8", lightText: false },
  { name: "100", hex: "#fffad0", lightText: false },
  { name: "200", hex: "#fff5bf", usage: "brand secondary", lightText: false },
  { name: "300", hex: "#fde870", lightText: false },
  { name: "400", hex: "#f6d42a", lightText: false },
  { name: "500", hex: "#dab010", lightText: false },
  { name: "600", hex: "#a88008", lightText: true },
  { name: "700", hex: "#7c5c04", lightText: true },
  { name: "800", hex: "#543e02", lightText: true },
  { name: "900", hex: "#382801", lightText: true },
  { name: "950", hex: "#221600", lightText: true },
];

const groundScale = [
  { name: "50",  hex: "#f9f7f5", usage: "muted surface", lightText: false },
  { name: "100", hex: "#f2eeea", usage: "borders, skeleton", lightText: false },
  { name: "200", hex: "#e3dcd4", usage: "hover borders", lightText: false },
  { name: "300", hex: "#c9beb3", usage: "muted elements", lightText: false },
  { name: "400", hex: "#a8978a", usage: "muted icons", lightText: false },
  { name: "500", hex: "#7d6960", usage: "body text", lightText: true },
  { name: "600", hex: "#5d4e47", usage: "secondary text", lightText: true },
  { name: "700", hex: "#4a3d38", lightText: true },
  { name: "800", hex: "#332924", usage: "hover states", lightText: true },
  { name: "900", hex: "#26181a", usage: "headings", lightText: true },
  { name: "950", hex: "#160e0a", usage: "code bg", lightText: true },
];

const semanticColors = [
  { name: "red-600", hex: "#dc2626", usage: "destructive, error", lightText: true },
];

const semanticTokens = [
  { token: "background",         value: "white",        hex: "#ffffff",  usage: "Page background" },
  { token: "foreground",         value: "ground-900",    hex: "#26181a",  usage: "Primary text and headings" },
  { token: "border",             value: "ground-100",    hex: "#f2eeea",  usage: "Default borders and dividers" },
  { token: "muted",              value: "ground-50",     hex: "#f9f7f5",  usage: "Sidebar, muted surface areas" },
  { token: "muted-foreground",   value: "ground-500",    hex: "#7d6960",  usage: "Body text, descriptions", lightText: true },
  { token: "primary",            value: "brand-primary", hex: "#c100f1",  usage: "Primary buttons, focus rings", lightText: true },
  { token: "primary-foreground", value: "white",        hex: "#ffffff",  usage: "Text on primary backgrounds" },
  { token: "secondary",          value: "ground-50",     hex: "#f9f7f5",  usage: "Secondary buttons, tag backgrounds" },
  { token: "accent",             value: "purple-50",    hex: "#fdf0ff",  usage: "Subtle hover and accent surfaces" },
  { token: "accent-foreground",  value: "purple-700",   hex: "#740092",  usage: "Text on accent surfaces", lightText: true },
  { token: "warning",            value: "brand-secondary", hex: "#fff5bf",  usage: "Warning banners and callouts" },
  { token: "ring",               value: "brand-primary", hex: "#c100f1",  usage: "Focus ring color", lightText: true },
];

/* ------------------------------------------------------------------ */
/*  Type scale data                                                    */
/* ------------------------------------------------------------------ */

const typeScale = [
  {
    label: "display-xl",
    tailwind: "text-5xl",
    size: "3rem / 48px",
    weight: "400",
    font: "Instrument Serif",
    sample: "Bringing design to life",
    usage: "Hero H1 on landing pages",
    className: "display text-5xl",
  },
  {
    label: "display",
    tailwind: "text-4xl",
    size: "2.25rem / 36px",
    weight: "400",
    font: "Instrument Serif",
    sample: "Design System",
    usage: "Page H1, section hero titles",
    className: "display",
  },
  {
    label: "heading-xl",
    tailwind: "text-3xl",
    size: "1.875rem / 30px",
    weight: "400",
    font: "Instrument Serif",
    sample: "Create, manage and organize",
    usage: "Section headings",
    className: "heading-xl",
  },
  {
    label: "heading",
    tailwind: "text-2xl",
    size: "1.5rem / 24px",
    weight: "400",
    font: "Instrument Serif",
    sample: "Two platforms, one foundation",
    usage: "Card titles, modal headings",
    className: "heading",
  },
  {
    label: "subheading",
    tailwind: "text-xl",
    size: "1.25rem / 20px",
    weight: "500",
    font: "Inter",
    sample: "Student Profiles",
    usage: "Subheadings, sidebar titles",
    className: "subheading",
  },
  {
    label: "body-lg",
    tailwind: "text-base",
    size: "1rem / 16px",
    weight: "400",
    font: "Inter",
    sample: "Powering the best teams, educators, and builders.",
    usage: "Large body text, feature descriptions",
    className: "body-lg",
  },
  {
    label: "body",
    tailwind: "text-sm",
    size: "0.875rem / 14px",
    weight: "400",
    font: "Inter",
    sample: "Turn complex operations into streamlined workflows—and they'll feel truly effortless.",
    usage: "Default body, nav links, descriptions",
    className: "body",
  },
  {
    label: "caption",
    tailwind: "text-xs",
    size: "0.75rem / 12px",
    weight: "400",
    font: "Inter",
    sample: "Enroll: 8,000+ classes",
    usage: "Captions, metadata, helper text",
    className: "caption",
  },
  {
    label: "label",
    tailwind: "text-xs",
    size: "0.75rem / 12px",
    weight: "600",
    font: "Inter",
    sample: "STUDENT PROFILES",
    usage: "Section labels, category tags (always uppercase)",
    className: "label",
  },
  {
    label: "caption-xs",
    tailwind: "text-[10px]",
    size: "0.625rem / 10px",
    weight: "400",
    font: "Inter",
    sample: "Soon · v0.1.0 · 2px",
    usage: "Tiny metadata, badges, sidebar chips",
    className: "caption-xs",
  },
];

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

const radii = [
  { name: "none", value: "0px", className: "rounded-none", usage: "—" },
  { name: "sm", value: "2px", className: "rounded-sm", usage: "Small chips" },
  { name: "md", value: "6px", className: "rounded-md", usage: "Buttons, inputs, tags" },
  { name: "lg", value: "8px", className: "rounded-lg", usage: "Inner panels (--radius)" },
  { name: "xl", value: "12px", className: "rounded-xl", usage: "Cards, preview areas" },
  { name: "2xl", value: "16px", className: "rounded-2xl", usage: "Large containers" },
  { name: "full", value: "9999px", className: "rounded-full", usage: "Pills, avatars, badges" },
];

/* ------------------------------------------------------------------ */
/*  Shadow data                                                        */
/* ------------------------------------------------------------------ */

const shadows = [
  {
    name: "shadow-natural",
    className: "shadow-natural",
    css: "0 0px 0px 1px rgba(0,0,0,.06), 0 1px 1px -.5px rgba(0,0,0,.06), 0 3px 3px -1.5px rgba(0,0,0,.06)",
    usage: "Cards, default elevation",
  },
  {
    name: "shadow-elevated",
    className: "shadow-elevated",
    css: "0 0px 0px 1px rgba(0,0,0,.06), 0 1px 1px -.5px rgba(0,0,0,.06), 0 3px 3px -1.5px rgba(0,0,0,.06), 0 6px 6px -3px rgba(0,0,0,.06), 0 12px 12px -6px rgba(0,0,0,.04), 0 24px 24px -12px rgba(0,0,0,.04), 0 24px 24px 2px rgba(0,0,0,.1)",
    usage: "Modals, floating panels",
  },
];

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
          The raw design decisions that every component is built on. Understand
          these and the whole system becomes predictable.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">5 categories</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Colors · Typography · Spacing · Radius · Shadows</p>
        </div>
      </div>

      <div className="flex flex-col gap-14">

        {/* ── Colors ──────────────────────────────────────────────── */}
        <section id="colors">
          <SectionHeading label="Colors" />

          {/* Core brand colors */}
          <div className="mb-10">
            <PaletteLabel
              name="Brand colors"
              description="The four core brand colors. These exact values define the visual identity — every tonal scale is derived from them."
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

          {/* Taupe scale */}
          <div className="mb-8">
            <PaletteLabel
              name="Taupe"
              description="The neutral spine. Every text, border, and structural surface in the system draws from here."
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
              description="CSS variables that map intent to palette values. Use these in components, never raw hex."
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
              <div className="grid grid-cols-3 border-b border-ground-100 bg-ground-50 px-4 py-2">
                <p className="label text-ground-400">Token</p>
                <p className="label text-ground-400">Value</p>
                <p className="label text-ground-400">Usage</p>
              </div>
              {semanticTokens.map((t, i) => (
                <div
                  key={t.token}
                  className={cn(
                    i !== semanticTokens.length - 1 && "border-b border-ground-100"
                  )}
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
          </div>
        </section>

        {/* ── Typography ──────────────────────────────────────────── */}
        <section id="typography">
          <SectionHeading label="Typography" />

          {/* Font pairing */}
          <div className="mb-8">
            <PaletteLabel
              name="Font pairing"
              description="Instrument Serif for titles and display text. Inter for all UI and body copy."
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-ground-100 p-5">
                <p className="caption mb-3 text-ground-400">Instrument Serif · Titles</p>
                <p className="heading-xl text-ground-900">
                  The quick brown fox jumps over the lazy dog.
                </p>
                <p className="caption mt-3 text-ground-300">display-xl · display · heading-xl · heading</p>
              </div>
              <div className="rounded-xl border border-ground-100 p-5">
                <p className="caption mb-3 text-ground-400">Inter · UI &amp; Body</p>
                <p className="body-lg text-ground-900">
                  The quick brown fox jumps over the lazy dog. Consistent, accessible, and beautifully crafted.
                </p>
                <p className="caption mt-3 text-ground-300">subheading · body-lg · body · caption · label</p>
              </div>
            </div>
          </div>

          {/* Type scale */}
          <div className="mb-8">
            <PaletteLabel
              name="Type scale"
              description="Nine steps from display to label. Use only these — never arbitrary font sizes."
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
              <div className="hidden grid-cols-[120px_1fr_200px] border-b border-ground-100 bg-ground-50 px-5 py-2 md:grid">
                <p className="label text-ground-400">Step</p>
                <p className="label text-ground-400">Sample</p>
                <p className="label text-ground-400">Spec</p>
              </div>
              {typeScale.map((step, i) => (
                <div
                  key={step.label}
                  className={cn(
                    "grid items-center gap-4 px-5 py-4 md:grid-cols-[120px_1fr_200px]",
                    i !== typeScale.length - 1 && "border-b border-ground-100"
                  )}
                >
                  <div>
                    <p className="font-mono text-[11px] font-semibold text-ground-500">
                      {step.label}
                    </p>
                    <p className="font-mono caption-xs text-ground-300">{step.tailwind}</p>
                  </div>
                  <p className={cn("text-ground-900 leading-tight truncate", step.className)}>
                    {step.sample}
                  </p>
                  <div className="hidden md:block">
                    <p className="font-mono caption-xs text-ground-400">{step.size}</p>
                    <p className="font-mono caption-xs text-ground-300">
                      weight {step.weight} · {step.font}
                    </p>
                    <p className="mt-0.5 caption-xs leading-tight text-ground-300">
                      {step.usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Font weights */}
          <div className="mb-8">
            <PaletteLabel
              name="Weights"
              description="Inter uses regular, medium, and semibold. Instrument Serif is always regular (400)."
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
              {[
                { weight: "400", name: "Regular", tailwind: "font-normal", usage: "Body copy, serif headings, captions" },
                { weight: "500", name: "Medium", tailwind: "font-medium", usage: "UI labels, nav links, metadata" },
                { weight: "600", name: "Semibold", tailwind: "font-semibold", usage: "Emphasis, button text" },
              ].map((w, i) => (
                <div
                  key={w.weight}
                  className={cn(
                    "flex items-center gap-6 px-5 py-4",
                    i !== 2 && "border-b border-ground-100"
                  )}
                >
                  <div className="w-24 shrink-0">
                    <p className="font-mono text-[11px] font-semibold text-ground-500">{w.tailwind}</p>
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
              description="Four tracking values. Tighter for large display type, widest for uppercase labels only."
            />
            <div className="mt-4 overflow-hidden rounded-xl border border-ground-100">
              {[
                { name: "tracking-tighter", value: "-0.05em", sample: "Bringing education to life", usage: "H1, display headings" },
                { name: "tracking-tight", value: "-0.025em", sample: "Create, manage and organize", usage: "H2, H3 headings" },
                { name: "tracking-normal", value: "0em", sample: "Turn complex operations into simple workflows", usage: "Body, UI labels" },
                { name: "tracking-widest", value: "0.1em", sample: "STUDENT PROFILES", usage: "Section labels (uppercase only)" },
              ].map((t, i) => (
                <div
                  key={t.name}
                  className={cn(
                    "flex items-center gap-6 px-5 py-4",
                    i !== 3 && "border-b border-ground-100"
                  )}
                >
                  <div className="w-36 shrink-0">
                    <p className="font-mono text-[11px] font-semibold text-ground-500">{t.name}</p>
                    <p className="font-mono caption-xs text-ground-300">{t.value}</p>
                  </div>
                  <p
                    className={cn("flex-1 body font-semibold text-ground-900 truncate", t.name)}
                  >
                    {t.sample}
                  </p>
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
                  i !== spacingScale.length - 1 && "border-b border-ground-100"
                )}
              >
                <p className="font-mono caption font-semibold text-ground-700">{s.token}</p>
                <p className="font-mono caption text-ground-400">{s.px}</p>
                <div className="flex items-center">
                  <div
                    className="h-3 rounded-sm bg-ground-900"
                    style={{ width: s.px }}
                  />
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
                  className={cn(
                    "size-14 border-2 border-ground-900 bg-ground-50",
                    r.className
                  )}
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
                    s.className
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

function PaletteLabel({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
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
