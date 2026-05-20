
type CategoryCard = {
  name: string;
  description: string;
  count: string;
  image: string;
};

const EDITION_ONE = "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg";
const EDITION_TWO = "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-02.jpg";
const EDITION_THREE = "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg";

const DESCRIPTION_CATEGORIES: CategoryCard[] = [
  {
    name: "Desk and Office",
    description:
      "Storage, sleeves, and work-surface details that make small routines easier.",
    count: "12 styles",
    image: EDITION_ONE,
  },
  {
    name: "Travel",
    description:
      "Weekend-ready bags and organizers designed to stay efficient in motion.",
    count: "16 styles",
    image: EDITION_TWO,
  },
  {
    name: "Clothing",
    description:
      "Lightweight outer layers and versatile staples that travel well through the week.",
    count: "22 styles",
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

export default function ThreeColumnDescription() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {DESCRIPTION_CATEGORIES.map((category) => (
          <article
            key={category.name}
            className="overflow-hidden rounded-[28px] border border-ground-100 bg-white"
          >
            <div className="overflow-hidden">
              <CategoryImage
                src={category.image}
                alt={category.name}
                className="aspect-[4/5]"
              />
            </div>
            <div className="p-5">
              <p className="subheading text-ground-900">{category.name}</p>
              <p className="body mt-3 text-ground-600">{category.description}</p>
              <p className="caption mt-4 text-ground-400">{category.count}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
