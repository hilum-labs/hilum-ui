import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  collapsible: `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@hilum/ui"

<Collapsible>
  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
    Voices
    <ChevronDown size={14} />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="flex flex-col gap-1 pb-2 pt-1">
      <a className="rounded-md px-2 py-1.5 text-sm text-ground-600 hover:bg-ground-50">My voices</a>
      <a className="rounded-md px-2 py-1.5 text-sm text-ground-600 hover:bg-ground-50">Voice library</a>
    </div>
  </CollapsibleContent>
</Collapsible>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function CollapsiblePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Collapsible</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Collapsible</h1>
        <p className="body max-w-lg text-ground-500">
          Toggleable content region, building block for nav groups.
        </p>
      </div>

      <PageDocs path="/atoms/collapsible/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Collapsible" />

        <PreviewBlock
          title="Default"
          description="Expandable content section — used for sidebar nav groups"
          code={CODE.collapsible}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-xs rounded-xl border border-ground-100 px-3 py-1">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-ground-900 hover:text-ground-700">
                Voices
                <ChevronDown size={14} className="text-ground-400" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-0.5 pb-2">
                  <a href="#" className="rounded-md px-2 py-1.5 text-sm text-ground-600 hover:bg-ground-50">My voices</a>
                  <a href="#" className="rounded-md px-2 py-1.5 text-sm text-ground-600 hover:bg-ground-50">Voice library</a>
                  <a href="#" className="rounded-md px-2 py-1.5 text-sm text-ground-600 hover:bg-ground-50">Voice design</a>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/collapsible/")({
  head: () => createCatalogPageHead("/atoms/collapsible/"),
  component: CollapsiblePage,
});
