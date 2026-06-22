import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PropertyRow, InputNumber, Slider, ColorInput } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import * as React from "react";

const CODE = {
  basic: `import { PropertyRow, InputNumber } from "@hilum/ui"

<PropertyRow label="Width">
  <InputNumber value={width} onChange={setWidth} unit="px" />
</PropertyRow>

<PropertyRow label="Opacity">
  <Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={0} max={100} />
  <InputNumber value={opacity} onChange={setOpacity} unit="%" min={0} max={100} className="w-16 shrink-0" />
</PropertyRow>`,

  labelWidth: `<PropertyRow label="Background" labelWidth={80}>
  <ColorInput value={color} onChange={setColor} />
</PropertyRow>`,

  labelAlignStart: `<PropertyRow label="Shadow" labelAlign="start">
  <textarea className="w-full ..." />
</PropertyRow>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function PropertyRowPage() {
  const [width, setWidth] = React.useState(320);
  const [height, setHeight] = React.useState(240);
  const [opacity, setOpacity] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const [color, setColor] = React.useState("#c100f1");

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Property Row</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Property Row</h1>
        <p className="body max-w-lg text-ground-500">
          Horizontal label + control row for designer inspector panels. Left-aligned label,
          right-aligned controls, single visual row. Differs from Field, which is a vertical form
          field with hint/error text.
        </p>
      </div>

      <PageDocs path="/molecules/property-row/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Property Row" />

        <PreviewBlock
          title="Basic layout"
          description="Label and controls side by side"
          code={CODE.basic}
        >
          <div className="w-72 flex flex-col rounded-xl border border-ground-100 bg-white p-4 gap-0.5">
            <PropertyRow label="Width">
              <InputNumber value={width} onChange={setWidth} unit="px" min={0} />
            </PropertyRow>
            <PropertyRow label="Height">
              <InputNumber value={height} onChange={setHeight} unit="px" min={0} />
            </PropertyRow>
            <PropertyRow label="Rotation">
              <InputNumber value={rotation} onChange={setRotation} unit="°" min={-360} max={360} />
            </PropertyRow>
            <PropertyRow label="Opacity">
              <Slider
                value={[opacity]}
                onValueChange={([v]) => setOpacity(v)}
                min={0}
                max={100}
                aria-label="Opacity"
              />
              <InputNumber
                value={opacity}
                onChange={setOpacity}
                unit="%"
                min={0}
                max={100}
                className="w-16 shrink-0"
              />
            </PropertyRow>
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Custom label width"
          description="labelWidth controls the fixed left column"
          code={CODE.labelWidth}
        >
          <div className="w-72 flex flex-col rounded-xl border border-ground-100 bg-white p-4">
            <PropertyRow label="Background" labelWidth={80}>
              <ColorInput value={color} onChange={setColor} />
            </PropertyRow>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/property-row/")({
  head: () => createCatalogPageHead("/molecules/property-row/"),
  component: PropertyRowPage,
});
