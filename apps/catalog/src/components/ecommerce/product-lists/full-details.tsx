
const PRODUCTS = [
  {
    name: "Earthen Bottle",
    price: "$48",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    description: "Clay-toned hydration with a grippy finish built for daily carry.",
    options: ["Black", "Natural"],
  },
  {
    name: "Nomad Tumbler",
    price: "$35",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    description: "Double-wall insulation sized for your commute and your desk.",
    options: ["Black", "Natural"],
  },
  {
    name: "Focus Paper Refill",
    price: "$89",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    description: "Grid, blank, and ruled sheets for planning sessions that stick.",
    options: ["Black", "Natural"],
  },
  {
    name: "Machined Pencil",
    price: "$32",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    description: "A weighted aluminum body with a precise twist-feed mechanism.",
    options: ["Black", "Natural"],
  },
] as const;

export default function FullDetails() {
  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {PRODUCTS.map((product) => (
          <article
            key={product.name}
            className="rounded-[2rem] border border-taupe-100 bg-white p-4 shadow-natural"
          >
            <div className="overflow-hidden rounded-2xl bg-taupe-50">
              <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
            </div>
            <div className="mt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="subheading text-taupe-900">{product.name}</h3>
                  <p className="caption mt-1 text-taupe-400">{product.options.join(" · ")}</p>
                </div>
                <p className="body text-taupe-500">{product.price}</p>
              </div>
              <p className="caption mt-4 text-taupe-500">{product.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
