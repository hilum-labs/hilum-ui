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
  <TabsContent value="settings">
    <p className="text-sm text-ground-500">Manage your account settings and preferences.</p>
  </TabsContent>
  <TabsContent value="history">
    <p className="text-sm text-ground-500">View your generation history.</p>
  </TabsContent>
  <TabsContent value="usage">
    <p className="text-sm text-ground-500">Track your API usage and credits.</p>
  </TabsContent>
</Tabs>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function TabsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Tabs</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Tabs</h1>
        <p className="body max-w-lg text-ground-500">
          Organises content into switchable panels.
        </p>
      </div>

      <PageDocs path="/atoms/tabs/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Tabs" />

        <PreviewBlock
          title="Underline style"
          description="Horizontal tab strip with active underline indicator"
          code={CODE.tabs}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-sm">
            <Tabs defaultValue="settings">
              <TabsList>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="history" className="ml-5">History</TabsTrigger>
                <TabsTrigger value="usage" className="ml-5">Usage</TabsTrigger>
              </TabsList>
              <TabsContent value="settings">
                <p className="text-sm text-ground-500">
                  Manage your account settings and preferences.
                </p>
              </TabsContent>
              <TabsContent value="history">
                <p className="text-sm text-ground-500">
                  View your generation history.
                </p>
              </TabsContent>
              <TabsContent value="usage">
                <p className="text-sm text-ground-500">
                  Track your API usage and credits.
                </p>
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
