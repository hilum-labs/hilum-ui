
import { Quote } from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const images = {
  main: "https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-01.jpg",
};

export default function BackgroundImageWithTestimonial() {
  return (
    <div className="relative min-h-[330px] w-full overflow-hidden rounded-xl">
      <img src={images.main} alt="Customer favorite bags" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-taupe-950/90 via-taupe-900/65 to-taupe-900/35" />
      <div className="relative flex min-h-[330px] items-center px-8 py-10 md:px-12">
        <div className="max-w-xl text-white">
          <Badge variant="secondary" className="bg-white/90 text-taupe-700">Customer favorite</Badge>
          <div className="mt-6 flex size-12 items-center justify-center rounded-full bg-white/10 text-brand-secondary">
            <Quote size={22} />
          </div>
          <blockquote className="heading mt-5 text-white">
            This bag is perfect
          </blockquote>
          <p className="body mt-3 max-w-lg text-taupe-100">
            The proportions, the finish, and the interior layout all feel thought through. It looks polished without being too precious.
          </p>
          <p className="caption mt-4 text-taupe-200">Monica</p>
          <div className="mt-6">
            <Button>Shop top-rated picks</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
