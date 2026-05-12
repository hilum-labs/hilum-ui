import { Link } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

type SectionEntry = {
  name: string;
  slug: string;
  description: string;
  variants: number;
  category: string;
};

const SECTIONS: SectionEntry[] = [
  {
    name: "Product Lists",
    slug: "product-lists",
    description: "Product grids and lists with images, ratings, color swatches, and CTAs.",
    variants: 11,
    category: "Product",
  },
  {
    name: "Product Overviews",
    slug: "product-overviews",
    description: "Detailed product pages with image galleries, selectors, and tabbed details.",
    variants: 5,
    category: "Product",
  },
  {
    name: "Product Features",
    slug: "product-features",
    description: "Showcase product specs and details with images, tabs, and alternating layouts.",
    variants: 9,
    category: "Product",
  },
  {
    name: "Product Quickviews",
    slug: "product-quickviews",
    description: "Modal quick-view panels with color/size selectors and product details.",
    variants: 4,
    category: "Product",
  },
  {
    name: "Shopping Carts",
    slug: "shopping-carts",
    description: "Cart layouts as modals, slide-overs, popovers, and full-page views.",
    variants: 6,
    category: "Checkout",
  },
  {
    name: "Checkout Forms",
    slug: "checkout-forms",
    description: "Single-step and multi-step checkout forms with order summary layouts.",
    variants: 5,
    category: "Checkout",
  },
  {
    name: "Order History",
    slug: "order-history",
    description: "Order list views as tables, panels, and invoice lists with quick actions.",
    variants: 4,
    category: "Account",
  },
  {
    name: "Order Summaries",
    slug: "order-summaries",
    description: "Order confirmation pages with progress bars, images, and split layouts.",
    variants: 4,
    category: "Account",
  },
  {
    name: "Category Filters",
    slug: "category-filters",
    description: "Sidebar and dropdown filter panels for browsing product categories.",
    variants: 5,
    category: "Browsing",
  },
  {
    name: "Category Previews",
    slug: "category-previews",
    description: "Category landing sections with image cards, scrolling carousels, and split layouts.",
    variants: 6,
    category: "Browsing",
  },
  {
    name: "Store Navigation",
    slug: "store-navigation",
    description: "Full storefront navigation with mega menus, featured categories, and mobile drawers.",
    variants: 5,
    category: "Navigation",
  },
  {
    name: "Promo Sections",
    slug: "promo-sections",
    description: "Promotional hero banners with background images, overlapping tiles, and CTAs.",
    variants: 8,
    category: "Marketing",
  },
  {
    name: "Incentives",
    slug: "incentives",
    description: "Shipping, returns, and warranty highlights with icons and illustrations.",
    variants: 8,
    category: "Marketing",
  },
  {
    name: "Reviews",
    slug: "reviews",
    description: "Customer review sections with star ratings, avatars, and summary charts.",
    variants: 4,
    category: "Social Proof",
  },
];

const TOTAL_VARIANTS = SECTIONS.reduce((acc, s) => acc + s.variants, 0);

export default function EcommercePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Ecommerce</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Ecommerce</h1>
        <p className="body max-w-md text-taupe-400">
          Storefront UI patterns for online shops. Product grids, checkout flows, cart components, navigation, and promotional sections — all adapted to the brand.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <p className="caption text-taupe-400">{SECTIONS.length} section types</p>
          <div className="h-3 w-px bg-taupe-100" />
          <p className="caption text-taupe-400">{TOTAL_VARIANTS} variants total</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {SECTIONS.map((section) => (
          <Card
            key={section.slug}
            className="shadow-natural flex flex-col justify-between transition-shadow hover:shadow-elevated"
          >
            <CardHeader className="pb-2">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="caption-xs">
                  {section.category}
                </Badge>
                <span className="caption-xs text-taupe-400">{section.variants} variants</span>
              </div>
              <CardTitle className="subheading text-taupe-900">{section.name}</CardTitle>
              <CardDescription className="caption leading-relaxed text-taupe-400">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-auto px-0 py-0 text-taupe-500 hover:text-taupe-900 hover:bg-transparent"
              >
                <Link to={`/ecommerce/${section.slug}`}>View section →</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="h-16" />
    </div>
  );
}
