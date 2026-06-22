import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@hilum/ui";

export default function BannerStickyFooter() {
  const [visible, setVisible] = useState(true);
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-ground-100 bg-white shadow-natural"
      style={{ height: 240 }}
    >
      <div className="flex h-full items-center justify-center">
        <p className="body text-ground-400">Page content</p>
      </div>
      {visible && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-between gap-3 border-t border-ground-100 bg-white px-5 py-3 sm:flex-row">
          <p className="caption text-ground-600">
            We use cookies to improve your experience and analyze site traffic.{" "}
            <a href="#" className="font-medium text-ground-900 underline underline-offset-2">
              Read our policy
            </a>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => setVisible(false)}>
              Decline
            </Button>
            <Button size="sm" onClick={() => setVisible(false)}>
              Accept all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
