
const PRODUCTS = [
  {
    name: "Earthen Bottle",
    price: "$48",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
  },
  {
    name: "Nomad Tumbler",
    price: "$35",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
  },
  {
    name: "Focus Paper Refill",
    price: "$89",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
  },
  {
    name: "Machined Pencil",
    price: "$32",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
  },
] as const;

export default function Simple() {
  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {PRODUCTS.map((product) => (
          <article key={product.name}>
            <div className="overflow-hidden rounded-3xl bg-taupe-100">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <h3 className="body font-medium text-taupe-900">{product.name}</h3>
              <p className="body text-taupe-500">{product.price}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
