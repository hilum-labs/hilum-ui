
import { PreviewBlock } from "@/components/catalog/preview-block";
import BlogSectionCards from "@/components/marketing/blog-sections/blog-section-cards";
import blogSectionCardsSource from "@/components/marketing/blog-sections/blog-section-cards?raw";
import BlogSectionList from "@/components/marketing/blog-sections/blog-section-list";
import blogSectionListSource from "@/components/marketing/blog-sections/blog-section-list?raw";
import BlogSectionNewsletter from "@/components/marketing/blog-sections/blog-section-newsletter";
import blogSectionNewsletterSource from "@/components/marketing/blog-sections/blog-section-newsletter?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function BlogSectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10 max-w-2xl">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/marketing" className="hover:text-ground-700">
            Marketing
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Blog Sections</span>
        </div>
        <h1 className="display text-ground-900">Blog Sections</h1>
        <p className="body mt-3 text-ground-500">
          Editorial layouts for article indexes, compact story lists, and newsletter-led content pages.
        </p>
      </div>

      <SectionHeading label="Variant 1" />
      <PreviewBlock
        title="Three Column Cards"
        description="Centered intro with article cards, thumbnails, and author metadata."
        code={blogSectionCardsSource}
        previewClassName="block p-0"
      >
        <BlogSectionCards />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 2" />
      <PreviewBlock
        title="Three Column With Badges"
        description="Cleaner list-style editorial cards without images."
        code={blogSectionListSource}
        previewClassName="block p-0"
      >
        <BlogSectionList />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 3" />
      <PreviewBlock
        title="Two Column With Sign Up"
        description="Stacked editorial stories paired with a newsletter subscription panel."
        code={blogSectionNewsletterSource}
        previewClassName="block p-0"
      >
        <BlogSectionNewsletter />
      </PreviewBlock>
    </div>
  );
}
