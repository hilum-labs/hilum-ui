import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

import NewsletterSimpleWithDescription from "@/components/marketing/newsletter-sections/newsletter-simple-with-description";
import newsletterSimpleWithDescriptionSource from "@/components/marketing/newsletter-sections/newsletter-simple-with-description?raw";

import NewsletterSimpleStacked from "@/components/marketing/newsletter-sections/newsletter-simple-stacked";
import newsletterSimpleStackedSource from "@/components/marketing/newsletter-sections/newsletter-simple-stacked?raw";

import NewsletterCenteredCardWithGraphic from "@/components/marketing/newsletter-sections/newsletter-centered-card-with-graphic";
import newsletterCenteredCardWithGraphicSource from "@/components/marketing/newsletter-sections/newsletter-centered-card-with-graphic?raw";

import NewsletterWithDescriptionOnBrandCard from "@/components/marketing/newsletter-sections/newsletter-with-description-on-brand-card";
import newsletterWithDescriptionOnBrandCardSource from "@/components/marketing/newsletter-sections/newsletter-with-description-on-brand-card?raw";

import NewsletterWithParagraphOnDark from "@/components/marketing/newsletter-sections/newsletter-with-paragraph-on-dark";
import newsletterWithParagraphOnDarkSource from "@/components/marketing/newsletter-sections/newsletter-with-paragraph-on-dark?raw";

import NewsletterWithParagraphOnDarkFullWidth from "@/components/marketing/newsletter-sections/newsletter-with-paragraph-on-dark-full-width";
import newsletterWithParagraphOnDarkFullWidthSource from "@/components/marketing/newsletter-sections/newsletter-with-paragraph-on-dark-full-width?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function NewsletterSectionsPage() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
            <a href="/" className="hover:text-ground-700">
              Design System
            </a>
            <span>/</span>
            <a href="/marketing" className="hover:text-ground-700">
              Marketing
            </a>
            <span>/</span>
            <span className="font-semibold text-ground-900">Newsletter Sections</span>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <Badge variant="secondary">Conversion</Badge>
            <span className="caption text-ground-400">6 variants</span>
          </div>
          <h1 className="display mb-2 text-ground-900">Newsletter Sections</h1>
          <p className="body max-w-2xl text-ground-400">
            Email capture patterns that range from quiet inline forms to full-width brand moments,
            all styled with the system input and button primitives.
          </p>
        </div>

        <PageDocs path="/marketing/newsletter-sections/" />

        <SectionHeading label="Variants" />

        <div className="space-y-8">
          <PreviewBlock
            title="Simple with description"
            code={newsletterSimpleWithDescriptionSource}
            previewClassName="block bg-white p-0"
          >
            <NewsletterSimpleWithDescription />
          </PreviewBlock>

          <PreviewBlock
            title="Simple stacked"
            code={newsletterSimpleStackedSource}
            previewClassName="block bg-white p-0"
          >
            <NewsletterSimpleStacked />
          </PreviewBlock>

          <PreviewBlock
            title="Centered card with graphic"
            code={newsletterCenteredCardWithGraphicSource}
            previewClassName="block bg-white p-0"
          >
            <NewsletterCenteredCardWithGraphic />
          </PreviewBlock>

          <PreviewBlock
            title="With description on brand card"
            code={newsletterWithDescriptionOnBrandCardSource}
            previewClassName="block bg-white p-0"
          >
            <NewsletterWithDescriptionOnBrandCard />
          </PreviewBlock>

          <PreviewBlock
            title="With paragraph on dark"
            code={newsletterWithParagraphOnDarkSource}
            previewClassName="block bg-white p-0"
          >
            <NewsletterWithParagraphOnDark />
          </PreviewBlock>

          <PreviewBlock
            title="With paragraph on dark full-width"
            code={newsletterWithParagraphOnDarkFullWidthSource}
            previewClassName="block bg-white p-0"
          >
            <NewsletterWithParagraphOnDarkFullWidth />
          </PreviewBlock>
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/marketing/newsletter-sections/")({
  head: () => createCatalogPageHead("/marketing/newsletter-sections/"),
  component: NewsletterSectionsPage,
});
