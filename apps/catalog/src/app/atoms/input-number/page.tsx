import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { InputNumber } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { InputNumber } from "@hilum/ui"

const [value, setValue] = React.useState(0)

<InputNumber value={value} onChange={setValue} />`,

  withUnit: `<InputNumber value={value} onChange={setValue} unit="px" min={0} max={999} />
<InputNumber value={value} onChange={setValue} unit="%" min={0} max={100} />
<InputNumber value={value} onChange={setValue} unit="°" min={0} max={360} />`,

  decimal: `<InputNumber value={value} onChange={setValue} step={0.1} precision={2} unit="rem" />`,

  noSteppers: `<InputNumber value={value} onChange={setValue} unit="px" hideSteppers />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
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
          <span className="font-semibold text-ground-900">Input Number</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Input Number</h1>
        <p className="body max-w-lg text-ground-500">
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
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/input-number/")({
  head: () => createCatalogPageHead("/atoms/input-number/"),
  component: InputNumberPage,
});
