
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const images = {
  main: "https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-01.jpg",
};

export default function BackgroundImageHero() {
  return (
    <div className="relative min-h-[320px] w-full overflow-hidden rounded-xl">
      <img src={images.main} alt="Workspace accessories" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-taupe-900/60" />
      <div className="relative flex min-h-[320px] flex-col items-center justify-center px-8 text-center">
        <Badge variant="warning">New arrivals</Badge>
        <h2 className="display mt-5 max-w-lg text-white">Level up your desk</h2>
        <p className="body mt-3 max-w-md text-taupe-100">
          Warm materials, quiet colors, and smart accessories built for everyday focus.
        </p>
        <div className="mt-6">
          <Button>Shop Workspace</Button>
        </div>
      </div>
    </div>
  );
}
