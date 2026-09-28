import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { Card, PageLayout, AnnotatedSection, Field, Input } from "@hilum/ui";

function Box({ label, tall = false }: { label: string; tall?: boolean }) {
  return (
    <Card className={tall ? "min-h-40 p-4" : "min-h-20 p-4"}>
      <p className="caption text-muted-foreground">{label}</p>
    </Card>
  );
}

const PRIMARY_CODE = `import { PageLayout } from "@hilum/ui"

<PageLayout>
  <PageLayout.Section>{/* primary cards */}</PageLayout.Section>
  <PageLayout.Section variant="secondary">{/* sidebar cards */}</PageLayout.Section>
</PageLayout>`;

const VARIANTS_CODE = `<PageLayout>
  <PageLayout.Section variant="full">…</PageLayout.Section>
  <PageLayout.Section variant="oneHalf">…</PageLayout.Section>
  <PageLayout.Section variant="oneHalf">…</PageLayout.Section>
  <PageLayout.Section variant="oneThird">…</PageLayout.Section>
  <PageLayout.Section variant="oneThird">…</PageLayout.Section>
  <PageLayout.Section variant="oneThird">…</PageLayout.Section>
</PageLayout>`;

const ANNOTATED_CODE = `<PageLayout>
  <AnnotatedSection
    title="Store details"
    description="Shown on your invoices and order confirmations."
  >
    <Card>…fields…</Card>
  </AnnotatedSection>
</PageLayout>`;

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function LayoutPage() {
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
          <span className="font-semibold text-foreground">Page Layout</span>
        </div>
        <h1 className="display mb-2 text-foreground">Page Layout</h1>
        <p className="body max-w-lg text-muted-foreground">
          Admin page grid: PageLayout sections that sit side by side while there is room and wrap on
          small screens, plus AnnotatedSection for settings pages. Logical properties keep it
          correct in RTL.
        </p>
      </div>

      <PageDocs path="/molecules/layout/" />

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Primary + secondary" />
          <PreviewBlock
            title="Detail page"
            description="Two-thirds / one-third that stacks when narrower than ~45rem."
            code={PRIMARY_CODE}
            previewClassName="flex-col items-stretch"
          >
            <PageLayout>
              <PageLayout.Section>
                <Box label="Order items" tall />
                <Box label="Payment" />
              </PageLayout.Section>
              <PageLayout.Section variant="secondary">
                <Box label="Customer" />
                <Box label="Tags" />
              </PageLayout.Section>
            </PageLayout>
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Variants" />
          <PreviewBlock
            title="full · oneHalf · oneThird"
            description="Equal columns wrap by minimum width instead of fixed breakpoints."
            code={VARIANTS_CODE}
            previewClassName="flex-col items-stretch"
          >
            <PageLayout>
              <PageLayout.Section variant="full">
                <Box label="full" />
              </PageLayout.Section>
              <PageLayout.Section variant="oneHalf">
                <Box label="oneHalf" />
              </PageLayout.Section>
              <PageLayout.Section variant="oneHalf">
                <Box label="oneHalf" />
              </PageLayout.Section>
              <PageLayout.Section variant="oneThird">
                <Box label="oneThird" />
              </PageLayout.Section>
              <PageLayout.Section variant="oneThird">
                <Box label="oneThird" />
              </PageLayout.Section>
              <PageLayout.Section variant="oneThird">
                <Box label="oneThird" />
              </PageLayout.Section>
            </PageLayout>
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Annotated section" />
          <PreviewBlock
            title="Settings page"
            description="Title and description on the inline-start side, content on the other; stacks on mobile."
            code={ANNOTATED_CODE}
            previewClassName="flex-col items-stretch"
          >
            <PageLayout>
              <AnnotatedSection
                title="Store details"
                description="Shown on your invoices and order confirmations."
              >
                <Card className="flex flex-col gap-4 p-4">
                  <Field label="Store name">
                    <Input defaultValue="Linen & Co." />
                  </Field>
                  <Field label="Contact email">
                    <Input type="email" defaultValue="hello@linen.co" />
                  </Field>
                </Card>
              </AnnotatedSection>
            </PageLayout>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/layout/")({
  head: () => createCatalogPageHead("/molecules/layout/"),
  component: LayoutPage,
});
