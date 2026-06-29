import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { UsageBar } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  stacked: `import { UsageBar } from "@hilum/ui"

<UsageBar label="Products" value={430} max={500} />
<UsageBar label="Orders / month" value={6200} max={10000} />
<UsageBar label="Bandwidth (GB)" value={82} max={100} />`,

  readiness: `import { UsageBar } from "@hilum/ui"

<UsageBar
  label="Readiness"
  percent={82}
  valueLabel="82 / 100"
  tone="primary"
/>`,

  inline: `import { UsageBar } from "@hilum/ui"

<UsageBar layout="inline" percent={64} />
<UsageBar layout="inline" percent={78} />
<UsageBar layout="inline" percent={94} />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function UsageBarPage() {
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
          <span className="body font-semibold text-ground-900">Usage Bar</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Usage Bar</h1>
        <p className="body max-w-lg text-ground-400">
          Compact quota, readiness, and capacity meter with automatic threshold tones.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Progress · Metrics</p>
        </div>
      </div>

      <PageDocs path="/molecules/usage-bar/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Usage Bar · Stacked" />
          <PreviewBlock
            title="Quota meters"
            description="Label, value, max, and inferred warning tones"
            code={CODE.stacked}
            previewClassName="flex-col items-stretch"
          >
            <div className="w-full max-w-md space-y-4">
              <UsageBar label="Products" value={430} max={500} />
              <UsageBar label="Orders / month" value={6200} max={10000} />
              <UsageBar label="Bandwidth (GB)" value={82} max={100} />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Usage Bar · Readiness" />
          <PreviewBlock
            title="Explicit tone"
            description="Use tone when the metric is good as it increases"
            code={CODE.readiness}
            previewClassName="flex-col items-stretch"
          >
            <div className="w-full max-w-md">
              <UsageBar label="Readiness" percent={82} valueLabel="82 / 100" tone="primary" />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Usage Bar · Inline" />
          <PreviewBlock
            title="Dense rows"
            description="Compact layout for table cells and list rows"
            code={CODE.inline}
          >
            <div className="space-y-3">
              <UsageBar layout="inline" percent={64} />
              <UsageBar layout="inline" percent={78} />
              <UsageBar layout="inline" percent={94} />
            </div>
          </PreviewBlock>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/usage-bar/")({
  head: () => createCatalogPageHead("/molecules/usage-bar/"),
  component: UsageBarPage,
});
