import { useState } from "react";
import { House, LayoutGrid, Search, ShoppingBag } from "lucide-react";
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

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-ground-900 text-sm font-semibold text-white">
        D
      </div>
      <div>
        <p className="body font-semibold text-ground-900">Drift</p>
        <p className="caption text-ground-400">Modern store</p>
      </div>
    </div>
  );
}

function CartButton() {
  return (
    <button className="relative flex size-10 items-center justify-center rounded-full border border-ground-100 text-ground-700 transition-colors hover:bg-ground-50">
      <ShoppingBag size={17} />
      <Badge
        variant="brand"
        className="absolute -right-1.5 -top-1.5 min-w-5 justify-center px-1.5 py-0 text-[10px] leading-none"
      >
        2
      </Badge>
    </button>
  );
}

function PageContent({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center bg-ground-50 body text-ground-400 ${compact ? "h-[200px]" : "h-32"}`}
    >
      Page content
    </div>
  );
}

function DoubleColumnMenu({ category }: { category: NavCategory }) {
  return (
    <div className="grid gap-5 border-t border-ground-100 bg-white px-5 py-5 md:grid-cols-[1.1fr_0.9fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        {category.sections.map((section) => (
          <div
            key={section.label}
            className="rounded-[24px] border border-ground-100 bg-ground-50 p-5"
          >
            <p className="label mb-3 text-ground-400">{section.label}</p>
            <div className="space-y-2">
              {section.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block body text-ground-600 transition-colors hover:text-ground-900"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4">
        {category.featured.map((item) => (
          <div key={item.title} className="overflow-hidden rounded-[24px] border border-ground-100">
            <img src={item.image} alt={item.title} className="h-28 w-full object-cover" />
            <div className="space-y-1 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="body font-semibold text-ground-900">{item.title}</p>
                <Badge variant="secondary">{category.name}</Badge>
              </div>
              <p className="caption leading-relaxed text-ground-400">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PersistentMobileNav() {
  const [persistentMenu, setPersistentMenu] = useState<CategoryName>("Men");

  const persistentCategory =
    categories.find((category) => category.name === persistentMenu) ?? categories[0];

  return (
    <div className="w-full rounded-xl border border-ground-100 overflow-hidden bg-white">
      <div className="relative h-[360px] overflow-hidden">
        <div className="border-b border-ground-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LogoMark />
              <div className="hidden items-center gap-2 md:flex">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setPersistentMenu(category.name)}
                    className={`rounded-full px-4 py-2 body transition-colors ${
                      persistentMenu === category.name
                        ? "bg-brand-primary text-white"
                        : "text-ground-500 hover:bg-ground-50 hover:text-ground-900"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex size-10 items-center justify-center rounded-full border border-ground-100 text-ground-700">
                <Search size={17} />
              </button>
              <CartButton />
            </div>
          </div>
        </div>
        <DoubleColumnMenu category={persistentCategory} />
        <PageContent compact />
        <div className="absolute inset-x-0 bottom-0 border-t border-ground-100 bg-white/95 backdrop-blur">
          <div className="grid grid-cols-4">
            {[
              { label: "Home", icon: House },
              { label: "Category", icon: LayoutGrid },
              { label: "Search", icon: Search },
              { label: "Cart", icon: ShoppingBag },
            ].map((item, index) => (
              <button
                key={item.label}
                className={`flex flex-col items-center gap-1 py-3 caption transition-colors ${
                  index === 1 ? "text-brand-primary" : "text-ground-400 hover:text-ground-900"
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
