
import { AlertTriangle } from "lucide-react";

export default function AlertWithList() {
  return (
    <div className="w-full bg-white p-6">
      <div className="rounded-lg border border-taupe-200 bg-taupe-50 p-4 flex gap-3">
        <AlertTriangle size={18} className="mt-0.5 text-taupe-500" />
        <div>
          <p className="body font-semibold text-taupe-900">Please fix the following errors</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 caption text-taupe-700">
            <li>Email address is required</li>
            <li>Password must be at least 8 characters</li>
            <li>Please accept the terms of service</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
