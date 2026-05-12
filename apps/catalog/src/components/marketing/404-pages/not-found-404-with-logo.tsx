import { ArrowRight } from "lucide-react";

export default function NotFound404WithLogo() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center bg-white px-6 py-16 text-center">
      <div className="mb-8 flex size-10 items-center justify-center rounded-xl bg-brand-primary">
        <span className="body font-bold text-white">D</span>
      </div>
      <p className="label uppercase tracking-widest text-brand-primary">404 error</p>
      <h1 className="display mt-4 text-taupe-900">Page not found</h1>
      <p className="body mt-4 max-w-sm text-taupe-500">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <div className="mt-8">
        <a href="#" className="body font-semibold text-brand-primary hover:text-brand-primary/80">
          Go back home <ArrowRight size={14} className="inline" />
        </a>
      </div>
    </div>
  );
}
