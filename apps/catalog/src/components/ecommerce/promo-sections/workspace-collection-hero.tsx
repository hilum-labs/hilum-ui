
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const images = {
  hero: "https://tailwindui.com/img/ecommerce-images/home-page-01-hero-full-width.jpg",
};

export default function WorkspaceCollectionHero() {
  return (
    <div className="relative min-h-[360px] w-full overflow-hidden rounded-xl">
      <img src={images.hero} alt="Workspace Collection" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ground-950/80 via-ground-900/45 to-transparent" />
      <div className="relative flex min-h-[360px] items-center px-8 py-16 md:px-12">
        <div className="max-w-xl">
          <Badge variant="secondary" className="bg-white/90 text-ground-700">Limited edition</Badge>
          <h2 className="display mt-5 text-white">Workspace Collection</h2>
          <p className="body mt-3 max-w-lg text-ground-100">
            Refined desk accessories, lighting, and storage designed to make your setup feel intentional.
          </p>
          <div className="mt-6 flex gap-3">
            <Button>Shop collection</Button>
            <Button variant="outline" className="border-transparent bg-white/10 text-white ring-1 ring-inset ring-white/[0.035] hover:bg-white/20">
              Explore lookbook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
