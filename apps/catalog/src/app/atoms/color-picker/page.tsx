import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { ColorPicker } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { ColorPicker } from "@hilum/ui"

const [color, setColor] = React.useState("#c100f1")

<ColorPicker value={color} onChange={setColor} />`,

  withPresets: `import { ColorPicker } from "@hilum/ui"

const PRESETS = ["#c100f1", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"]

<ColorPicker
  value={color}
  onChange={setColor}
  presets={PRESETS}
  ariaLabel="Brand color"
/>`,

  disabled: `<ColorPicker value="#c100f1" onChange={() => {}} disabled />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

const PRESETS = [
  "#c100f1",
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#ffeaa7",
  "#a29bfe",
  "#fd79a8",
];

function ColorPickerPage() {
  const [color, setColor] = React.useState("#c100f1");
  const [colorWithPresets, setColorWithPresets] = React.useState("#c100f1");

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Color Picker</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Color Picker</h1>
        <p className="body max-w-lg text-ground-500">
          Popover-based color selector with a native color wheel, hex input, and optional preset
          palette. Designed for designer property panels.
        </p>
      </div>

      <PageDocs path="/atoms/color-picker/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Color Picker" />

        <PreviewBlock
          title="Basic"
          description="Color swatch trigger opening a popover"
          code={CODE.basic}
        >
          <ColorPicker value={color} onChange={setColor} ariaLabel="Pick a color" />
        </PreviewBlock>

        <PreviewBlock
          title="With presets"
          description="Preset palette shown above the color wheel"
          code={CODE.withPresets}
        >
          <ColorPicker
            value={colorWithPresets}
            onChange={setColorWithPresets}
            presets={PRESETS}
            ariaLabel="Brand color"
          />
        </PreviewBlock>

        <PreviewBlock title="Disabled" description="Non-interactive state" code={CODE.disabled}>
          <ColorPicker value="#c100f1" onChange={() => {}} disabled ariaLabel="Disabled color" />
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/color-picker/")({
  head: () => createCatalogPageHead("/atoms/color-picker/"),
  component: ColorPickerPage,
});
