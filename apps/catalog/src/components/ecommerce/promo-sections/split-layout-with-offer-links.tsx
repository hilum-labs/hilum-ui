
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@hilum/ui";

const images = {
  hero: "https://tailwindui.com/img/ecommerce-images/home-page-01-hero-full-width.jpg",
};

const offerRows = [
  {
    name: "Bundle and save",
    description: "Pair a desk lamp, organizer, and storage tray for 15% off.",
  },
  {
    name: "Weekend shipping",
    description: "Free express delivery when your order total reaches $150.",
  },
  {
    name: "Starter setup",
    description: "Build a clean workspace with our most popular essentials.",
  },
  {
    name: "Gift-ready picks",
    description: "Curated accessories with premium wrap included this week.",
  },
];

export default function SplitLayoutWithOfferLinks() {
  const [selectedOffer, setSelectedOffer] = useState(offerRows[0].name);

  return (
    <div className="grid min-h-[340px] w-full overflow-hidden rounded-xl border border-ground-100 bg-white md:grid-cols-[1.05fr_0.95fr]">
      <div className="overflow-hidden md:rounded-l-xl">
        <img src={images.hero} alt="Workspace offer" className="h-full min-h-[340px] w-full object-cover" />
      </div>
      <div className="flex flex-col justify-center p-6 md:p-8">
        <Badge variant="brand" className="w-fit">Offers this week</Badge>
        <h2 className="display mt-5 text-ground-900">Shop by offer</h2>
        <p className="body mt-3 text-ground-500">
          Browse the deals, bundles, and shipping perks driving this week&apos;s merchandising story.
        </p>
        <div className="mt-6 space-y-3">
          {offerRows.map((offer) => {
            const active = selectedOffer === offer.name;
            return (
              <button
                key={offer.name}
                onClick={() => setSelectedOffer(offer.name)}
                className={`flex w-full items-center justify-between rounded-[22px] border px-5 py-4 text-left transition ${
                  active
                    ? "border-brand-primary bg-brand-primary/5"
                    : "border-ground-100 hover:border-ground-200 hover:bg-ground-50"
                }`}
              >
                <div>
                  <p className="body font-semibold text-ground-900">{offer.name}</p>
                  <p className="caption mt-1 max-w-xs text-ground-400">{offer.description}</p>
                </div>
                <span className={`flex items-center gap-1 body ${active ? "text-brand-primary" : "text-ground-500"}`}>
                  Shop
                  <ArrowRight size={16} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
