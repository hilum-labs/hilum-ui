import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { ColorInput } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { ColorInput } from "@hilum/ui"

const [color, setColor] = React.useState("#c100f1")

<ColorInput value={color} onChange={setColor} />`,

  withOpacity: `import { ColorInput } from "@hilum/ui"

const [color, setColor] = React.useState("#c100f1")
const [opacity, setOpacity] = React.useState(100)

<ColorInput
  value={color}
  onChange={setColor}
  opacity={opacity}
  onOpacityChange={setOpacity}
/>`,

  disabled: `<ColorInput value="#c100f1" onChange={() => {}} disabled />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function ColorInputPage() {
  const [color, setColor] = React.useState("#c100f1");
  const [colorWithOpacity, setColorWithOpacity] = React.useState("#c100f1");
  const [opacity, setOpacity] = React.useState(100);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Color Input</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Color Input</h1>
        <p className="body max-w-lg text-ground-500">
          Compact inline color input combining a swatch trigger, hex text field, and optional opacity
          control. Designed for designer property panels.
        </p>
      </div>

      <PageDocs path="/atoms/color-input/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Color Input" />

        <PreviewBlock title="Basic" description="Swatch + hex field" code={CODE.basic}>
          <ColorInput value={color} onChange={setColor} />
        </PreviewBlock>

        <PreviewBlock title="With opacity" description="Adds an opacity percentage field" code={CODE.withOpacity}>
          <ColorInput
            value={colorWithOpacity}
            onChange={setColorWithOpacity}
            opacity={opacity}
            onOpacityChange={setOpacity}
          />
        </PreviewBlock>

        <PreviewBlock title="Disabled" description="Non-interactive state" code={CODE.disabled}>
          <ColorInput value="#c100f1" onChange={() => {}} disabled />
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/color-input/")({
  head: () => createCatalogPageHead("/atoms/color-input/"),
  component: ColorInputPage,
});
