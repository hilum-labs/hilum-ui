
import { XCircle } from "lucide-react";
import { Button } from "@hilum/ui";

export default function AlertWithActions() {
  return (
    <div className="w-full bg-white p-6">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
        <XCircle size={18} className="mt-0.5 text-red-500" />
        <div>
          <p className="body font-semibold text-red-900">Deployment failed</p>
          <p className="caption mt-1 text-red-700">
            The latest release could not be completed because the build pipeline timed out during asset compilation.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="destructive">
              View logs
            </Button>
            <Button size="sm" variant="ghost">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
