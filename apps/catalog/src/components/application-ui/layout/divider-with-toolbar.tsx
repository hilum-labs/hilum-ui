import { useState } from "react";
import { ArrowUpDown, Filter, Grid3x3 } from "lucide-react";
import { cn } from "@hilum/ui";

export default function DividerWithToolbar() {
  const [activeTool, setActiveTool] = useState<"filter" | "sort" | "grid">("grid");

  return (
    <div className="w-full bg-white p-6">
      <div className="body pb-2 text-taupe-500">Results</div>
      <div className="flex items-center justify-between border-b border-taupe-100 py-2">
        <span className="caption text-taupe-500">24 items</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTool("filter")}
            className={cn(
              "rounded p-1 transition-colors",
              activeTool === "filter"
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-taupe-500 hover:bg-taupe-50"
            )}
          >
            <Filter className="size-3.5" />
          </button>
          <button
            onClick={() => setActiveTool("sort")}
            className={cn(
              "rounded p-1 transition-colors",
              activeTool === "sort"
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-taupe-500 hover:bg-taupe-50"
            )}
          >
            <ArrowUpDown className="size-3.5" />
          </button>
          <button
            onClick={() => setActiveTool("grid")}
            className={cn(
              "rounded p-1 transition-colors",
              activeTool === "grid"
                ? "bg-brand-primary/10 text-brand-primary"
                : "text-taupe-500 hover:bg-taupe-50"
            )}
          >
            <Grid3x3 className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="body pt-2 text-taupe-500">Filtered content</div>
    </div>
  );
}
