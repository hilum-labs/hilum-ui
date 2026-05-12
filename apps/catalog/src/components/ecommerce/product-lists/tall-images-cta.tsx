
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
] as const;

export default function TallImagesCta() {
  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="grid gap-6 md:grid-cols-3">
        {PRODUCTS.map((product) => (
          <article key={product.name}>
            <div className="overflow-hidden rounded-[2rem] bg-taupe-100">
              <img src={product.image} alt={product.name} className="aspect-[2/3] w-full object-cover" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="subheading text-taupe-900">{product.name}</h3>
                <p className="caption mt-1 text-taupe-400">{product.price}</p>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 label text-brand-primary transition-opacity hover:opacity-80"
              >
                Shop now
                <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
