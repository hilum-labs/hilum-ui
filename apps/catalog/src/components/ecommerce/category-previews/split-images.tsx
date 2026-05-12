
import { ArrowRight } from "lucide-react";

const COLLECTION_ONE = "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg";
const COLLECTION_TWO = "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg";
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

export default function SplitImages() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="relative overflow-hidden rounded-[32px]">
          <CategoryImage
            src={COLLECTION_TWO}
            alt="Travel collection"
            className="aspect-[4/5] min-h-[420px]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <p className="subheading">Travel</p>
            <a href="#" className="body mt-3 inline-flex items-center gap-2 text-white">
              Shop <ArrowRight className="size-4" />
            </a>
          </div>
        </article>

        <div className="grid gap-4">
          <article className="overflow-hidden rounded-[32px] border border-taupe-100 bg-white">
            <CategoryImage
              src={COLLECTION_ONE}
              alt="Desk and Office collection"
              className="aspect-[16/10]"
            />
            <div className="p-5">
              <p className="subheading text-taupe-900">Desk and Office</p>
              <a
                href="#"
                className="body mt-3 inline-flex items-center gap-2 text-brand-primary"
              >
                Shop <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
          <article className="overflow-hidden rounded-[32px] border border-taupe-100 bg-white">
            <CategoryImage
              src={RELATED_ONE}
              alt="Accessories collection"
              className="aspect-[16/10]"
            />
            <div className="p-5">
              <p className="subheading text-taupe-900">Accessories</p>
              <a
                href="#"
                className="body mt-3 inline-flex items-center gap-2 text-brand-primary"
              >
                Shop <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
