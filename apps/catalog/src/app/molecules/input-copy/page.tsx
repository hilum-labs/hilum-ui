import { createFileRoute } from "@tanstack/react-router";
import { InputCopy } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";
import { useState } from "react";

const BASIC_CODE = `import { InputCopy } from "@hilum/ui"

<InputCopy value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json" />`;

const LABEL_CODE = `import { InputCopy } from "@hilum/ui"

<InputCopy
  label="Install command"
  value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json"
/>`;

const BUTTON_CODE = `import { InputCopy } from "@hilum/ui"

<InputCopy
  variant="button"
  value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json"
/>`;

const ALIGN_CODE = `import { InputCopy } from "@hilum/ui"

<InputCopy
  align="left"
  value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json"
/>
<InputCopy
  variant="button"
  align="left"
  value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json"
/>`;

const DISABLED_CODE = `import { InputCopy } from "@hilum/ui"

<InputCopy label="Invite code" value="ABCD-1234-EFGH" disabled />`;

const CALLBACK_CODE = `import { InputCopy } from "@hilum/ui"
import { useState } from "react"

const [copyCount, setCopyCount] = useState(0)

<InputCopy
  label="Share link"
  value="https://fluidfunctionalism.com/r/input-copy"
  onCopy={() => setCopyCount((count) => count + 1)}
/>`;

function InputCopyPage() {
  const [copyCount, setCopyCount] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Input Copy</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Read-only input with a copy-to-clipboard button and animated check feedback.
      </p>
      <PageDocs path="/molecules/input-copy/" />
      <div className="flex flex-col gap-3">
        <PreviewBlock title="Basic" description="Copyable read-only input" code={BASIC_CODE}>
          <div className="w-full max-w-md">
            <InputCopy value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json" />
          </div>
        </PreviewBlock>
        <PreviewBlock title="With Label" description="Label above the copy field" code={LABEL_CODE}>
          <div className="w-full max-w-md">
            <InputCopy
              label="Install command"
              value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json"
            />
          </div>
        </PreviewBlock>
        <PreviewBlock title="Button Variant" description="Visible copy label" code={BUTTON_CODE}>
          <div className="w-full max-w-md">
            <InputCopy
              variant="button"
              value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json"
            />
          </div>
        </PreviewBlock>
        <PreviewBlock
          title="Left Aligned"
          description="Copy affordance before value"
          code={ALIGN_CODE}
        >
          <div className="flex w-full max-w-md flex-col gap-4">
            <InputCopy
              align="left"
              value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json"
            />
            <InputCopy
              variant="button"
              align="left"
              value="npx shadcn@latest add https://www.fluidfunctionalism.com/r/input-copy.json"
            />
          </div>
        </PreviewBlock>
        <PreviewBlock
          title="Disabled"
          description="Non-interactive copy field"
          code={DISABLED_CODE}
        >
          <div className="w-full max-w-md">
            <InputCopy label="Invite code" value="ABCD-1234-EFGH" disabled />
          </div>
        </PreviewBlock>
        <PreviewBlock title="Copy Callback" description="onCopy callback" code={CALLBACK_CODE}>
          <div className="flex w-full max-w-md flex-col gap-2">
            <InputCopy
              label="Share link"
              value="https://fluidfunctionalism.com/r/input-copy"
              onCopy={() => setCopyCount((count) => count + 1)}
            />
            <p className="caption px-1 text-ground-400">
              Copied {copyCount} {copyCount === 1 ? "time" : "times"}
            </p>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/input-copy/")({
  head: () => createCatalogPageHead("/molecules/input-copy/"),
  component: InputCopyPage,
});
