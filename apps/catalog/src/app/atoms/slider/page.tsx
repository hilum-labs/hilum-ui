import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Slider, SliderComfortable, SliderControl } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  slider: `import { Slider } from "@hilum/ui"

<div className="flex flex-col gap-2">
  <div className="flex justify-between text-xs text-ground-400">
    <span>Slower</span>
    <span>Faster</span>
  </div>
  <Slider defaultValue={[50]} max={100} step={1} />
</div>`,
  control: `import { SliderControl } from "@hilum/ui"

<SliderControl
  label="Volume"
  value={40}
  onChange={(next) => setValue(next as number)}
  showSteps
  valuePosition="right"
/>`,
  range: `import { SliderControl } from "@hilum/ui"

<SliderControl
  label="Window"
  value={[25, 75]}
  onChange={(next) => setRange(next as [number, number])}
  valuePosition="top"
/>`,
  tooltip: `import { SliderControl } from "@hilum/ui"

<SliderControl
  value={75}
  onChange={(next) => setOpacity(next as number)}
  valuePosition="tooltip"
  formatValue={(value) => \`\${value}%\`}
/>`,
  comfortable: `import { SliderComfortable } from "@hilum/ui"

<SliderComfortable
  label="Roundness"
  value={2}
  min={0}
  max={5}
  step={1}
  onChange={setRoundness}
/>`,
  scrubber: `import { SliderComfortable } from "@hilum/ui"

<SliderComfortable
  label="Volume"
  value={50}
  variant="scrubber"
  formatValue={(value) => \`\${value}%\`}
  onChange={setVolume}
/>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function SliderPage() {
  const speed = 50;
  const range: [number, number] = [25, 75];
  const opacity = 75;
  const roundness = 2;
  const volume = 50;

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
          <span className="font-semibold text-ground-900">Slider</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Slider</h1>
        <p className="body max-w-lg text-ground-500">Range input for selecting a numeric value.</p>
      </div>

      <PageDocs path="/atoms/slider/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Slider" />

        <PreviewBlock
          title="Default"
          description="Range input with ground thumb and track"
          code={CODE.slider}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-xs">
            <div className="mb-2 flex justify-between text-xs text-ground-400">
              <span>Slower</span>
              <span className="font-medium text-ground-700">Speed</span>
              <span>Faster</span>
            </div>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Value display + steps"
          description="Controlled slider with formatted value display and step pips"
          code={CODE.control}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-md">
            <SliderControl
              label="Volume"
              value={speed}
              onChange={() => undefined}
              showSteps
              valuePosition="right"
            />
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Range"
          description="Two-thumb range mode with a shared fill"
          code={CODE.range}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-md">
            <SliderControl
              label="Window"
              value={range}
              onChange={() => undefined}
              valuePosition="top"
            />
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Tooltip value"
          description="Value is shown above the thumb during hover or keyboard focus"
          code={CODE.tooltip}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-md">
            <SliderControl
              value={opacity}
              onChange={() => undefined}
              valuePosition="tooltip"
              formatValue={(value) => `${value}%`}
            />
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Comfortable"
          description="Pip-based selector for settings panels"
          code={CODE.comfortable}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-md">
            <SliderComfortable
              label="Roundness"
              value={roundness}
              min={0}
              max={5}
              step={1}
              onChange={() => undefined}
            />
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Comfortable scrubber"
          description="Continuous comfortable control for dense product settings"
          code={CODE.scrubber}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-md">
            <SliderComfortable
              label="Volume"
              value={volume}
              variant="scrubber"
              formatValue={(value) => `${value}%`}
              onChange={() => undefined}
            />
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/slider/")({
  head: () => createCatalogPageHead("/atoms/slider/"),
  component: SliderPage,
});
