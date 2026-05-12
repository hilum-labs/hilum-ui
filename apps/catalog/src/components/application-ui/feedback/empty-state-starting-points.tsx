
import { ArrowRight, LayoutDashboard, FileText, Upload } from "lucide-react";

const rows = [
  {
    icon: LayoutDashboard,
    title: "Start from scratch",
    description: "Build a custom dashboard",
  },
  {
    icon: FileText,
    title: "Use a template",
    description: "Choose from 50+ templates",
  },
  {
    icon: Upload,
    title: "Import data",
    description: "Connect an existing data source",
  },
] as const;

export default function EmptyStateStartingPoints() {
  return (
    <div className="w-full bg-white px-6 py-10">
      <div className="mx-auto max-w-md py-8 text-center">
        <h3 className="heading text-taupe-900">How do you want to start?</h3>
        <p className="body mt-2 mb-8 text-taupe-500">
          Pick a path below and we&apos;ll tailor the setup flow to your workflow.
        </p>
        <div className="overflow-hidden rounded-xl border border-taupe-100 divide-y divide-taupe-100">
          {rows.map((row) => (
            <button
              key={row.title}
              type="button"
              className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-taupe-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-taupe-100">
                <row.icon size={18} className="text-taupe-600" />
              </div>
              <div className="flex-1">
                <h4 className="body font-semibold text-taupe-900">{row.title}</h4>
                <p className="caption text-taupe-500">{row.description}</p>
              </div>
              <ArrowRight size={16} className="text-taupe-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
