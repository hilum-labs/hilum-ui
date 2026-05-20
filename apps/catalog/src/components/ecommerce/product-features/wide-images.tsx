
import { ArrowRight } from "lucide-react";
import { Button } from "@hilum/ui";

const PRODUCT_IMAGE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-full-bleed-image.jpg";
const DETAIL_IMAGE_ONE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-01.jpg";
const DETAIL_IMAGE_TWO = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-02.jpg";

function ProductImage({
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

export default function WideImages() {
  return (
    <section className="w-full bg-white">
      <div className="space-y-8 px-6 py-8 sm:px-8">
        <div className="relative overflow-hidden rounded-[32px]">
          <ProductImage
            src={PRODUCT_IMAGE}
            alt="Everyday Ruck Snack hero"
            className="aspect-[2.2/1] min-h-[320px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ground-950/75 via-ground-950/25 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center p-8 text-white">
            <p className="label text-brand-secondary">Wide hero</p>
            <h3 className="heading mt-3">A refined daily carry without visual noise.</h3>
            <p className="body mt-4 text-white/80">
              The lead image does the emotional work while the copy stays focused on
              how the product fits into real life.
            </p>
            <div className="mt-6">
              <Button variant="brand" size="sm">
                Explore product <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="overflow-hidden rounded-[32px]">
            <ProductImage
              src={DETAIL_IMAGE_ONE}
              alt="Wide detail crop"
              className="aspect-[2.2/1]"
            />
          </div>
          <div>
            <p className="label text-brand-primary">Closer view</p>
            <h3 className="heading mt-3 text-ground-900">
              Material, zipper path, and seam placement in one pass.
            </h3>
            <p className="body mt-4 text-ground-600">
              This block shifts the emphasis from aspiration to evidence. It is a
              straightforward way to show how finish, fit, and function line up.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px]">
          <ProductImage
            src={DETAIL_IMAGE_TWO}
            alt="Wide strap detail"
            className="aspect-[2.2/1] min-h-[280px]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent p-8">
            <p className="label text-brand-primary">Final detail</p>
            <h3 className="heading mt-3 text-ground-900">
              The closing frame leaves room for a practical takeaway.
            </h3>
            <p className="body mt-3 max-w-2xl text-ground-600">
              Weight, comfort, and long-term durability are usually the last
              questions before purchase. Putting that answer beside the final image
              keeps the story useful right up to the end.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
