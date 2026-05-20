
const PRODUCT_IMAGE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-full-bleed-image.jpg";
const DETAIL_IMAGE_ONE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-01.jpg";
const DETAIL_IMAGE_TWO = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-02.jpg";

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-primary" />
          <span className="body text-ground-600">{item}</span>
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

export default function TieredImages() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[28px] border border-ground-100 bg-white p-6">
          <p className="label mb-3 text-brand-primary">Tiered composition</p>
          <h3 className="heading text-ground-900">
            Lead with the overall form, then reveal the details underneath.
          </h3>
          <p className="body mt-4 text-ground-600">
            This arrangement works when the product benefits from a single hero shot
            followed by closer views of the material and construction.
          </p>
          <div className="mt-6">
            <FeatureList
              items={[
                "Hero image establishes scale and silhouette",
                "Lower tier images focus on zipper, strap, and stitching",
                "The rhythm keeps the layout active without feeling busy",
              ]}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={PRODUCT_IMAGE}
              alt="Primary product image"
              className="aspect-[16/10]"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-3xl">
              <ProductImage
                src={DETAIL_IMAGE_ONE}
                alt="Front detail"
                className="aspect-[5/4]"
              />
            </div>
            <div className="overflow-hidden rounded-3xl">
              <ProductImage
                src={DETAIL_IMAGE_TWO}
                alt="Profile detail"
                className="aspect-[5/4]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
