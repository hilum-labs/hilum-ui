import { useState } from "react";
import { X } from "lucide-react";

export default function BannerHeader() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-ground-100 bg-white shadow-natural">
      {visible && (
        <div className="flex items-center justify-between gap-x-6 bg-ground-900 px-6 py-2.5">
          <p className="body text-white">
            <strong className="font-semibold">New version out</strong>
            <span className="mx-2 text-ground-400">·</span>
            Version 2.0 ships with a redesigned dashboard and 3× faster rendering.{" "}
            <a href="#" className="font-semibold text-brand-secondary underline underline-offset-2">
              Read the changelog →
            </a>
          </p>
          <button
            type="button"
            className="-m-1.5 flex-none p-1.5 text-ground-400 hover:text-white"
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
