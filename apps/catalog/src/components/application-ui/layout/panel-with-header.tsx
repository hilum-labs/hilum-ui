import { MoreHorizontal } from "lucide-react";

export default function PanelWithHeader() {
  return (
    <div className="w-full rounded-xl border border-taupe-100 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-taupe-100 px-6 py-4">
        <h3 className="subheading text-taupe-900">Panel Header</h3>
        <button className="rounded-md p-1 text-taupe-400 hover:bg-taupe-50 hover:text-taupe-700">
          <MoreHorizontal className="size-4" />
        </button>
      </div>
      <div className="px-6 py-4 body text-taupe-500">
        Panel body content goes here. This area can contain any elements.
      </div>
    </div>
  );
}
