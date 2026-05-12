
const PRODUCTS = [
  {
    name: "Earthen Bottle",
    price: "$48",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    rating: 5,
    reviews: 128,
  },
  {
    name: "Nomad Tumbler",
    price: "$35",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    rating: 4,
    reviews: 76,
  },
  {
    name: "Focus Paper Refill",
    price: "$89",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    rating: 5,
    reviews: 52,
  },
  {
    name: "Machined Pencil",
    price: "$32",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    rating: 4,
    reviews: 91,
  },
] as const;

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-sm leading-none">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < rating ? "text-brand-secondary" : "text-taupe-200"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function BorderGrid() {
  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-taupe-100">
        <div className="grid gap-px bg-taupe-100 sm:grid-cols-2 xl:grid-cols-4">
          {PRODUCTS.map((product) => (
            <article key={product.name} className="bg-white p-6">
              <div className="overflow-hidden rounded-2xl bg-taupe-50">
                <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="body font-medium text-taupe-900">{product.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <RatingStars rating={product.rating} />
                    <span className="caption text-taupe-400">({product.reviews})</span>
                  </div>
                </div>
                <p className="body text-taupe-500">{product.price}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
