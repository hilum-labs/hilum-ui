import { useState } from "react";
import { ChevronDown, Search, ShoppingBag } from "lucide-react";
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

function FeaturedColumnsMenu({ category }: { category: NavCategory }) {
  return (
    <div className="grid gap-6 border-t border-ground-100 bg-white px-5 py-5 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.6fr]">
      <div className="grid gap-4 md:grid-cols-2">
        {category.featured.map((item) => (
          <div
            key={item.title}
            className="overflow-hidden rounded-2xl border border-ground-100 bg-ground-50"
          >
            <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />
            <div className="space-y-1 p-4">
              <p className="body font-semibold text-ground-900">{item.title}</p>
              <p className="caption leading-relaxed text-ground-400">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      {category.sections.map((section) => (
        <div key={section.label}>
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
      <div>
        <p className="label mb-3 text-ground-400">Pages</p>
        <div className="space-y-2">
          {pages.map((page) => (
            <a
              key={page}
              href="#"
              className="block body text-ground-600 transition-colors hover:text-ground-900"
            >
              {page}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CenteredLogoNav() {
  const [centeredMenu, setCenteredMenu] = useState<CategoryName>("Women");

  const centeredCategory =
    categories.find((category) => category.name === centeredMenu) ?? categories[0];

  return (
    <div className="w-full rounded-xl border border-ground-100 overflow-hidden bg-white">
      <div className="h-[360px]">
        <div className="border-b border-ground-100 px-5 py-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setCenteredMenu(category.name)}
                  className={`rounded-full px-4 py-2 body transition-colors ${
                    centeredMenu === category.name
                      ? "bg-ground-900 text-white"
                      : "text-ground-500 hover:bg-ground-50 hover:text-ground-900"
                  }`}
                >
                  {category.name}
                </button>
              ))}
              <a href="#" className="px-3 py-2 body text-ground-500 hover:text-ground-900">
                Company
              </a>
            </div>
            <div className="justify-self-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-ground-900 heading text-white">
                D
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button className="flex size-10 items-center justify-center rounded-full border border-ground-100 text-ground-700">
                <Search size={17} />
              </button>
              <CartButton />
            </div>
          </div>
        </div>
        <FeaturedColumnsMenu category={centeredCategory} />
        <PageContent />
      </div>
    </div>
  );
}
