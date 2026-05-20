
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const images = {
  main: "https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-01.jpg",
  tile2: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg",
  tile3: "https://tailwindui.com/img/ecommerce-images/home-page-01-collection-03.jpg",
};

function Tile({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[28px] border border-ground-100 bg-white shadow-natural ${className ?? ""}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

export default function ImageStackLeftTextRight() {
  return (
    <div className="grid min-h-[340px] w-full overflow-hidden rounded-xl bg-ground-50 md:grid-cols-[1fr_0.9fr]">
      <div className="relative h-[320px] px-8 py-8">
        <Tile src={images.tile3} alt="Minimal accessories" className="absolute left-12 top-6 h-48 w-48 rotate-[-6deg]" />
        <Tile src={images.main} alt="Desk organizer" className="absolute left-32 top-20 h-52 w-56 rotate-[5deg]" />
        <Tile src={images.tile2} alt="Desk lighting" className="absolute left-4 bottom-4 h-36 w-40 rotate-[7deg]" />
      </div>
      <div className="flex items-center px-8 py-10 md:px-10">
        <div className="max-w-md">
          <Badge variant="warning">Fresh drop</Badge>
          <h2 className="display mt-5 text-ground-900">Build a setup that feels calm</h2>
          <p className="body mt-3 text-ground-500">
            Mix natural finishes, warm metal accents, and practical storage to bring order to the day.
          </p>
          <div className="mt-6 flex gap-3">
            <Button>Shop all deskside</Button>
            <Button variant="ghost">View details</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
