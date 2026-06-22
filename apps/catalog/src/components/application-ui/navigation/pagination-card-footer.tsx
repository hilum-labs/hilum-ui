import { type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PageNumber({ current = false, children }: { current?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${
        current ? "bg-brand-primary text-white" : "text-ground-700 hover:bg-ground-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function PaginationCardFooter() {
  return (
    <div className="w-full bg-white px-6 py-6">
      <div className="overflow-hidden rounded-xl border border-ground-100">
        <div className="divide-y divide-ground-100 bg-white">
          {["April campaign review", "User interviews", "Roadmap sync"].map((row) => (
            <div key={row} className="px-4 py-3 body text-ground-600">
              {row}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-ground-100 px-4 py-3">
          <span className="body text-ground-500">Showing 1 to 10 of 97 results</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-ground-700 transition-colors hover:bg-ground-50"
            >
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <PageNumber key={page} current={page === 3}>
                {page}
              </PageNumber>
            ))}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-ground-700 transition-colors hover:bg-ground-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
