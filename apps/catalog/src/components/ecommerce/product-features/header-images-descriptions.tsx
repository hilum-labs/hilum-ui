
const DETAIL_IMAGE_ONE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-01.jpg";
const DETAIL_IMAGE_TWO = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-02.jpg";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
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

export default function HeaderImagesDescriptions() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="rounded-[28px] border border-taupe-100 bg-white p-6">
        <SectionHeading label="Feature gallery" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={DETAIL_IMAGE_ONE}
              alt="Zipper and front pocket detail"
              className="aspect-[4/3]"
            />
          </div>
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={DETAIL_IMAGE_TWO}
              alt="Bag profile and strap detail"
              className="aspect-[4/3]"
            />
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <p className="body text-taupe-600">
            Everyday Ruck Snack is designed to feel straightforward the first time
            you use it. Compartments sit where your hands expect them, and the
            profile stays slim even when the load shifts through the day.
          </p>
          <p className="body text-taupe-600">
            That sense of ease comes from restraint. The bag focuses on the details
            that improve routine use, then gets out of the way so the object feels
            steady instead of overdesigned.
          </p>
        </div>
      </div>
    </section>
  );
}
