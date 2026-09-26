import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  tabs: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@hilum/ui"

<Tabs defaultValue="settings">
  <TabsList>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="history">History</TabsTrigger>
    <TabsTrigger value="usage">Usage</TabsTrigger>
  </TabsList>
  <TabsContent className="mt-3" value="settings">
    <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
  </TabsContent>
  <TabsContent className="mt-3" value="history">
    <p className="text-sm text-muted-foreground">View your generation history.</p>
  </TabsContent>
  <TabsContent className="mt-3" value="usage">
    <p className="text-sm text-muted-foreground">Track your API usage and credits.</p>
  </TabsContent>
</Tabs>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function TabsPage() {
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
          <span className="font-semibold text-foreground">Tabs</span>
        </div>
        <h1 className="display mb-2 text-foreground">Tabs</h1>
        <p className="body max-w-lg text-muted-foreground">Organises content into switchable panels.</p>
      </div>

      <PageDocs path="/atoms/tabs/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Tabs" />

        <PreviewBlock
          title="Segmented style"
          description="Horizontal segmented tab strip with a sliding active indicator"
          code={CODE.tabs}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-sm">
            <Tabs defaultValue="settings">
              <TabsList>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
              </TabsList>
              <TabsContent className="mt-3" value="settings">
                <p className="text-sm text-muted-foreground">
                  Manage your account settings and preferences.
                </p>
              </TabsContent>
              <TabsContent className="mt-3" value="history">
                <p className="text-sm text-muted-foreground">View your generation history.</p>
              </TabsContent>
              <TabsContent className="mt-3" value="usage">
                <p className="text-sm text-muted-foreground">Track your API usage and credits.</p>
              </TabsContent>
            </Tabs>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/tabs/")({
  head: () => createCatalogPageHead("/atoms/tabs/"),
  component: TabsPage,
});
