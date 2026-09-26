import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { cn } from "@hilum/ui";

function PanelContent({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("flex h-full items-center justify-center bg-muted p-4", className)}>
      <span className="label text-muted-foreground">{label}</span>
    </div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

const CODE = {
  horizontal: `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@hilum/ui";

<ResizablePanelGroup direction="horizontal" className="h-[300px] rounded-xl border border-border overflow-hidden">
  <ResizablePanel defaultSize={50}>
    <div className="flex h-full items-center justify-center bg-muted p-4">
      <span className="label text-muted-foreground">Left panel</span>
    </div>
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>
    <div className="flex h-full items-center justify-center bg-background p-4">
      <span className="label text-muted-foreground">Right panel</span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`,

  threePanel: `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@hilum/ui";

<ResizablePanelGroup direction="horizontal" className="h-[300px] rounded-xl border border-border overflow-hidden">
  <ResizablePanel defaultSize={25} minSize={20}>
    <div className="flex h-full items-center justify-center bg-muted p-4">
      <span className="label text-muted-foreground">Sidebar</span>
    </div>
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50} minSize={20}>
    <div className="flex h-full items-center justify-center bg-background p-4">
      <span className="label text-muted-foreground">Main Content</span>
    </div>
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={25} minSize={20}>
    <div className="flex h-full items-center justify-center bg-muted p-4">
      <span className="label text-muted-foreground">Details</span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`,

  vertical: `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@hilum/ui";

<ResizablePanelGroup direction="vertical" className="h-[400px] rounded-xl border border-border overflow-hidden">
  <ResizablePanel defaultSize={40}>
    <div className="flex h-full items-center justify-center bg-muted p-4">
      <span className="label text-muted-foreground">Header / Toolbar</span>
    </div>
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={60}>
    <div className="flex h-full items-center justify-center bg-background p-4">
      <span className="label text-muted-foreground">Content Area</span>
    </div>
  </ResizablePanel>
</ResizablePanelGroup>`,

  nested: `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@hilum/ui";

<ResizablePanelGroup direction="horizontal" className="h-[400px] rounded-xl border border-border overflow-hidden">
  <ResizablePanel defaultSize={30}>
    <div className="flex h-full items-center justify-center bg-muted p-4">
      <span className="label text-muted-foreground">Navigation</span>
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle={false} />
  <ResizablePanel defaultSize={70}>
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center bg-background p-4">
          <span className="label text-muted-foreground">Editor</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center bg-muted p-4">
          <span className="label text-muted-foreground">Terminal / Output</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`,
};

function ResizablePage() {
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
          <span className="font-semibold text-foreground">Resizable</span>
        </div>
        <h1 className="display mb-2 text-foreground">Resizable</h1>
        <p className="body max-w-lg text-muted-foreground">
          Draggable panel layouts for building resizable split-view interfaces.
        </p>
      </div>

      <PageDocs path="/atoms/resizable/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Horizontal" />

        <PreviewBlock
          title="Two-panel horizontal"
          description="Drag the handle to resize the left and right panels"
          code={CODE.horizontal}
          previewClassName="p-6"
        >
          <div
            className="w-full overflow-hidden rounded-xl border border-border"
            style={{ height: 300 }}
          >
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50}>
                <PanelContent label="Left panel" />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <PanelContent label="Right panel" className="bg-background" />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Three-panel horizontal"
          description="Sidebar, main content, and details — each with a 20% minimum size"
          code={CODE.threePanel}
          previewClassName="p-6"
        >
          <div
            className="w-full overflow-hidden rounded-xl border border-border"
            style={{ height: 300 }}
          >
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={25} minSize={20}>
                <PanelContent label="Sidebar" />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <PanelContent label="Main Content" className="bg-background" />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={25} minSize={20}>
                <PanelContent label="Details" />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </PreviewBlock>

        <SectionHeading label="Vertical" />

        <PreviewBlock
          title="Two-panel vertical"
          description="Stacked panels split between a toolbar area and main content"
          code={CODE.vertical}
          previewClassName="p-6"
        >
          <div
            className="w-full overflow-hidden rounded-xl border border-border"
            style={{ height: 400 }}
          >
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={40}>
                <PanelContent label="Header / Toolbar" />
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={60}>
                <PanelContent label="Content Area" className="bg-background" />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </PreviewBlock>

        <SectionHeading label="Nested" />

        <PreviewBlock
          title="Nested panels"
          description="Horizontal split with a nested vertical group — the left handle uses withHandle={false}"
          code={CODE.nested}
          previewClassName="p-6"
        >
          <div
            className="w-full overflow-hidden rounded-xl border border-border"
            style={{ height: 400 }}
          >
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={30}>
                <PanelContent label="Navigation" />
              </ResizablePanel>
              <ResizableHandle withHandle={false} />
              <ResizablePanel defaultSize={70}>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={60}>
                    <PanelContent label="Editor" className="bg-background" />
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={40}>
                    <PanelContent label="Terminal / Output" />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/resizable/")({
  head: () => createCatalogPageHead("/atoms/resizable/"),
  component: ResizablePage,
});
