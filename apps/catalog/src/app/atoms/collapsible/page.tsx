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
      <a className="flex min-h-10 items-center rounded-md px-2 text-sm text-muted-foreground hover:bg-muted">My voices</a>
      <a className="flex min-h-10 items-center rounded-md px-2 text-sm text-muted-foreground hover:bg-muted">Voice library</a>
    </div>
  </CollapsibleContent>
</Collapsible>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function CollapsiblePage() {
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
          <span className="font-semibold text-foreground">Collapsible</span>
        </div>
        <h1 className="display mb-2 text-foreground">Collapsible</h1>
        <p className="body max-w-lg text-muted-foreground">
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
          <div className="w-full max-w-xs rounded-xl border border-border px-3 py-1">
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground hover:text-foreground">
                Voices
                <ChevronDown size={14} className="text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-0.5 pb-2">
                  <a
                    href="#my-voices"
                    className="flex min-h-10 items-center rounded-md px-2 text-sm text-muted-foreground hover:bg-muted"
                  >
                    My voices
                  </a>
                  <a
                    href="#voice-library"
                    className="flex min-h-10 items-center rounded-md px-2 text-sm text-muted-foreground hover:bg-muted"
                  >
                    Voice library
                  </a>
                  <a
                    href="#voice-design"
                    className="flex min-h-10 items-center rounded-md px-2 text-sm text-muted-foreground hover:bg-muted"
                  >
                    Voice design
                  </a>
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
