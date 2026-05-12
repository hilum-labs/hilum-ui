
import { Button } from "@hilum/ui";

const DETAIL_IMAGE_ONE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-01.jpg";
const DETAIL_IMAGE_TWO = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-02.jpg";

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-primary" />
          <span className="body text-taupe-600">{item}</span>
        </li>
      ))}
    </ul>
  );
}

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

export default function SplitImage() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-taupe-100 bg-taupe-50 p-6">
          <p className="label mb-3 text-brand-primary">Why it works</p>
          <h3 className="heading text-taupe-900">
            A compact carry built around useful limits.
          </h3>
          <p className="body mt-4 text-taupe-600">
            The form factor rewards clear priorities: laptop accessories, a small
            notebook, charger, wallet, and a layer for the change in weather.
          </p>
          <div className="mt-6">
            <FeatureList
              items={[
                "Slim depth keeps the silhouette controlled",
                "Sturdy shell fabric helps the bag stand up in use",
                "Layout reduces friction when packing and unpacking",
              ]}
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="default" size="sm">
              View specs
            </Button>
            <Button variant="outline" size="sm">
              Compare materials
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={DETAIL_IMAGE_ONE}
              alt="Front zipped pocket"
              className="aspect-[16/10]"
            />
          </div>
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={DETAIL_IMAGE_TWO}
              alt="Strap and seam construction"
              className="aspect-[16/10]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
