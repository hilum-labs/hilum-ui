import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Input } from "@hilum/ui";
import { Label } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  inputTypes: `import { Input } from "@hilum/ui"

<Input placeholder="Type something..." />
<Input type="email" placeholder="you@example.com" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled input" />`,

  inputWithLabel: `import { Input } from "@hilum/ui"
import { Label } from "@hilum/ui"

<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">Email address</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function InputPage() {
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
          <span className="font-semibold text-ground-900">Input</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Input</h1>
        <p className="body max-w-lg text-ground-500">Single-line text field for user input.</p>
      </div>

      <PageDocs path="/atoms/input/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Input" />

        <PreviewBlock
          title="Types"
          description="Text, email, password, disabled"
          code={CODE.inputTypes}
          previewClassName="flex-col items-stretch"
        >
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Input placeholder="Type something..." />
            <Input type="email" placeholder="you@example.com" />
            <Input type="password" placeholder="Password" />
            <Input disabled placeholder="Disabled input" />
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="With label"
          description="Label + input group"
          code={CODE.inputWithLabel}
          previewClassName="flex-col items-stretch"
        >
          <div className="flex w-full max-w-xs flex-col gap-1.5">
            <Label htmlFor="demo-email">Email address</Label>
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/input/")({
  head: () => createCatalogPageHead("/atoms/input/"),
  component: InputPage,
});
