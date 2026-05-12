
const COLLECTION_ONE = "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg";
const EDITION_TWO = "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-02.jpg";
const EDITION_THREE = "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg";
const RELATED_ONE = "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg";

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

export default function ImageBackgrounds() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: "Desk and Office", image: COLLECTION_ONE },
          { name: "Accessories", image: RELATED_ONE },
          { name: "Travel", image: EDITION_TWO },
          { name: "Clothing", image: EDITION_THREE },
        ].map((category) => (
          <article
            key={category.name}
            className="relative min-h-[320px] overflow-hidden rounded-[28px]"
          >
            <CategoryImage src={category.image} alt={category.name} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="subheading">{category.name}</p>
              <p className="body mt-2 text-white/80">
                Curated pieces with a softer editorial presentation.
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
