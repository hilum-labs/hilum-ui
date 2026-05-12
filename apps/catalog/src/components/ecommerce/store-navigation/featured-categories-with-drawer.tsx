
import { useState } from "react";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

type CategoryName = "Women" | "Men";

type NavCategory = {
  name: CategoryName;
  featured: { title: string; subtitle: string; image: string }[];
  sections: {
    label: string;
    links: string[];
  }[];
};

const categories: NavCategory[] = [
  {
    name: "Women",
    featured: [
      {
        title: "Spring Layers",
        subtitle: "Light jackets, soft knits, and everyday staples",
        image: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg",
      },
      {
        title: "Weekend Accessories",
        subtitle: "Bags, hats, and sunglasses with a clean finish",
        image: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg",
      },
    ],
    sections: [
      { label: "Clothing", links: ["Tops", "Dresses", "Pants", "T-Shirts", "Jackets"] },
      { label: "Accessories", links: ["Watches", "Bags", "Sunglasses", "Hats"] },
      { label: "Brands", links: ["Full Nelson", "My Way", "Counterfeit"] },
    ],
  },
  {
    name: "Men",
    featured: [
      {
        title: "Travel Edit",
        subtitle: "Relaxed tailoring and easy layers for the week ahead",
        image: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-03.jpg",
      },
      {
        title: "Performance Basics",
        subtitle: "Activewear and durable accessories for every day",
        image: "https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-01.jpg",
      },
    ],
    sections: [
      { label: "Clothing", links: ["Basics", "Casual", "Travel", "Activewear"] },
      { label: "Accessories", links: ["Watches", "Bags", "Belts"] },
      { label: "Brands", links: ["Re-Arranged", "Counterfeit", "Full Nelson"] },
    ],
  },
];

const pages = ["Company", "Stores"];

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-lg bg-taupe-900 text-sm font-semibold text-white">
        D
      </div>
      <div>
        <p className="body font-semibold text-taupe-900">Drift</p>
        <p className="caption text-taupe-400">Modern store</p>
      </div>
    </div>
  );
}

function CartButton() {
  return (
    <button className="relative flex size-10 items-center justify-center rounded-full border border-taupe-100 text-taupe-700 transition-colors hover:bg-taupe-50">
      <ShoppingBag size={17} />
      <Badge variant="brand" className="absolute -right-1.5 -top-1.5 min-w-5 justify-center px-1.5 py-0 text-[10px] leading-none">
        2
      </Badge>
    </button>
  );
}

function PageContent({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center justify-center bg-taupe-50 body text-taupe-400 ${compact ? "h-[200px]" : "h-32"}`}>
      Page content
    </div>
  );
}

function CategoryTabs({
  active,
  setActive,
}: {
  active: CategoryName;
  setActive: (value: CategoryName) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-taupe-100 bg-white p-1">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => setActive(category.name)}
          className={`flex items-center gap-1 rounded-full px-3 py-1.5 body transition-colors ${
            active === category.name
              ? "bg-taupe-900 text-white"
              : "text-taupe-500 hover:bg-taupe-50 hover:text-taupe-900"
          }`}
        >
          {category.name}
          <ChevronDown size={14} />
        </button>
      ))}
    </div>
  );
}

function FeaturedColumnsMenu({ category }: { category: NavCategory }) {
  return (
    <div className="grid gap-6 border-t border-taupe-100 bg-white px-5 py-5 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.6fr]">
      <div className="grid gap-4 md:grid-cols-2">
        {category.featured.map((item) => (
          <div key={item.title} className="overflow-hidden rounded-2xl border border-taupe-100 bg-taupe-50">
            <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />
            <div className="space-y-1 p-4">
              <p className="body font-semibold text-taupe-900">{item.title}</p>
              <p className="caption leading-relaxed text-taupe-400">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      {category.sections.map((section) => (
        <div key={section.label}>
          <p className="label mb-3 text-taupe-400">{section.label}</p>
          <div className="space-y-2">
            {section.links.map((link) => (
              <a key={link} href="#" className="block body text-taupe-600 transition-colors hover:text-taupe-900">
                {link}
              </a>
            ))}
          </div>
        </div>
      ))}
      <div>
        <p className="label mb-3 text-taupe-400">Pages</p>
        <div className="space-y-2">
          {pages.map((page) => (
            <a key={page} href="#" className="block body text-taupe-600 transition-colors hover:text-taupe-900">
              {page}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({
  category,
  onClose,
}: {
  category: NavCategory;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-x-0 top-[72px] z-50 border-t border-taupe-100 bg-white shadow-natural">
      <div className="flex items-center justify-between border-b border-taupe-100 px-5 py-3">
        <div>
          <p className="body font-semibold text-taupe-900">{category.name} navigation</p>
          <p className="caption text-taupe-400">Featured categories and quick links</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>
      <div className="grid gap-5 px-5 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {category.featured.map((item) => (
            <div key={item.title} className="overflow-hidden rounded-[24px] border border-taupe-100 bg-taupe-50">
              <img src={item.image} alt={item.title} className="h-28 w-full object-cover" />
              <div className="space-y-1 p-4">
                <p className="body font-semibold text-taupe-900">{item.title}</p>
                <p className="caption text-taupe-400">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {category.sections.map((section) => (
            <div key={section.label} className="rounded-2xl bg-taupe-50 p-4">
              <p className="label mb-3 text-taupe-400">{section.label}</p>
              <div className="space-y-2">
                {section.links.map((link) => (
                  <a key={link} href="#" className="block body text-taupe-700">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCategoriesWithDrawer() {
  const [featuredTab, setFeaturedTab] = useState<CategoryName>("Women");
  const [featuredMobileOpen, setFeaturedMobileOpen] = useState(true);

  const featuredCategory = categories.find((category) => category.name === featuredTab) ?? categories[0];

  return (
    <div className="w-full rounded-xl border border-taupe-100 overflow-hidden bg-white">
      <div className="relative h-[360px]">
        <div className="border-b border-taupe-100">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFeaturedMobileOpen((value) => !value)}
                className="flex size-10 items-center justify-center rounded-full border border-taupe-100 text-taupe-700 transition-colors hover:bg-taupe-50"
              >
                <Menu size={18} />
              </button>
              <LogoMark />
            </div>
            <CategoryTabs active={featuredTab} setActive={setFeaturedTab} />
            <div className="flex items-center gap-2">
              <button className="flex size-10 items-center justify-center rounded-full border border-taupe-100 text-taupe-700 transition-colors hover:bg-taupe-50">
                <Search size={17} />
              </button>
              <CartButton />
            </div>
          </div>
          <FeaturedColumnsMenu category={featuredCategory} />
        </div>
        {featuredMobileOpen && (
          <MobileDrawer
            category={featuredCategory}
            onClose={() => setFeaturedMobileOpen(false)}
          />
        )}
        <PageContent />
      </div>
    </div>
  );
}
