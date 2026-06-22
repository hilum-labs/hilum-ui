import { useState } from "react";

const PRODUCT_IMAGE =
  "https://tailwindui.com/img/ecommerce-images/product-feature-02-full-bleed-image.jpg";
const DETAIL_IMAGE_TWO =
  "https://tailwindui.com/img/ecommerce-images/product-feature-02-detail-02.jpg";

type FeatureTab = "Design" | "Material" | "Considerations";

const TAB_CONTENT: Record<FeatureTab, { title: string; description: string; bullets: string[] }> = {
  Design: {
    title: "A layout tuned for quick access.",
    description:
      "The bag keeps the silhouette narrow and the openings wide, so pockets remain visible instead of turning into deep storage wells.",
    bullets: [
      "Front stash area for boarding pass, notebook, or keys",
      "Low-profile seams that keep the body structured",
      "Balanced proportions for commute, travel day, and cafe setup",
    ],
  },
  Material: {
    title: "Ballistic nylon where durability matters most.",
    description:
      "The shell resists scuffs and daily friction while the interior stays smooth enough that small accessories do not catch when packed or removed.",
    bullets: [
      "Abrasion-resistant shell fabric",
      "Soft-touch interior lining for tech and eyewear",
      "Lifetime warranty backed by repair-friendly construction",
    ],
  },
  Considerations: {
    title: "Optimized for essentials instead of overpacking.",
    description:
      "Everyday Ruck Snack is best when the carry stays intentional. The slim depth helps it move easily through crowded spaces but rewards a lighter loadout.",
    bullets: [
      "Best suited for tablets, paperbacks, and compact accessories",
      "Works well as a second bag inside a weekender",
      "Shallow profile keeps weight close to the body",
    ],
  },
};

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

function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={`h-full w-full object-cover ${className ?? ""}`} />;
}

export default function Tabs() {
  const [activeTab, setActiveTab] = useState<FeatureTab>("Design");

  return (
    <section className="w-full bg-white px-6 py-8 sm:px-8">
      <div className="rounded-[28px] border border-ground-100 bg-white p-6">
        <div className="flex flex-wrap gap-6 border-b border-ground-100">
          {(Object.keys(TAB_CONTENT) as FeatureTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-4 subheading transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-brand-primary text-ground-900"
                  : "text-ground-400 hover:text-ground-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="label mb-3 text-brand-primary">{activeTab}</p>
            <h3 className="heading text-ground-900">{TAB_CONTENT[activeTab].title}</h3>
            <p className="body mt-4 text-ground-600">{TAB_CONTENT[activeTab].description}</p>
            <div className="mt-6">
              <FeatureList items={TAB_CONTENT[activeTab].bullets} />
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <ProductImage
              src={activeTab === "Design" ? PRODUCT_IMAGE : DETAIL_IMAGE_TWO}
              alt={`${activeTab} tab detail`}
              className="aspect-[5/4]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
