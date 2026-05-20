import { PreviewBlock } from "@/components/catalog/preview-block";

import NotFound404Simple from "@/components/marketing/404-pages/not-found-404-simple";
import notFound404SimpleSource from "@/components/marketing/404-pages/not-found-404-simple?raw";

import NotFound404WithLogo from "@/components/marketing/404-pages/not-found-404-with-logo";
import notFound404WithLogoSource from "@/components/marketing/404-pages/not-found-404-with-logo?raw";

import NotFound404SplitImage from "@/components/marketing/404-pages/not-found-404-split-image";
import notFound404SplitImageSource from "@/components/marketing/404-pages/not-found-404-split-image?raw";

import NotFound404BackgroundImage from "@/components/marketing/404-pages/not-found-404-background-image";
import notFound404BackgroundImageSource from "@/components/marketing/404-pages/not-found-404-background-image?raw";

import NotFound404PopularPages from "@/components/marketing/404-pages/not-found-404-popular-pages";
import notFound404PopularPagesSource from "@/components/marketing/404-pages/not-found-404-popular-pages?raw";

import NotFound404WithNavAndFooter from "@/components/marketing/404-pages/not-found-404-with-nav-and-footer";
import notFound404WithNavAndFooterSource from "@/components/marketing/404-pages/not-found-404-with-nav-and-footer?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function NotFoundPagesPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/marketing" className="hover:text-ground-700">Marketing</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">404 Pages</span>
        </div>
        <h1 className="display mb-2 text-ground-900">404 Pages</h1>
        <p className="body max-w-md text-ground-400">
          Not-found page layouts — from minimal centred messages to full-nav experiences with helpful links.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Marketing · Feedback</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">6 variants</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Simple" />
          <PreviewBlock title="Simple centered" description="Clean error message with two action buttons" code={notFound404SimpleSource} previewClassName="p-0">
            <NotFound404Simple />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Simple with logo" />
          <PreviewBlock title="With brand logo" description="Logo mark above the error message with a link back home" code={notFound404WithLogoSource} previewClassName="p-0">
            <NotFound404WithLogo />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Split with image" />
          <PreviewBlock title="Half image, half content" description="Two-column layout with an image panel on the right" code={notFound404SplitImageSource} previewClassName="p-0">
            <NotFound404SplitImage />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="With background image" />
          <PreviewBlock title="Dark overlay background" description="Full-bleed dark section with a radial brand-primary glow" code={notFound404BackgroundImageSource} previewClassName="p-0">
            <NotFound404BackgroundImage />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="With popular pages" />
          <PreviewBlock title="Helpful resource links" description="Error message followed by a list of popular destination pages" code={notFound404PopularPagesSource} previewClassName="p-0">
            <NotFound404PopularPages />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="With navbar and footer" />
          <PreviewBlock title="Full page layout" description="Complete page shell with site navigation and footer" code={notFound404WithNavAndFooterSource} previewClassName="p-0">
            <NotFound404WithNavAndFooter />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
