import { AlertTriangle } from "lucide-react";

export default function AlertAccentBorder() {
  return (
    <div className="w-full bg-white p-6">
      <div className="rounded-r-lg border-l-4 border-brand-primary bg-brand-primary/5 p-4 pl-4 flex gap-3">
        <AlertTriangle size={18} className="mt-0.5 text-brand-primary" />
        <div>
          <p className="body font-semibold text-ground-900">High memory usage</p>
          <p className="body mt-1 text-ground-700">
            Worker nodes in the production cluster are approaching their memory limit. Review the
            latest process logs before peak traffic begins.
          </p>
        </div>
      </div>
    </div>
  );
}
