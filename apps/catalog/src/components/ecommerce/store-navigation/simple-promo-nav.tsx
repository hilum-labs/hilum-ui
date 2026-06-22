import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
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

function PageContent() {
  return (
    <div className="flex items-center justify-center bg-ground-50 body text-ground-400 h-32">
      Page content
    </div>
  );
}

function PromoPanel({ category }: { category: NavCategory }) {
  const links = category.sections.flatMap((section) => section.links).slice(0, 6);
  const feature = category.featured[0];

  return (
    <div className="grid gap-5 border-t border-ground-100 bg-white px-5 py-5 md:grid-cols-[1.2fr_0.8fr]">
      <div className="relative overflow-hidden rounded-[28px]">
        <img src={feature.image} alt={feature.title} className="h-48 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ground-950/80 via-ground-900/35 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex max-w-sm flex-col justify-center p-6">
          <Badge variant="warning" className="w-fit">
            Editor&apos;s pick
          </Badge>
          <h3 className="heading mt-4 text-white">{feature.title}</h3>
          <p className="body mt-2 text-ground-100">{feature.subtitle}</p>
          <div className="mt-5">
            <Button size="sm">Shop the story</Button>
          </div>
        </div>
      </div>
      <div className="rounded-[28px] bg-ground-50 p-5">
        <p className="label mb-4 text-ground-400">{category.name} essentials</p>
        <div className="grid grid-cols-2 gap-3">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="rounded-2xl border border-ground-100 bg-white px-4 py-3 body text-ground-700 transition-colors hover:border-ground-200 hover:text-ground-900"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SimplePromoNav() {
  const [promoMenu, setPromoMenu] = useState<CategoryName>("Women");

  const promoCategory = categories.find((category) => category.name === promoMenu) ?? categories[0];

  return (
    <div className="w-full rounded-xl border border-ground-100 overflow-hidden bg-white">
      <div className="h-[360px]">
        <div className="border-b border-ground-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <LogoMark />
            <div className="flex items-center gap-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setPromoMenu(category.name)}
                  className={`rounded-full px-4 py-2 body transition-colors ${
                    promoMenu === category.name
                      ? "bg-brand-secondary text-ground-900"
                      : "text-ground-500 hover:bg-ground-50 hover:text-ground-900"
                  }`}
                >
                  {category.name}
                </button>
              ))}
              {pages.map((page) => (
                <a
                  key={page}
                  href="#"
                  className="px-3 py-2 body text-ground-500 transition-colors hover:text-ground-900"
                >
                  {page}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex size-10 items-center justify-center rounded-full border border-ground-100 text-ground-700">
                <Search size={17} />
              </button>
              <CartButton />
            </div>
          </div>
        </div>
        <PromoPanel category={promoCategory} />
        <PageContent />
      </div>
    </div>
  );
}
