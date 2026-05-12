
import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import FeaturedCategoriesWithDrawer from "@/components/ecommerce/store-navigation/featured-categories-with-drawer";
import featuredCategoriesWithDrawerSource from "@/components/ecommerce/store-navigation/featured-categories-with-drawer?raw";
import FeaturedTabsNav from "@/components/ecommerce/store-navigation/featured-tabs-nav";
import featuredTabsNavSource from "@/components/ecommerce/store-navigation/featured-tabs-nav?raw";
import ImageGridMegaMenu from "@/components/ecommerce/store-navigation/image-grid-mega-menu";
import imageGridMegaMenuSource from "@/components/ecommerce/store-navigation/image-grid-mega-menu?raw";
import ImageGridNav from "@/components/ecommerce/store-navigation/image-grid-nav";
import imageGridNavSource from "@/components/ecommerce/store-navigation/image-grid-nav?raw";
import CenteredLogoNav from "@/components/ecommerce/store-navigation/centered-logo-nav";
import centeredLogoNavSource from "@/components/ecommerce/store-navigation/centered-logo-nav?raw";
import SimplePromoNav from "@/components/ecommerce/store-navigation/simple-promo-nav";
import simplePromoNavSource from "@/components/ecommerce/store-navigation/simple-promo-nav?raw";
import SimpleNavWithPromoPanel from "@/components/ecommerce/store-navigation/simple-nav-with-promo-panel";
import simpleNavWithPromoPanelSource from "@/components/ecommerce/store-navigation/simple-nav-with-promo-panel?raw";
import DoubleColumnMenuWithMobileNav from "@/components/ecommerce/store-navigation/double-column-menu-with-mobile-nav";
import doubleColumnMenuWithMobileNavSource from "@/components/ecommerce/store-navigation/double-column-menu-with-mobile-nav?raw";
import PersistentMobileNav from "@/components/ecommerce/store-navigation/persistent-mobile-nav";
import persistentMobileNavSource from "@/components/ecommerce/store-navigation/persistent-mobile-nav?raw";

function SectionHeading({ label }: { label: string }) {
  return <div className="mb-4 flex items-center gap-3"><h2 className="label text-taupe-400">{label}</h2><div className="h-px flex-1 bg-taupe-100" /></div>;
}

export default function StoreNavigationPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/ecommerce" className="hover:text-taupe-700">Ecommerce</a>
          <span>/</span>
          <span className="body font-semibold text-taupe-900">Store Navigation</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Store Navigation</h1>
        <p className="body max-w-2xl text-taupe-400">
          Full storefront navigation with mega menus, featured categories, and mobile drawers.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <Badge variant="secondary">Navigation · 9 variants</Badge>
        </div>
      </div>

      <div className="space-y-10">
        <div>
          <SectionHeading label="Store Navigation · With featured categories" />
          <PreviewBlock
            title="Featured categories with drawer"
            description="Tabbed navigation, rich mega menu, and a mobile-style drawer."
            code={featuredCategoriesWithDrawerSource}
            previewClassName="p-0"
          >
            <FeaturedCategoriesWithDrawer />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Store Navigation · Featured tabs" />
          <PreviewBlock
            title="Featured tabs nav"
            description="Tab-style category switcher with featured columns mega menu."
            code={featuredTabsNavSource}
            previewClassName="p-0"
          >
            <FeaturedTabsNav />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Store Navigation · With image grid" />
          <PreviewBlock
            title="Image grid mega menu"
            description="Two featured tiles on top with section links arranged below."
            code={imageGridMegaMenuSource}
            previewClassName="p-0"
          >
            <ImageGridMegaMenu />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Store Navigation · Image grid nav" />
          <PreviewBlock
            title="Image grid nav"
            description="Hover-activated image grid navigation with category links."
            code={imageGridNavSource}
            previewClassName="p-0"
          >
            <ImageGridNav />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Store Navigation · Centered logo" />
          <PreviewBlock
            title="Centered logo with featured categories"
            description="Centered brand mark with navigation split across both sides."
            code={centeredLogoNavSource}
            previewClassName="p-0"
          >
            <CenteredLogoNav />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Store Navigation · Simple promo" />
          <PreviewBlock
            title="Simple promo nav"
            description="Compact navigation with a promotional highlight and category links."
            code={simplePromoNavSource}
            previewClassName="p-0"
          >
            <SimplePromoNav />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Store Navigation · Simple menu and promo" />
          <PreviewBlock
            title="Simple navigation with promo panel"
            description="A lighter menu structure with a promotional banner and essential links."
            code={simpleNavWithPromoPanelSource}
            previewClassName="p-0"
          >
            <SimpleNavWithPromoPanel />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Store Navigation · Double column with mobile nav" />
          <PreviewBlock
            title="Double-column menu with mobile nav"
            description="Desktop mega menu with a persistent mobile-style action bar."
            code={doubleColumnMenuWithMobileNavSource}
            previewClassName="p-0"
          >
            <DoubleColumnMenuWithMobileNav />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Store Navigation · Persistent mobile nav" />
          <PreviewBlock
            title="Double-column menu and bottom mobile nav"
            description="Desktop mega menu above with a persistent mobile-style action bar anchored at the bottom."
            code={persistentMobileNavSource}
            previewClassName="p-0"
          >
            <PersistentMobileNav />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
