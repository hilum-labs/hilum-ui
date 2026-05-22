import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

import AvatarReviewCards from "@/components/ecommerce/reviews/avatar-review-cards";
import avatarReviewCardsSource from "@/components/ecommerce/reviews/avatar-review-cards?raw";

import CompactThreeColumnCards from "@/components/ecommerce/reviews/compact-three-column-cards";
import compactThreeColumnCardsSource from "@/components/ecommerce/reviews/compact-three-column-cards?raw";

import EditorialListWithDividers from "@/components/ecommerce/reviews/editorial-list-with-dividers";
import editorialListWithDividersSource from "@/components/ecommerce/reviews/editorial-list-with-dividers?raw";

import OverallRatingWithFeaturedReviews from "@/components/ecommerce/reviews/overall-rating-with-featured-reviews";
import overallRatingWithFeaturedReviewsSource from "@/components/ecommerce/reviews/overall-rating-with-featured-reviews?raw";

function SectionHeading({ label }: { label: string }) {
  return <div className="mb-4 flex items-center gap-3"><h2 className="label text-ground-400">{label}</h2><div className="h-px flex-1 bg-ground-100" /></div>;
}

function ReviewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/ecommerce" className="hover:text-ground-700">Ecommerce</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Reviews</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Reviews</h1>
        <p className="body max-w-2xl text-ground-400">
          Customer review sections with star ratings, avatars, and summary charts.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <Badge variant="secondary">Social Proof · 4 variants</Badge>
        </div>
      </div>

      <PageDocs path="/ecommerce/reviews/" />

      <div className="space-y-10">
        <div>
          <SectionHeading label="Reviews · Simple with avatars" />
          <PreviewBlock
            title="Avatar review cards"
            description="Two-column review grid with author identity, stars, and editorial titles."
            code={avatarReviewCardsSource}
            previewClassName="p-0"
          >
            <AvatarReviewCards />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Reviews · Multi column" />
          <PreviewBlock
            title="Compact three-column cards"
            description="Dense review cards suitable for social proof rails and category pages."
            code={compactThreeColumnCardsSource}
            previewClassName="p-0"
          >
            <CompactThreeColumnCards />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Reviews · Avatars with separate description" />
          <PreviewBlock
            title="Editorial list with dividers"
            description="Structured review list separating identity, title, and body copy."
            code={editorialListWithDividersSource}
            previewClassName="p-0"
          >
            <EditorialListWithDividers />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Reviews · With summary chart" />
          <PreviewBlock
            title="Overall rating with featured reviews"
            description="Summary chart on the left with two featured review cards on the right."
            code={overallRatingWithFeaturedReviewsSource}
            previewClassName="p-0"
          >
            <OverallRatingWithFeaturedReviews />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/ecommerce/reviews/")({
  head: () => createCatalogPageHead("/ecommerce/reviews/"),
  component: ReviewsPage,
});
