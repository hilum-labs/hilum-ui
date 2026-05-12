
import { useState } from "react";
import { X, Megaphone } from "lucide-react";
import { Button } from "@hilum/ui";

export default function BannerFloatingBottom() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-taupe-100 bg-taupe-50 shadow-natural" style={{ height: 240 }}>
      <div className="flex h-full items-center justify-center">
        <p className="body text-taupe-400">Page content</p>
      </div>
      {visible && (
        <div className="absolute inset-x-4 bottom-4 flex flex-col items-center justify-between gap-4 rounded-2xl border border-taupe-200 bg-white px-5 py-4 shadow-elevated sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
              <Megaphone size={15} />
            </div>
            <p className="body text-taupe-700">
              <strong className="font-semibold text-taupe-900">We've just launched v3.</strong>{" "}
              See what's new in the latest release.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button size="sm">See what's new</Button>
            <button
              type="button"
              className="rounded-md p-1 text-taupe-400 hover:text-taupe-700"
              onClick={() => setVisible(false)}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
