
import { Info } from "lucide-react";

export default function AlertWithDescription() {
  return (
    <div className="w-full bg-white p-6">
      <div className="rounded-lg border border-brand-secondary/40 bg-brand-secondary/20 p-4 flex gap-3">
        <Info size={18} className="mt-0.5 text-ground-600" />
        <div>
          <p className="body font-semibold text-ground-900">Scheduled maintenance</p>
          <p className="body mt-1 text-ground-700">
            The platform will be unavailable on Sunday from 2:00 AM to 4:00 AM UTC while we deploy infrastructure
            upgrades.
          </p>
        </div>
      </div>
    </div>
  );
}
