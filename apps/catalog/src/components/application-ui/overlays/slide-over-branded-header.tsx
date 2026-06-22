import { X } from "lucide-react";

function SlideOverFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[400px] overflow-hidden rounded-xl border border-ground-100">
      <div className="flex flex-1 items-center justify-center bg-ground-50 p-8 body text-ground-400">
        Main page content preview
      </div>
      {children}
    </div>
  );
}

export default function SlideOverBrandedHeader() {
  return (
    <SlideOverFrame>
      <div className="flex w-96 flex-col bg-white border-l border-ground-100">
        <div className="flex items-start justify-between bg-brand-primary px-6 py-6 text-white">
          <div>
            <h2 className="subheading text-white">Launch checklist</h2>
            <p className="body mt-2 text-white/80">
              Final review items for the homepage release scheduled this afternoon.
            </p>
          </div>
          <button type="button" className="text-white">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 px-6 py-6">
          <div className="rounded-xl border border-ground-100 bg-ground-50 p-4">
            <p className="caption font-semibold text-ground-900">In progress</p>
            <ul className="mt-3 space-y-3 body text-ground-500">
              <li>Confirm QA sign-off across desktop and tablet breakpoints.</li>
              <li>Publish updated legal copy in the checkout footer.</li>
              <li>Schedule a rollback window with support coverage.</li>
            </ul>
          </div>
        </div>
      </div>
    </SlideOverFrame>
  );
}
