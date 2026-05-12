
import { CheckCircle2, X } from "lucide-react";

export default function NotificationCondensed() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-taupe-100 bg-white px-4 py-2 shadow-elevated">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={16} className="text-brand-secondary" />
        <p className="caption flex-1 text-taupe-600">
          Invoice sent to finance
        </p>
        <p className="caption-xs text-taupe-400">now</p>
        <button className="text-taupe-400 hover:text-taupe-700" type="button">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
