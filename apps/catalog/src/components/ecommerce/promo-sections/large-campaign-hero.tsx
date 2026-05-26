
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const images = {
  hero: "https://tailwindui.com/img/ecommerce-images/home-page-01-hero-full-width.jpg",
};

export default function LargeCampaignHero() {
  return (
    <div className="relative min-h-[390px] w-full overflow-hidden rounded-xl">
      <img src={images.hero} alt="Large workspace campaign" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ground-950/80 via-ground-900/45 to-ground-900/20" />
      <div className="relative flex min-h-[390px] flex-col items-center justify-center px-8 text-center">
        <Badge variant="secondary" className="bg-white/85 text-ground-700">Seasonal feature</Badge>
        <h2 className="display mt-5 max-w-3xl text-white">Set the tone for your best work</h2>
        <p className="body mt-4 max-w-2xl text-ground-100">
          Discover warm lighting, refined desk tools, and modular storage that transform a spare surface into a focused studio.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button>Shop now</Button>
          <Button variant="outline" className="border-transparent bg-white/10 text-white ring-1 ring-inset ring-white/[0.035] hover:bg-white/20">
            Browse categories
          </Button>
        </div>
      </div>
    </div>
  );
}
