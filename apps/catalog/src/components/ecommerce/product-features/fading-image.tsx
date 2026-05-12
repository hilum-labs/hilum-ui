
const PRODUCT_IMAGE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-full-bleed-image.jpg";

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

export default function FadingImage() {
  return (
    <section className="w-full bg-white">
      <div className="relative overflow-hidden">
        <ProductImage
          src={PRODUCT_IMAGE}
          alt="Everyday Ruck Snack on a bright studio set"
          className="aspect-[2.4/1] min-h-[320px]"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>
      <div className="grid gap-4 px-6 py-8 sm:grid-cols-3 sm:px-8">
        <div className="rounded-2xl border border-taupe-100 bg-white p-5">
          <p className="label text-taupe-400">Material</p>
          <p className="subheading mt-2 text-taupe-900">Ballistic nylon</p>
          <p className="body mt-2 text-taupe-600">
            Structured enough to hold shape, soft enough for daily wear.
          </p>
        </div>
        <div className="rounded-2xl border border-taupe-100 bg-white p-5">
          <p className="label text-taupe-400">Dimensions</p>
          <p className="subheading mt-2 text-taupe-900">{`15"×10"×3"`}</p>
          <p className="body mt-2 text-taupe-600">
            A compact footprint designed for light essentials.
          </p>
        </div>
        <div className="rounded-2xl border border-taupe-100 bg-white p-5">
          <p className="label text-taupe-400">Warranty</p>
          <p className="subheading mt-2 text-taupe-900">Lifetime</p>
          <p className="body mt-2 text-taupe-600">
            Built to be part of the routine for years, not seasons.
          </p>
        </div>
      </div>
    </section>
  );
}
