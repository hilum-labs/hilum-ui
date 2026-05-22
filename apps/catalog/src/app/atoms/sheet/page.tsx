import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Label } from "@hilum/ui";
import { Slider } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  sheet: `import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetTitle, SheetDescription,
} from "@hilum/ui"
import { Button } from "@hilum/ui"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open settings</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Voice settings</SheetTitle>
      <SheetDescription>
        Configure stability, similarity, and style for this voice.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function SheetPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Sheet</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Sheet</h1>
        <p className="body max-w-lg text-ground-500">
          Slide-in panel anchored to a screen edge.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Sheet" />

        <PreviewBlock
          title="Side panel"
          description="Slides in from the right — ideal for settings and detail panels"
          code={CODE.sheet}
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open settings</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Voice settings</SheetTitle>
                <SheetDescription>
                  Configure stability, similarity, and style for this voice.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-5">
                <div>
                  <Label className="mb-2 block text-xs text-ground-400 uppercase tracking-widest font-semibold">Stability</Label>
                  <Slider defaultValue={[65]} max={100} step={1} />
                </div>
                <div>
                  <Label className="mb-2 block text-xs text-ground-400 uppercase tracking-widest font-semibold">Similarity</Label>
                  <Slider defaultValue={[80]} max={100} step={1} />
                </div>
                <div>
                  <Label className="mb-2 block text-xs text-ground-400 uppercase tracking-widest font-semibold">Style</Label>
                  <Slider defaultValue={[30]} max={100} step={1} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/sheet/")({
  head: () => createCatalogPageHead("/atoms/sheet/"),
  component: SheetPage,
});
