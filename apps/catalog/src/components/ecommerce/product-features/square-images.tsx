const PRODUCT_IMAGE =
  "https://tailwindui.com/img/ecommerce-images/product-feature-02-full-bleed-image.jpg";
const DETAIL_IMAGE_ONE =
  "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-01.jpg";
const DETAIL_IMAGE_TWO =
  "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-02.jpg";

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

function SpecList({ specs }: { specs: Spec[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {specs.map((spec) => (
        <div key={spec.label} className="rounded-2xl border border-ground-100 bg-ground-50 p-4">
          <dt className="label text-ground-400">{spec.label}</dt>
          <dd className="body mt-2 text-ground-900">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`h-full w-full object-cover ${className ?? ""}`} />;
}

export default function SquareImages() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="rounded-[28px] border border-ground-100 bg-white p-6">
          <p className="label mb-3 text-brand-primary">Everyday Ruck Snack</p>
          <h3 className="heading text-ground-900">
            Compact proportions with just enough structure.
          </h3>
          <p className="body mt-4 text-ground-600">
            This version puts the product summary first, then lets the photography handle the
            nuance.
          </p>
          <div className="mt-6">
            <SpecList specs={PRODUCT_SPECS} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[PRODUCT_IMAGE, DETAIL_IMAGE_ONE, DETAIL_IMAGE_TWO, DETAIL_IMAGE_ONE].map(
            (src, index) => (
              <div key={`${src}-${index}`} className="overflow-hidden rounded-3xl">
                <ProductImage
                  src={src}
                  alt={`Square product detail ${index + 1}`}
                  className="aspect-square"
                />
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
