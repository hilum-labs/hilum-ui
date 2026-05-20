
const PRODUCT_IMAGE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-full-bleed-image.jpg";
const DETAIL_IMAGE_ONE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-01.jpg";
const DETAIL_IMAGE_TWO = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-02.jpg";

type Spec = {
  label: string;
  value: string;
};

const PRODUCT_SPECS: Spec[] = [
  { label: "Material", value: "Ballistic nylon" },
  { label: "Dimensions", value: `15"×10"×3"` },
  { label: "Weight", value: "1 lb" },
  { label: "Warranty", value: "Lifetime" },
];

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

export default function ImageGrid() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[28px] border border-ground-100 bg-white p-6">
          <p className="label mb-4 text-brand-primary">Product details</p>
          <dl className="divide-y divide-ground-100">
            {PRODUCT_SPECS.map((spec) => (
              <div key={spec.label} className="py-4 first:pt-0 last:pb-0">
                <dt className="label text-ground-400">{spec.label}</dt>
                <dd className="body mt-2 text-ground-900">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={PRODUCT_IMAGE}
              alt="Full bag image"
              className="aspect-square"
            />
          </div>
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={DETAIL_IMAGE_ONE}
              alt="Front detail image"
              className="aspect-square"
            />
          </div>
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={DETAIL_IMAGE_TWO}
              alt="Side detail image"
              className="aspect-square"
            />
          </div>
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={DETAIL_IMAGE_ONE}
              alt="Repeated material closeup"
              className="aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
