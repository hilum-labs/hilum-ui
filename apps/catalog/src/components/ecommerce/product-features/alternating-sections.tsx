
const PRODUCT_IMAGE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-full-bleed-image.jpg";
const DETAIL_IMAGE_ONE = "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-01.jpg";

type Spec = {
  label: string;
  value: string;
};

type AlternatingFeature = {
  heading: string;
  description: string;
  eyebrow: string;
};

const PRODUCT_SPECS: Spec[] = [
  { label: "Material", value: "Ballistic nylon" },
  { label: "Dimensions", value: `15"×10"×3"` },
  { label: "Weight", value: "1 lb" },
  { label: "Warranty", value: "Lifetime" },
];

const ALTERNATING_FEATURES: AlternatingFeature[] = [
  {
    eyebrow: "Daily carry",
    heading: "Built to move from desk setup to train platform.",
    description:
      "Everyday Ruck Snack keeps the profile slim while still making room for chargers, notebooks, and the kind of small essentials that usually create clutter.",
  },
  {
    eyebrow: "Organization",
    heading: "The front panel opens wide so the layout stays visible.",
    description:
      "A structured opening and shallow depth mean you can grab the gear you need without unpacking the rest of the bag. The shape does the organizing work for you.",
  },
  {
    eyebrow: "Comfort",
    heading: "Light enough for everyday wear, durable enough for the long run.",
    description:
      "The ballistic nylon shell keeps abrasion low and confidence high. It is the kind of material choice that lets the product disappear into the routine.",
  },
];

function SpecList({ specs }: { specs: Spec[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="rounded-2xl border border-taupe-100 bg-taupe-50 p-4"
        >
          <dt className="label text-taupe-400">{spec.label}</dt>
          <dd className="body mt-2 text-taupe-900">{spec.value}</dd>
        </div>
      ))}
    </dl>
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

export default function AlternatingSections() {
  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="space-y-10">
        {ALTERNATING_FEATURES.map((feature, index) => (
          <div
            key={feature.heading}
            className="grid gap-8 border-b border-taupe-100 pb-10 last:border-b-0 last:pb-0 lg:grid-cols-2 lg:items-center"
          >
            <div
              className={`overflow-hidden rounded-[28px] ${
                index % 2 === 1 ? "lg:order-2" : ""
              }`}
            >
              <ProductImage
                src={index === 1 ? DETAIL_IMAGE_ONE : PRODUCT_IMAGE}
                alt="Everyday Ruck Snack feature"
                className="aspect-[4/3]"
              />
            </div>
            <div className={index % 2 === 1 ? "lg:order-1" : ""}>
              <p className="label mb-3 text-brand-primary">{feature.eyebrow}</p>
              <h3 className="heading text-taupe-900">{feature.heading}</h3>
              <p className="body mt-4 max-w-xl text-taupe-600">
                {feature.description}
              </p>
              <div className="mt-6">
                <SpecList specs={PRODUCT_SPECS} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
