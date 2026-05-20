
import { Info } from "lucide-react";

export default function AlertWithLink() {
  return (
    <div className="w-full bg-white p-6">
      <div className="rounded-lg border border-brand-secondary/40 bg-brand-secondary/20 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-ground-600" />
          <span className="body text-ground-800">Your trial ends in 7 days</span>
        </div>
        <a href="#" className="body font-medium text-brand-primary hover:underline">
          Upgrade now →
        </a>
      </div>
    </div>
  );
}
