
import { Clock, FileText, Search, Terminal } from "lucide-react";
import { Input } from "@hilum/ui";

export default function CommandPaletteSimple() {
  return (
    <div className="w-full px-6 py-8">
      <div className="mx-auto max-w-lg overflow-hidden rounded-xl border border-taupe-200 shadow-lg">
        <div className="relative border-b border-taupe-100 bg-white">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-taupe-400" />
          <Input
            type="text"
            placeholder="Search commands..."
            className="h-11 rounded-none border-0 pl-10 pr-4 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="max-h-80 overflow-y-auto bg-white">
          <div className="bg-taupe-50 px-4 py-2 label text-taupe-400">Recent searches</div>
          {["Design tokens", "Component library", "Typography scale"].map((item) => (
            <button
              key={item}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-taupe-50"
            >
              <Clock size={16} className="text-taupe-400" />
              <span className="body text-taupe-700">{item}</span>
            </button>
          ))}
          <div className="bg-taupe-50 px-4 py-2 label text-taupe-400">Quick actions</div>
          <button type="button" className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-taupe-50">
            <FileText size={16} className="text-taupe-500" />
            <span className="body text-taupe-700">New File</span>
            <span className="ml-auto rounded bg-taupe-100 px-1.5 py-0.5 font-mono text-xs text-taupe-500">
              ⌘N
            </span>
          </button>
          <button type="button" className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-taupe-50">
            <Terminal size={16} className="text-taupe-500" />
            <span className="body text-taupe-700">Open Terminal</span>
            <span className="ml-auto rounded bg-taupe-100 px-1.5 py-0.5 font-mono text-xs text-taupe-500">
              ⌘K
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
