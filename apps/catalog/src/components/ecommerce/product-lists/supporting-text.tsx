
const PRODUCTS = [
  {
    name: "Earthen Bottle",
    price: "$48",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    description: "Clay-toned hydration with a grippy finish built for daily carry.",
  },
  {
    name: "Nomad Tumbler",
    price: "$35",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    description: "Double-wall insulation sized for your commute and your desk.",
  },
  {
    name: "Focus Paper Refill",
    price: "$89",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    description: "Grid, blank, and ruled sheets for planning sessions that stick.",
  },
] as const;

export default function SupportingText() {
  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <article
            key={product.name}
            className="rounded-[2rem] border border-ground-100 bg-white p-4 shadow-natural transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className="overflow-hidden rounded-2xl bg-ground-50">
              <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="mt-5">
              <div className="flex items-start justify-between gap-4">
                <h3 className="subheading text-ground-900">{product.name}</h3>
                <p className="body text-ground-500">{product.price}</p>
              </div>
              <p className="body mt-3 text-ground-500">{product.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
