import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { Copy, Download, Volume2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  tooltip: `import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@hilum/ui"
import { Button } from "@hilum/ui"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button size="icon" variant="outline"><Volume2 size={15} /></Button>
    </TooltipTrigger>
    <TooltipContent>Preview voice</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function TooltipPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Tooltip</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Tooltip</h1>
        <p className="body max-w-lg text-ground-500">
          Brief label that appears on hover to clarify an element.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Tooltip" />

        <PreviewBlock
          title="Default"
          description="Hover tooltip with dark background"
          code={CODE.tooltip}
        >
          <TooltipProvider>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Volume2 size={15} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Preview voice</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Download size={15} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download MP3</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Copy size={15} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy to clipboard</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/tooltip/")({
  head: () => createCatalogPageHead("/atoms/tooltip/"),
  component: TooltipPage,
});
