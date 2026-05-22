import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { PreviewBlock } from "@/components/catalog/preview-block";
import BannerHeader from "@/components/marketing/banners/banner-header";
import bannerHeaderSource from "@/components/marketing/banners/banner-header?raw";
import BannerHeaderCentered from "@/components/marketing/banners/banner-header-centered";
import bannerHeaderCenteredSource from "@/components/marketing/banners/banner-header-centered?raw";
import BannerFloatingBottom from "@/components/marketing/banners/banner-floating-bottom";
import bannerFloatingBottomSource from "@/components/marketing/banners/banner-floating-bottom?raw";
import BannerStickyFooter from "@/components/marketing/banners/banner-sticky-footer";
import bannerStickyFooterSource from "@/components/marketing/banners/banner-sticky-footer?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function BannersPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/marketing" className="hover:text-ground-700">Marketing</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Banners</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Banners</h1>
        <p className="body max-w-md text-ground-400">
          Announcement banners for top-of-page alerts, cookie notices, and floating notifications. All dismissible.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Marketing · Elements</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">4 variants</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Header banner" />
          <PreviewBlock
            title="Dark header banner"
            description="Full-width announcement strip pinned to the top of the page"
            code={bannerHeaderSource}
            previewClassName="p-0"
          >
            <BannerHeader />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Header centered" />
          <PreviewBlock
            title="Brand-colored centered banner"
            description="Centered text on brand-primary background with dismiss"
            code={bannerHeaderCenteredSource}
            previewClassName="p-0"
          >
            <BannerHeaderCentered />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Floating at bottom" />
          <PreviewBlock
            title="Floating notification card"
            description="Elevated card floating above the page footer"
            code={bannerFloatingBottomSource}
            previewClassName="p-0"
          >
            <BannerFloatingBottom />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Sticky footer" />
          <PreviewBlock
            title="Cookie consent bar"
            description="Slim bar anchored to the bottom edge of the viewport"
            code={bannerStickyFooterSource}
            previewClassName="p-0"
          >
            <BannerStickyFooter />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/marketing/banners/")({
  head: () => createCatalogPageHead("/marketing/banners/"),
  component: BannersPage,
});
