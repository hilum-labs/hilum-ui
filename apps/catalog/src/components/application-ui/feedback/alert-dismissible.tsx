
import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function AlertDismissible() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="w-full bg-white p-6">
      <div className="rounded-lg border border-brand-secondary/30 bg-brand-secondary/15 p-4">
        <div className="flex gap-3">
          <CheckCircle2 size={18} className="mt-0.5 text-taupe-700" />
          <div className="flex-1">
            <p className="body font-semibold text-taupe-900">Changes published</p>
            <p className="body mt-1 text-taupe-700">
              Your design token updates are live and synced across the web app, docs site, and Figma library.
            </p>
          </div>
          <button
            type="button"
            className="ml-auto text-taupe-400 transition-colors hover:text-taupe-600"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
