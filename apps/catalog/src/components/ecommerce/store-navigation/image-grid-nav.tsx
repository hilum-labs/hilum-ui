import { Search, ShoppingBag } from "lucide-react";
import { Badge } from "@hilum/ui";
import { useState } from "react";

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

function PageContent() {
  return (
    <div className="flex items-center justify-center bg-taupe-50 body text-taupe-400 h-32">
      Page content
    </div>
  );
}

function ImageGridMenu({ category }: { category: NavCategory }) {
  return (
    <div className="border-t border-taupe-100 bg-white px-5 py-5">
      <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {category.featured.map((item) => (
            <a key={item.title} href="#" className="group overflow-hidden rounded-[24px] border border-taupe-100 bg-taupe-50">
              <img src={item.image} alt={item.title} className="h-36 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
              <div className="space-y-1 p-4">
                <p className="body font-semibold text-taupe-900">{item.title}</p>
                <p className="caption text-taupe-400">{item.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {category.sections.map((section) => (
            <div key={section.label} className="rounded-2xl bg-taupe-50 p-4">
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
        </div>
      </div>
    </div>
  );
}

export default function ImageGridNav() {
  const [gridMenu, setGridMenu] = useState<CategoryName>("Women");

  const gridCategory = categories.find((category) => category.name === gridMenu) ?? categories[0];

  return (
    <div className="w-full rounded-xl border border-taupe-100 overflow-hidden bg-white">
      <div className="h-[360px]">
        <div className="border-b border-taupe-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <LogoMark />
            <div className="flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setGridMenu(category.name)}
                  onMouseEnter={() => setGridMenu(category.name)}
                  className={`rounded-full px-4 py-2 body transition-colors ${
                    gridMenu === category.name
                      ? "bg-brand-primary text-white"
                      : "text-taupe-500 hover:bg-taupe-50 hover:text-taupe-900"
                  }`}
                >
                  {category.name}
                </button>
              ))}
              {pages.map((page) => (
                <a key={page} href="#" className="px-3 py-2 body text-taupe-500 transition-colors hover:text-taupe-900">
                  {page}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex size-10 items-center justify-center rounded-full border border-taupe-100 text-taupe-700">
                <Search size={17} />
              </button>
              <CartButton />
            </div>
          </div>
        </div>
        <ImageGridMenu category={gridCategory} />
        <PageContent />
      </div>
    </div>
  );
}
