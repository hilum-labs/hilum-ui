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

export default function PaginationCentered() {
  return (
    <div className="w-full bg-white px-6 py-6">
      <nav className="flex items-center justify-center gap-1">
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
        <span className="px-1 text-ground-400">…</span>
        {[8, 9, 10].map((page) => (
          <PageNumber key={page}>{page}</PageNumber>
        ))}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-ground-700 transition-colors hover:bg-ground-50"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
