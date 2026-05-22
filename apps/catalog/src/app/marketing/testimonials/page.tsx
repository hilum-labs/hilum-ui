import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { PreviewBlock } from "@/components/catalog/preview-block";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

import SimpleCentered from "@/components/marketing/testimonials/simple-centered";
import simpleCenteredSource from "@/components/marketing/testimonials/simple-centered?raw";

import SideBySideOnBrand from "@/components/marketing/testimonials/side-by-side-on-brand";
import sideBySideOnBrandSource from "@/components/marketing/testimonials/side-by-side-on-brand?raw";

import WithLargeAvatar from "@/components/marketing/testimonials/with-large-avatar";
import withLargeAvatarSource from "@/components/marketing/testimonials/with-large-avatar?raw";

import WithBackgroundImage from "@/components/marketing/testimonials/with-background-image";
import withBackgroundImageSource from "@/components/marketing/testimonials/with-background-image?raw";

import WithOverlappingImage from "@/components/marketing/testimonials/with-overlapping-image";
import withOverlappingImageSource from "@/components/marketing/testimonials/with-overlapping-image?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className='mb-4 flex items-center gap-3'>
      <h2 className='label text-ground-400'>{label}</h2>
      <div className='h-px flex-1 bg-ground-100' />
    </div>
  );
}

function TestimonialsPage() {
  return (
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
          <span className="font-semibold text-ground-900">Testimonials</span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Social Proof</Badge>
          <Badge variant="outline">5 variants</Badge>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <a href="/marketing">Browse all sections</a>
          </Button>
        </div>

        <h1 className="display mb-2 text-ground-900">Testimonials</h1>
        <p className="body max-w-2xl text-ground-500">
          Customer proof sections for landing pages, campaigns, and product
          narratives. These examples range from minimal editorial quotes to
          darker, higher-contrast layouts.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Testimonials" />

        <PreviewBlock
          title="Simple centered"
          description="Editorial quote with a centered attribution block"
          code={simpleCenteredSource}
          previewClassName="p-0 items-stretch"
        >
          <SimpleCentered />
        </PreviewBlock>

        <PreviewBlock
          title="Side by side on brand"
          description="Two compact testimonials on a dark brand surface"
          code={sideBySideOnBrandSource}
          previewClassName="p-0 items-stretch"
        >
          <SideBySideOnBrand />
        </PreviewBlock>

        <PreviewBlock
          title="With large avatar"
          description="Customer portrait treatment with generous vertical rhythm"
          code={withLargeAvatarSource}
          previewClassName="p-0 items-stretch"
        >
          <WithLargeAvatar />
        </PreviewBlock>

        <PreviewBlock
          title="With background image"
          description="Dark atmospheric section with oversized decorative quote marks"
          code={withBackgroundImageSource}
          previewClassName="p-0 items-stretch"
        >
          <WithBackgroundImage />
        </PreviewBlock>

        <PreviewBlock
          title="With overlapping image"
          description="Split testimonial with an oversized image placeholder and editorial quote"
          code={withOverlappingImageSource}
          previewClassName="p-0 items-stretch"
        >
          <WithOverlappingImage />
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/marketing/testimonials/")({
  head: () => createCatalogPageHead("/marketing/testimonials/"),
  component: TestimonialsPage,
});
