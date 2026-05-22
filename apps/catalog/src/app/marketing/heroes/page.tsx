import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PreviewBlock } from "@/components/catalog/preview-block";

import HeroSimpleCentered from "@/components/marketing/heroes/hero-simple-centered";
import heroSimpleCenteredSource from "@/components/marketing/heroes/hero-simple-centered?raw";

import HeroWithScreenshot from "@/components/marketing/heroes/hero-with-screenshot";
import heroWithScreenshotSource from "@/components/marketing/heroes/hero-with-screenshot?raw";

import HeroSplitWithScreenshot from "@/components/marketing/heroes/hero-split-with-screenshot";
import heroSplitWithScreenshotSource from "@/components/marketing/heroes/hero-split-with-screenshot?raw";

import HeroSplitWithNavbar from "@/components/marketing/heroes/hero-split-with-navbar";
import heroSplitWithNavbarSource from "@/components/marketing/heroes/hero-split-with-navbar?raw";

import HeroDarkWithIllustration from "@/components/marketing/heroes/hero-dark-with-illustration";
import heroDarkWithIllustrationSource from "@/components/marketing/heroes/hero-dark-with-illustration?raw";

import HeroWithSignIn from "@/components/marketing/heroes/hero-with-sign-in";
import heroWithSignInSource from "@/components/marketing/heroes/hero-with-sign-in?raw";

import HeroCenteredOnBrand from "@/components/marketing/heroes/hero-centered-on-brand";
import heroCenteredOnBrandSource from "@/components/marketing/heroes/hero-centered-on-brand?raw";

import HeroWithAngledImage from "@/components/marketing/heroes/hero-with-angled-image";
import heroWithAngledImageSource from "@/components/marketing/heroes/hero-with-angled-image?raw";

import HeroWithSignUpAndMedia from "@/components/marketing/heroes/hero-with-sign-up-and-media";
import heroWithSignUpAndMediaSource from "@/components/marketing/heroes/hero-with-sign-up-and-media?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function HeroesPage() {
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
          <span className="font-semibold text-ground-900">Heroes</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Heroes</h1>
        <p className="body max-w-lg text-ground-500">
          Full-width hero sections with headlines, CTAs, screenshots, and
          sign-up forms.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Page Intro</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">9 variants</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Hero 1" />
          <PreviewBlock
            title="Simple centered"
            description="Centered headline with paired CTAs"
            code={heroSimpleCenteredSource}
            previewClassName="p-0"
          >
            <HeroSimpleCentered />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Hero 2" />
          <PreviewBlock
            title="With screenshot"
            description="Centered copy, CTA row, screenshot, and logo cloud"
            code={heroWithScreenshotSource}
            previewClassName="p-0"
          >
            <HeroWithScreenshot />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Hero 3" />
          <PreviewBlock
            title="Split with screenshot"
            description="Lead capture on the left, product mockup on the right"
            code={heroSplitWithScreenshotSource}
            previewClassName="p-0"
          >
            <HeroSplitWithScreenshot />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Hero 4" />
          <PreviewBlock
            title="Split with navbar"
            description="Minimal navbar above a split hero and highlighted panel"
            code={heroSplitWithNavbarSource}
            previewClassName="p-0"
          >
            <HeroSplitWithNavbar />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Hero 5" />
          <PreviewBlock
            title="Dark with illustration"
            description="Dark hero with bold contrast and feature illustration"
            code={heroDarkWithIllustrationSource}
            previewClassName="p-0"
          >
            <HeroDarkWithIllustration />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Hero 6" />
          <PreviewBlock
            title="With sign in"
            description="Marketing copy paired with a credential form"
            code={heroWithSignInSource}
            previewClassName="p-0"
          >
            <HeroWithSignIn />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Hero 7" />
          <PreviewBlock
            title="Gradient network"
            description="Atmospheric mesh gradient with orbit lines and a frosted stat rail"
            code={heroCenteredOnBrandSource}
            previewClassName="p-0"
          >
            <HeroCenteredOnBrand />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Hero 8" />
          <PreviewBlock
            title="With angled image"
            description="60/40 split with a rounded media panel"
            code={heroWithAngledImageSource}
            previewClassName="p-0"
          >
            <HeroWithAngledImage />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Hero 9" />
          <PreviewBlock
            title="With sign up and media"
            description="Centered waitlist form above stats and testimonial cards"
            code={heroWithSignUpAndMediaSource}
            previewClassName="p-0"
          >
            <HeroWithSignUpAndMedia />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/marketing/heroes/")({
  head: () => createCatalogPageHead("/marketing/heroes/"),
  component: HeroesPage,
});
