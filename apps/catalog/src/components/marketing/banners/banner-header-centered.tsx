
import { useState } from "react";
import { X, ArrowRight } from "lucide-react";

export default function BannerHeaderCentered() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-ground-100 bg-white shadow-natural">
      {visible && (
        <div className="relative isolate flex items-center justify-center gap-x-4 overflow-hidden bg-brand-primary px-6 py-2.5">
          {/* decorative dots */}
          <div
            className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div className="aspect-[577/310] w-[36rem] bg-white/10 opacity-30" />
          </div>
          <p className="body text-white text-center">
            <strong className="font-semibold">Join us at Config 2025</strong>
            <span className="mx-2 text-white/60">·</span>
            Secure your spot for the biggest design conference of the year.
            <a href="#" className="ml-2 inline-flex items-center gap-1 font-semibold text-white underline underline-offset-2">
              Register now <ArrowRight size={12} />
            </a>
          </p>
          <button
            type="button"
            className="absolute right-4 p-1 text-white/70 hover:text-white"
            onClick={() => setVisible(false)}
          >
            <span className="sr-only">Dismiss</span>
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex h-40 items-center justify-center">
        <p className="body text-ground-400">Page content sits below the banner</p>
      </div>
    </div>
  );
}
