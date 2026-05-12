
import { X } from "lucide-react";

function SlideOverFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[400px] overflow-hidden rounded-xl border border-taupe-100">
      <div className="flex flex-1 items-center justify-center bg-taupe-50 p-8 body text-taupe-400">
        Main page content preview
      </div>
      {children}
    </div>
  );
}

export default function SlideOverEmpty() {
  return (
    <SlideOverFrame>
      <div className="flex w-96 flex-col bg-white border-l border-taupe-100">
        <div className="flex items-center justify-between border-b border-taupe-100 px-6 py-4">
          <h2 className="subheading text-taupe-900">Recent activity</h2>
          <button type="button">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10 text-center">
          <div>
            <p className="subheading text-taupe-900">Nothing here yet</p>
            <p className="body mt-2 text-taupe-400">
              New comments, edits, and status changes will appear here as your team works.
            </p>
          </div>
        </div>
      </div>
    </SlideOverFrame>
  );
}
