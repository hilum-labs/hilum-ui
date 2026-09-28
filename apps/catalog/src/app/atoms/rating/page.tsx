import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Rating } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = `import { Rating } from "@hilum/ui"

<Rating value={4.5} showValue count={128} />
<Rating value={rating} onValueChange={setRating} label="Your rating" size="lg" />`;

function Demo() {
  const [rating, setRating] = useState(3);
  return (
    <div className="flex flex-col gap-3">
      <Rating value={4.5} showValue count={128} />
      <Rating value={rating} onValueChange={setRating} label="Your rating" size="lg" />
    </div>
  );
}

function RatingPage() {
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
          <span className="font-semibold text-foreground">Rating</span>
        </div>
        <h1 className="display mb-2 text-foreground">Rating</h1>
        <p className="body max-w-lg text-muted-foreground">
          Star rating. Read-only with partial stars for reviews and product cards, or an accessible
          radio-group input.
        </p>
      </div>

      <PageDocs path="/atoms/rating/" />

      <div className="flex flex-col gap-8">
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Rating</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock
            title="Display and input"
            description="Token colours; fractional values render partial stars."
            code={CODE}
          >
            <Demo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/rating/")({
  head: () => createCatalogPageHead("/atoms/rating/"),
  component: RatingPage,
});
