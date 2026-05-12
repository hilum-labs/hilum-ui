
import { ArrowRight } from "lucide-react";

type CategoryCard = {
  name: string;
  description: string;
  count: string;
  image: string;
};

const COLLECTION_ONE = "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg";
const COLLECTION_TWO = "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg";
const COLLECTION_THREE = "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-03.jpg";

const THREE_COLUMN_CATEGORIES: CategoryCard[] = [
  {
    name: "Desk and Office",
    description: "Structured tools for calm, focused workspaces.",
    count: "18 pieces",
    image: COLLECTION_ONE,
  },
  {
    name: "Travel",
    description: "Compact layers and modular gear for movement.",
    count: "24 pieces",
    image: COLLECTION_TWO,
  },
  {
    name: "Accessories",
    description: "Small-format essentials with premium finishes.",
    count: "31 pieces",
    image: COLLECTION_THREE,
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

export default function ThreeColumn() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {THREE_COLUMN_CATEGORIES.map((category) => (
          <article
            key={category.name}
            className="overflow-hidden rounded-[28px] border border-taupe-100 bg-white"
          >
            <div className="overflow-hidden">
              <CategoryImage
                src={category.image}
                alt={category.name}
                className="aspect-[4/5] transition-transform duration-300 hover:scale-[1.03]"
              />
            </div>
            <div className="p-5">
              <p className="subheading text-taupe-900">{category.name}</p>
              <a
                href="#"
                className="body mt-3 inline-flex items-center gap-2 text-brand-primary"
              >
                Shop now <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
