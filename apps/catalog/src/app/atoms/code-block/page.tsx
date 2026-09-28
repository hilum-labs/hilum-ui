import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { CodeBlock } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = `import { CodeBlock } from "@hilum/ui"

<CodeBlock language="json" maxHeight={240}>
  {JSON.stringify(payload, null, 2)}
</CodeBlock>`;

function Demo() {
  const [payload] = useState({
    id: "evt_1042",
    type: "order.paid",
    data: { order: "#1042", total: 4820, currency: "USD", items: 3 },
  });
  return (
    <div className="w-full max-w-lg">
      <CodeBlock language="json" maxHeight={240}>
        {JSON.stringify(payload, null, 2)}
      </CodeBlock>
    </div>
  );
}

function CodeBlockPage() {
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
          <span className="font-semibold text-foreground">Code Block</span>
        </div>
        <h1 className="display mb-2 text-foreground">Code Block</h1>
        <p className="body max-w-lg text-muted-foreground">
          Styled, scrollable pre with copy-to-clipboard for API keys, webhook payloads, snippets and
          logs.
        </p>
      </div>

      <PageDocs path="/atoms/code-block/" />

      <div className="flex flex-col gap-8">
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Code Block</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock
            title="Webhook payload"
            description="Language label, max height and copy button."
            code={CODE}
          >
            <Demo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/code-block/")({
  head: () => createCatalogPageHead("/atoms/code-block/"),
  component: CodeBlockPage,
});
