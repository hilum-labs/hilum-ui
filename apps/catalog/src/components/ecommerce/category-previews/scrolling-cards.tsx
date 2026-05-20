
import { useState } from "react";
import { Badge } from "@hilum/ui";

type CategoryCard = {
  name: string;
  description: string;
  count: string;
  image: string;
};

const COLLECTION_ONE = "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg";
const EDITION_ONE = "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg";
const EDITION_THREE = "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg";
const RELATED_ONE = "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg";

const SCROLLING_CATEGORIES: CategoryCard[] = [
  {
    name: "Desk and Office",
    description: "Organized essentials for studio, office, and home.",
    count: "18 items",
    image: COLLECTION_ONE,
  },
  {
    name: "Travel",
    description: "Soft luggage, pouches, and compact carry systems.",
    count: "24 items",
    image: EDITION_ONE,
  },
  {
    name: "Accessories",
    description: "Wallets, wraps, organizers, and everyday add-ons.",
    count: "31 items",
    image: RELATED_ONE,
  },
  {
    name: "Clothing",
    description: "Overshirts, layers, and utility staples for every season.",
    count: "22 items",
    image: EDITION_THREE,
  },
];

function CategoryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${className ?? ""}`}
    />
  );
}

export default function ScrollingCards() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Travel");

  const selectedPreview =
    SCROLLING_CATEGORIES.find((category) => category.name === selectedCategory) ??
    SCROLLING_CATEGORIES[1];

  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="subheading text-ground-900">{selectedPreview.name}</p>
          <p className="body mt-2 text-ground-600">{selectedPreview.description}</p>
        </div>
        <Badge variant="outline">{selectedPreview.count}</Badge>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {SCROLLING_CATEGORIES.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => setSelectedCategory(category.name)}
              className={`w-64 shrink-0 overflow-hidden rounded-[28px] border text-left transition-colors ${
                selectedCategory === category.name
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-ground-100 bg-white"
              }`}
            >
              <div className="overflow-hidden">
                <CategoryImage
                  src={category.image}
                  alt={category.name}
                  className="aspect-[4/5]"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="subheading text-ground-900">{category.name}</p>
                  <span className="caption text-ground-400">{category.count}</span>
                </div>
                <p className="body mt-3 text-ground-600">{category.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
