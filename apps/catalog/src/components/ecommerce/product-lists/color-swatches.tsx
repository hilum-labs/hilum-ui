
import { useState } from "react";

const PRODUCTS = [
  {
    name: "Earthen Bottle",
    price: "$48",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    colors: [
      { name: "Natural", className: "bg-brand-secondary" },
      { name: "Cinder", className: "bg-ground-800" },
      { name: "Signal", className: "bg-brand-primary" },
    ],
  },
  {
    name: "Nomad Tumbler",
    price: "$35",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    colors: [
      { name: "Mist", className: "bg-ground-200" },
      { name: "Stone", className: "bg-ground-500" },
      { name: "Midnight", className: "bg-ground-900" },
    ],
  },
  {
    name: "Focus Paper Refill",
    price: "$89",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    colors: [
      { name: "Porcelain", className: "bg-white border border-ground-300" },
      { name: "Oat", className: "bg-brand-secondary" },
      { name: "Char", className: "bg-ground-700" },
    ],
  },
  {
    name: "Machined Pencil",
    price: "$32",
    image: "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    colors: [
      { name: "Flint", className: "bg-ground-400" },
      { name: "Signal", className: "bg-brand-primary" },
      { name: "Night", className: "bg-ground-900" },
    ],
  },
] as const;

type ProductName = (typeof PRODUCTS)[number]["name"];
type SwatchState = Record<ProductName, number>;

const INITIAL_SWATCHES: SwatchState = {
  "Earthen Bottle": 0,
  "Nomad Tumbler": 1,
  "Focus Paper Refill": 0,
  "Machined Pencil": 2,
};

export default function ColorSwatches() {
  const [selectedSwatches, setSelectedSwatches] = useState<SwatchState>(INITIAL_SWATCHES);

  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
        <div className="flex gap-4 pb-1 md:grid md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {PRODUCTS.map((product) => {
            const activeColor = product.colors[selectedSwatches[product.name]];

            return (
              <article
                key={product.name}
                className="w-72 shrink-0 rounded-[2rem] border border-ground-100 bg-white p-4 shadow-natural md:w-auto"
              >
                <div className="overflow-hidden rounded-2xl bg-ground-50">
                  <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
                </div>
                <div className="mt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="body font-medium text-ground-900">{product.name}</h3>
                      <p className="caption mt-1 text-ground-400">Shown in {activeColor.name}</p>
                    </div>
                    <p className="body text-ground-500">{product.price}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {product.colors.map((color, colorIndex) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() =>
                          setSelectedSwatches((current) => ({
                            ...current,
                            [product.name]: colorIndex,
                          }))
                        }
                        aria-label={`${product.name} in ${color.name}`}
                        className={`flex size-7 items-center justify-center rounded-full border transition ${
                          selectedSwatches[product.name] === colorIndex
                            ? "border-ground-900"
                            : "border-transparent hover:border-ground-200"
                        }`}
                      >
                        <span className={`size-5 rounded-full ${color.className}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
