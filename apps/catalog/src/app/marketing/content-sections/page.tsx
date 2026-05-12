
import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

import Centered from "@/components/marketing/content-sections/centered";
import centeredSource from "@/components/marketing/content-sections/centered?raw";

import SplitWithImage from "@/components/marketing/content-sections/split-with-image";
import splitWithImageSource from "@/components/marketing/content-sections/split-with-image?raw";

import TwoColumns from "@/components/marketing/content-sections/two-columns";
import twoColumnsSource from "@/components/marketing/content-sections/two-columns?raw";

import TwoColumnsWithImage from "@/components/marketing/content-sections/two-columns-with-image";
import twoColumnsWithImageSource from "@/components/marketing/content-sections/two-columns-with-image?raw";

import TwoColumnsWithTestimonial from "@/components/marketing/content-sections/two-columns-with-testimonial";
import twoColumnsWithTestimonialSource from "@/components/marketing/content-sections/two-columns-with-testimonial?raw";

import WithTestimonialAndStats from "@/components/marketing/content-sections/with-testimonial-and-stats";
import withTestimonialAndStatsSource from "@/components/marketing/content-sections/with-testimonial-and-stats?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function ContentSectionsPage() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
            <a href="/" className="hover:text-taupe-700">
              Design System
            </a>
            <span>/</span>
            <a href="/marketing" className="hover:text-taupe-700">
              Marketing
            </a>
            <span>/</span>
            <span className="font-semibold text-taupe-900">Content Sections</span>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <Badge variant="secondary">Content</Badge>
            <span className="caption text-taupe-400">6 variants</span>
          </div>
          <h1 className="display mb-2 text-taupe-900">Content Sections</h1>
          <p className="body max-w-2xl text-taupe-400">
            Long-form section patterns for narrative-heavy pages, including image splits,
            editorial layouts, testimonials, and supporting stats.
          </p>
        </div>

        <SectionHeading label="Variants" />

        <div className="space-y-8">
          <PreviewBlock
            title="Centered"
            code={centeredSource}
            previewClassName="block bg-white p-0"
          >
            <Centered />
          </PreviewBlock>

          <PreviewBlock
            title="Split with image"
            code={splitWithImageSource}
            previewClassName="block bg-white p-0"
          >
            <SplitWithImage />
          </PreviewBlock>

          <PreviewBlock
            title="Two columns"
            code={twoColumnsSource}
            previewClassName="block bg-white p-0"
          >
            <TwoColumns />
          </PreviewBlock>

          <PreviewBlock
            title="Two columns with image"
            code={twoColumnsWithImageSource}
            previewClassName="block bg-white p-0"
          >
            <TwoColumnsWithImage />
          </PreviewBlock>

          <PreviewBlock
            title="Two columns with testimonial"
            code={twoColumnsWithTestimonialSource}
            previewClassName="block bg-white p-0"
          >
            <TwoColumnsWithTestimonial />
          </PreviewBlock>

          <PreviewBlock
            title="With testimonial and stats"
            code={withTestimonialAndStatsSource}
            previewClassName="block bg-white p-0"
          >
            <WithTestimonialAndStats />
          </PreviewBlock>
        </div>

        <div className="h-16" />
      </div>
    </div>
  );
}
