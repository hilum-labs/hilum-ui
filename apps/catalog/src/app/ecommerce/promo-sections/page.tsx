
import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

import BackgroundImageHero from "@/components/ecommerce/promo-sections/background-image-hero";
import backgroundImageHeroSource from "@/components/ecommerce/promo-sections/background-image-hero?raw";

import WorkspaceCollectionHero from "@/components/ecommerce/promo-sections/workspace-collection-hero";
import workspaceCollectionHeroSource from "@/components/ecommerce/promo-sections/workspace-collection-hero?raw";

import TextLeftImageStackRight from "@/components/ecommerce/promo-sections/text-left-image-stack-right";
import textLeftImageStackRightSource from "@/components/ecommerce/promo-sections/text-left-image-stack-right?raw";

import ImageStackLeftTextRight from "@/components/ecommerce/promo-sections/image-stack-left-text-right";
import imageStackLeftTextRightSource from "@/components/ecommerce/promo-sections/image-stack-left-text-right?raw";

import LargeCampaignHero from "@/components/ecommerce/promo-sections/large-campaign-hero";
import largeCampaignHeroSource from "@/components/ecommerce/promo-sections/large-campaign-hero?raw";

import TextWithProductTiles from "@/components/ecommerce/promo-sections/text-with-product-tiles";
import textWithProductTilesSource from "@/components/ecommerce/promo-sections/text-with-product-tiles?raw";

import BackgroundImageWithTestimonial from "@/components/ecommerce/promo-sections/background-image-with-testimonial";
import backgroundImageWithTestimonialSource from "@/components/ecommerce/promo-sections/background-image-with-testimonial?raw";

import SplitLayoutWithOfferLinks from "@/components/ecommerce/promo-sections/split-layout-with-offer-links";
import splitLayoutWithOfferLinksSource from "@/components/ecommerce/promo-sections/split-layout-with-offer-links?raw";

function SectionHeading({ label }: { label: string }) {
  return <div className="mb-4 flex items-center gap-3"><h2 className="label text-taupe-400">{label}</h2><div className="h-px flex-1 bg-taupe-100" /></div>;
}

export default function PromoSectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/ecommerce" className="hover:text-taupe-700">Ecommerce</a>
          <span>/</span>
          <span className="body font-semibold text-taupe-900">Promo Sections</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Promo Sections</h1>
        <p className="body max-w-2xl text-taupe-400">
          Promotional hero banners with background images, overlapping tiles, and CTAs.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <Badge variant="secondary">Marketing · 8 variants</Badge>
        </div>
      </div>

      <div className="space-y-10">
        <div>
          <SectionHeading label="Promo Sections · With background image" />
          <PreviewBlock
            title="Background image hero"
            description="Centered copy over a full-bleed workspace backdrop."
            code={backgroundImageHeroSource}
            previewClassName="p-0"
          >
            <BackgroundImageHero />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Promo Sections · Full width with background image" />
          <PreviewBlock
            title="Workspace collection hero"
            description="Large left-aligned content over an immersive photo."
            code={workspaceCollectionHeroSource}
            previewClassName="p-0"
          >
            <WorkspaceCollectionHero />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Promo Sections · Full width with overlapping image tiles" />
          <PreviewBlock
            title="Text left, image stack right"
            description="Staggered product imagery paired with a strong merchandising message."
            code={textLeftImageStackRightSource}
            previewClassName="p-0"
          >
            <TextLeftImageStackRight />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Promo Sections · With overlapping image tiles" />
          <PreviewBlock
            title="Image stack left, text right"
            description="Reversed composition for merchandising callouts and campaign copy."
            code={imageStackLeftTextRightSource}
            previewClassName="p-0"
          >
            <ImageStackLeftTextRight />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Promo Sections · Full width with large content" />
          <PreviewBlock
            title="Large campaign hero"
            description="Oversized title, subtitle, and dual CTAs over a scenic product image."
            code={largeCampaignHeroSource}
            previewClassName="p-0"
          >
            <LargeCampaignHero />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Promo Sections · With image tiles" />
          <PreviewBlock
            title="Text with 2x2 product tiles"
            description="Editorial promo copy paired with a dense product grid."
            code={textWithProductTilesSource}
            previewClassName="p-0"
          >
            <TextWithProductTiles />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Promo Sections · With fading background image and testimonials" />
          <PreviewBlock
            title="Background image with testimonial"
            description="A darkened photo backdrop with a customer quote and supporting CTA."
            code={backgroundImageWithTestimonialSource}
            previewClassName="p-0"
          >
            <BackgroundImageWithTestimonial />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Promo Sections · With offers and split image" />
          <PreviewBlock
            title="Split layout with offer links"
            description="Large image on the left with clickable stacked offers on the right."
            code={splitLayoutWithOfferLinksSource}
            previewClassName="p-0"
          >
            <SplitLayoutWithOfferLinks />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
