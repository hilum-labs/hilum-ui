
import { ArrowRight } from "lucide-react";
import { Button } from "@hilum/ui";

const EDITION_ONE = "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg";

function CategoryImage({
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

export default function OverlayPanel() {
  return (
    <section className="w-full overflow-hidden rounded-[32px] bg-taupe-900 lg:grid lg:grid-cols-[1.5fr_1fr]">
      <div className="min-h-[360px]">
        <CategoryImage
          src={EDITION_ONE}
          alt="Travel category"
          className="min-h-[360px]"
        />
      </div>
      <div className="flex flex-col justify-center bg-taupe-900 p-8 text-white sm:p-10">
        <p className="label text-brand-secondary">Featured category</p>
        <h3 className="display mt-3">Travel</h3>
        <p className="body mt-4 text-white/75">
          Packable layers, modular organizers, and smart carry pieces built to stay
          calm while the rest of the day keeps moving.
        </p>
        <div className="mt-6">
          <Button variant="brand" size="sm">
            Shop Travel <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
