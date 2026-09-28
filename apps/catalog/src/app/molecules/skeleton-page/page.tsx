import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import {
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  SkeletonThumbnail,
} from "@hilum/ui";

const PAGE_CODE = `import { SkeletonPage } from "@hilum/ui"

if (isLoading) return <SkeletonPage backAction primaryAction />`;

const PARTS_CODE = `<SkeletonPage title="Products" primaryAction>
  <Card>
    <SkeletonThumbnail />
    <SkeletonDisplayText size="sm" />
    <SkeletonBodyText lines={2} />
  </Card>
</SkeletonPage>`;

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SkeletonPagePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-foreground">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Skeleton Page</span>
        </div>
        <h1 className="display mb-2 text-foreground">Skeleton Page</h1>
        <p className="body max-w-lg text-muted-foreground">
          Loading templates for admin pages: SkeletonPage with header placeholders and a
          primary/secondary card layout, plus SkeletonBodyText, SkeletonDisplayText and
          SkeletonThumbnail.
        </p>
      </div>

      <PageDocs path="/molecules/skeleton-page/" />

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Page" />
          <PreviewBlock
            title="Default layout"
            description="aria-busy container with a polite Loading page status."
            code={PAGE_CODE}
            previewClassName="flex-col items-stretch"
          >
            <SkeletonPage backAction primaryAction />
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Parts" />
          <PreviewBlock
            title="Custom body"
            description="Compose the primitives inside your own cards."
            code={PARTS_CODE}
            previewClassName="flex-col items-stretch"
          >
            <SkeletonPage title="Products" primaryAction>
              <Card className="flex flex-col gap-4 p-4">
                {[0, 1, 2].map((row) => (
                  <div key={row} className="flex items-center gap-3">
                    <SkeletonThumbnail />
                    <div className="flex flex-1 flex-col gap-2">
                      <SkeletonDisplayText size="sm" />
                      <SkeletonBodyText lines={1} />
                    </div>
                  </div>
                ))}
              </Card>
            </SkeletonPage>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/skeleton-page/")({
  head: () => createCatalogPageHead("/molecules/skeleton-page/"),
  component: SkeletonPagePage,
});
