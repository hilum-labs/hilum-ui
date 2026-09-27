import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { DensityProvider, SearchInput } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { SearchInput } from "@hilum/ui"

const [query, setQuery] = useState("")

<SearchInput
  value={query}
  onValueChange={setQuery}
  placeholder="Search orders"
  containerClassName="max-w-sm"
/>`,

  compact: `// Inside editor panels (data-density="compact") it shrinks automatically.
<DesignerPanelHeader title="Sections">
  <SearchInput value={q} onValueChange={setQ} placeholder="Filter sections" loading={isFetching} />
</DesignerPanelHeader>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SearchInputPage() {
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState("hero");

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
          <span className="font-semibold text-foreground">Search Input</span>
        </div>
        <h1 className="display mb-2 text-foreground">Search Input</h1>
        <p className="body max-w-lg text-muted-foreground">
          Search field with a leading icon, clear button, Escape-to-clear and a loading state.
          Replaces inputs with hand-positioned search icons.
        </p>
      </div>

      <PageDocs path="/atoms/search-input/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Default" />
          <PreviewBlock
            title="List search"
            description="Emits strings, not events. Type, then clear with × or Escape."
            code={CODE.basic}
          >
            <SearchInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search orders"
              containerClassName="max-w-sm"
            />
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Compact" />
          <PreviewBlock
            title="Editor density"
            description="Follows the nearest DensityProvider; shows a spinner while loading."
            code={CODE.compact}
          >
            <DensityProvider density="compact">
              <div className="w-60">
                <SearchInput
                  value={compact}
                  onValueChange={setCompact}
                  placeholder="Filter sections"
                  loading
                />
              </div>
            </DensityProvider>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/search-input/")({
  head: () => createCatalogPageHead("/atoms/search-input/"),
  component: SearchInputPage,
});
