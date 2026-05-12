
import { ChevronRight, Home } from "lucide-react";

export default function BreadcrumbContained() {
  return (
    <div className="w-full bg-white px-6 py-5">
      <div className="inline-flex items-center gap-2 rounded-md border border-taupe-100 bg-taupe-50 px-4 py-2 text-sm">
        <a href="#" className="flex items-center gap-1.5 text-taupe-500 hover:text-taupe-900">
          <Home size={14} />
          Home
        </a>
        <ChevronRight size={14} className="text-taupe-300" />
        <a href="#" className="text-taupe-500 hover:text-taupe-900">
          Projects
        </a>
        <ChevronRight size={14} className="text-taupe-300" />
        <span className="font-medium text-taupe-900">Website Redesign</span>
      </div>
    </div>
  );
}
