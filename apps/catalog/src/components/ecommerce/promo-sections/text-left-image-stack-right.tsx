import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const images = {
  tile1: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg",
  tile2: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg",
  tile3: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-03.jpg",
};

function Tile({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[28px] border border-ground-100 bg-white shadow-natural ${className ?? ""}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

export default function TextLeftImageStackRight() {
  return (
    <div className="grid min-h-[360px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-brand-secondary/40 via-white to-brand-secondary/20 md:grid-cols-[0.95fr_1.05fr]">
      <div className="flex items-center px-8 py-10 md:px-10">
        <div className="max-w-md">
          <Badge variant="brand">Curated desk edit</Badge>
          <h2 className="display mt-5 text-ground-900">Reimagine your workspace</h2>
          <p className="body mt-3 text-ground-500">
            Layer in sculptural lighting, thoughtful storage, and tactile materials that make long
            work sessions feel better.
          </p>
          <div className="mt-6">
            <Button>Shop the setup</Button>
          </div>
        </div>
      </div>
      <div className="relative h-[320px] px-8 py-8">
        <Tile
          src={images.tile1}
          alt="Desk shelf"
          className="absolute left-8 top-10 h-44 w-40 rotate-[-8deg]"
        />
        <Tile
          src={images.tile2}
          alt="Desk lamp"
          className="absolute right-14 top-2 h-56 w-48 rotate-[8deg]"
        />
        <Tile
          src={images.tile3}
          alt="Desk accessories"
          className="absolute right-8 bottom-4 h-40 w-44 rotate-[-4deg]"
        />
      </div>
    </div>
  );
}
