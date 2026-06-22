import { ArrowRight } from "lucide-react";

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

export default function CtaLink() {
  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <article key={product.name}>
            <div className="overflow-hidden rounded-3xl bg-ground-100">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="subheading text-ground-900">{product.name}</h3>
                <p className="caption mt-1 text-ground-400">{product.description}</p>
              </div>
              <p className="body text-ground-500">{product.price}</p>
            </div>
          </article>
        ))}
      </div>
      <a
        href="#"
        className="mt-8 inline-flex items-center gap-2 label text-brand-primary transition-opacity hover:opacity-80"
      >
        Shop the collection
        <ArrowRight className="size-4" />
      </a>
    </section>
  );
}
