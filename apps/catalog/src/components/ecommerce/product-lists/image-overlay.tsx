
import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@hilum/ui";

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

type ProductName = (typeof PRODUCTS)[number]["name"];
type BagState = Record<ProductName, boolean>;

const INITIAL_BAG_STATE: BagState = {
  "Earthen Bottle": false,
  "Nomad Tumbler": false,
  "Focus Paper Refill": false,
  "Machined Pencil": false,
};

export default function ImageOverlay() {
  const [bagState, setBagState] = useState<BagState>(INITIAL_BAG_STATE);

  return (
    <section className="w-full bg-white px-6 py-8 md:px-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {PRODUCTS.map((product) => (
          <article key={product.name} className="group">
            <div className="relative overflow-hidden rounded-[2rem] bg-taupe-100">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-taupe-950 via-taupe-950/60 to-transparent p-4">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="body font-medium text-white">{product.name}</h3>
                    <p className="caption text-white/70">{product.price}</p>
                  </div>
                  <ShoppingBag className="size-4 text-white/70" />
                </div>
                <Button
                  size="sm"
                  variant={bagState[product.name] ? "brand" : "secondary"}
                  className="w-full"
                  onClick={() =>
                    setBagState((current) => ({
                      ...current,
                      [product.name]: !current[product.name],
                    }))
                  }
                >
                  {bagState[product.name] ? (
                    <>
                      <Check className="size-4" />
                      Added
                    </>
                  ) : (
                    "Add to bag"
                  )}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
