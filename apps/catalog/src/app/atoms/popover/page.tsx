import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Popover, PopoverTrigger, PopoverContent } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Slider } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  popover: `import {
  Popover, PopoverTrigger, PopoverContent,
} from "@hilum/ui"
import { Button } from "@hilum/ui"

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Voice settings</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Stability
      </p>
      <Slider defaultValue={[65]} max={100} step={1} />
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-1">
        Similarity
      </p>
      <Slider defaultValue={[80]} max={100} step={1} />
    </div>
  </PopoverContent>
</Popover>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function PopoverPage() {
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
          <span className="font-semibold text-foreground">Popover</span>
        </div>
        <h1 className="display mb-2 text-foreground">Popover</h1>
        <p className="body max-w-lg text-muted-foreground">
          Floating panel anchored to a trigger, for richer content.
        </p>
      </div>

      <PageDocs path="/atoms/popover/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Popover" />

        <PreviewBlock
          title="Default"
          description="Anchored floating panel for inline content"
          code={CODE.popover}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Voice settings</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Stability
                  </p>
                  <Slider defaultValue={[65]} max={100} step={1} />
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Similarity
                  </p>
                  <Slider defaultValue={[80]} max={100} step={1} />
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Style exaggeration
                  </p>
                  <Slider defaultValue={[20]} max={100} step={1} />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/popover/")({
  head: () => createCatalogPageHead("/atoms/popover/"),
  component: PopoverPage,
});
