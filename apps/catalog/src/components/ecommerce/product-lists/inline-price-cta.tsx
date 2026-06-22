import { ArrowRight } from "lucide-react";

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
  {
    name: "Ceramic Mug",
    price: "$28",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-01.jpg",
  },
  {
    name: "Zip Tote Basket",
    price: "$140",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-02.jpg",
  },
] as const;

export default function InlinePriceCta() {
  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-ground-100 bg-white">
        {PRODUCTS.map((product) => (
          <article
            key={product.name}
            className="grid gap-4 border-b border-ground-100 px-5 py-4 last:border-b-0 lg:grid-cols-[112px_1fr_auto]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-28 rounded-2xl object-cover"
            />
            <div className="flex items-center justify-between gap-4">
              <h3 className="body font-medium text-ground-900">{product.name}</h3>
              <p className="body text-ground-500">{product.price}</p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 label text-brand-primary transition-opacity hover:opacity-80"
            >
              View product
              <ArrowRight className="size-4" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
