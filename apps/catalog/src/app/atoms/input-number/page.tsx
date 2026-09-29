import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { DensityProvider, Field, FormLayout, InputNumber } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  labelPrefix: `import { DensityProvider, InputNumber } from "@hilum/ui"

// Label-in-field prefix doubles as a scrub handle: drag it to change the value.
<DensityProvider density="compact">
  <div className="grid w-56 grid-cols-2 gap-1.5">
    <InputNumber label="X" value={x} onChange={setX} className="w-full" />
    <InputNumber label="Y" value={y} onChange={setY} className="w-full" />
    <InputNumber label="W" value={w} onChange={setW} min={1} className="w-full" />
    <InputNumber label="H" value={h} onChange={setH} min={1} className="w-full" />
  </div>
</DensityProvider>`,
  basic: `import { InputNumber } from "@hilum/ui"

const [value, setValue] = React.useState(0)

<InputNumber value={value} onChange={setValue} />`,

  withUnit: `<InputNumber value={value} onChange={setValue} unit="px" min={0} max={999} />
<InputNumber value={value} onChange={setValue} unit="%" min={0} max={100} />
<InputNumber value={value} onChange={setValue} unit="°" min={0} max={360} />`,

  decimal: `<InputNumber value={value} onChange={setValue} step={0.1} precision={2} unit="rem" />`,

  noSteppers: `<InputNumber value={value} onChange={setValue} unit="px" hideSteppers />`,

  inField: `import { Field, FormLayout, InputNumber } from "@hilum/ui"

// Inside a Field, InputNumber fills its column (fullWidth defaults to true),
// so two fields share a row on a phone. fullWidth={false} keeps 192px.
<FormLayout.Group condensed>
  <Field label="Weight">
    <InputNumber value={weight} onChange={setWeight} precision={1} step={0.1} unit="kg" />
  </Field>
  <Field label="Stock">
    <InputNumber value={stock} onChange={setStock} min={0} />
  </Field>
</FormLayout.Group>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function InputNumberPage() {
  const [basic, setBasic] = React.useState(0);
  const [px, setPx] = React.useState(16);
  const [pct, setPct] = React.useState(100);
  const [deg, setDeg] = React.useState(0);
  const [decimal, setDecimal] = React.useState(1.5);
  const [noSteppers, setNoSteppers] = React.useState(24);
  const [pos, setPos] = React.useState({ x: 120, y: 80, w: 320, h: 180 });
  const [weight, setWeight] = React.useState(1.5);
  const [stock, setStock] = React.useState(120);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-foreground">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Input Number</span>
        </div>
        <h1 className="display mb-2 text-foreground">Input Number</h1>
        <p className="body max-w-lg text-muted-foreground">
          Numeric input with up/down steppers, optional unit suffix, and arrow-key stepping (Shift =
          10×). Designed for designer property panels.
        </p>
      </div>

      <PageDocs path="/atoms/input-number/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Input Number" />

        <PreviewBlock title="Basic" description="Numeric input with steppers" code={CODE.basic}>
          <InputNumber value={basic} onChange={setBasic} />
        </PreviewBlock>

        <PreviewBlock
          title="With units"
          description="px, %, and ° unit suffixes"
          code={CODE.withUnit}
        >
          <div className="flex items-center gap-3">
            <InputNumber value={px} onChange={setPx} unit="px" min={0} max={999} />
            <InputNumber value={pct} onChange={setPct} unit="%" min={0} max={100} />
            <InputNumber value={deg} onChange={setDeg} unit="°" min={0} max={360} />
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Decimal precision"
          description="step=0.1, precision=2"
          code={CODE.decimal}
        >
          <InputNumber value={decimal} onChange={setDecimal} step={0.1} precision={2} unit="rem" />
        </PreviewBlock>

        <PreviewBlock
          title="No steppers"
          description="Text-only variant without up/down buttons"
          code={CODE.noSteppers}
        >
          <InputNumber value={noSteppers} onChange={setNoSteppers} unit="px" hideSteppers />
        </PreviewBlock>

        <PreviewBlock
          title="In a form row"
          description="Full width inside a Field, so two fields fit side by side on a phone; fullWidth={false} opts back into the compact 192px width"
          code={CODE.inField}
        >
          <div className="w-full max-w-sm">
            <FormLayout.Group condensed>
              <Field label="Weight">
                <InputNumber
                  value={weight}
                  onChange={setWeight}
                  precision={1}
                  step={0.1}
                  unit="kg"
                />
              </Field>
              <Field label="Stock">
                <InputNumber value={stock} onChange={setStock} min={0} />
              </Field>
            </FormLayout.Group>
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Label prefix + compact density"
          description="Inspector fields: 24px, left-aligned value, draggable label scrubs the value"
          code={CODE.labelPrefix}
        >
          <DensityProvider density="compact">
            <div className="grid w-56 grid-cols-2 gap-1.5">
              {(["x", "y", "w", "h"] as const).map((key) => (
                <InputNumber
                  key={key}
                  label={key.toUpperCase()}
                  className="w-full"
                  value={pos[key]}
                  min={key === "w" || key === "h" ? 1 : undefined}
                  onChange={(value) => setPos((prev) => ({ ...prev, [key]: value }))}
                />
              ))}
            </div>
          </DensityProvider>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/input-number/")({
  head: () => createCatalogPageHead("/atoms/input-number/"),
  component: InputNumberPage,
});
