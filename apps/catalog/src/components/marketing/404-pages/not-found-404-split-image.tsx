import { ArrowRight } from "lucide-react";
import { Button } from "@hilum/ui";

export default function NotFound404SplitImage() {
  return (
    <div className="grid min-h-[360px] lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-16">
        <p className="label uppercase tracking-widest text-brand-primary">404 error</p>
        <h1 className="display mt-4 text-taupe-900">Looks like you're lost</h1>
        <p className="body mt-4 text-taupe-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex gap-3">
          <Button>Go back home</Button>
          <Button variant="ghost">
            Contact us <ArrowRight size={14} />
          </Button>
        </div>
      </div>
      <div className="hidden lg:block bg-taupe-100 rounded-r-xl" />
    </div>
  );
}
