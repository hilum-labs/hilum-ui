import { FileText, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Input } from "@hilum/ui";

export default function CommandPaletteGroups() {
  return (
    <div className="w-full px-6 py-8">
      <div className="mx-auto max-w-lg overflow-hidden rounded-xl border border-ground-200 shadow-lg">
        <div className="relative border-b border-ground-100 bg-white">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ground-400"
          />
          <Input
            type="text"
            placeholder="Jump to..."
            className="h-11 rounded-none border-0 pl-10 pr-4 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="max-h-80 overflow-y-auto bg-white">
          <div className="bg-ground-50 px-4 py-2 label text-ground-400">Projects</div>
          {[
            { name: "Website Redesign", color: "bg-brand-primary" },
            { name: "Mobile App", color: "bg-brand-secondary" },
            { name: "Design System", color: "bg-brand-secondary" },
          ].map((project) => (
            <button
              key={project.name}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-ground-50"
            >
              <span className={`h-2 w-2 rounded-full ${project.color}`} />
              <span className="body text-ground-700">{project.name}</span>
            </button>
          ))}
          <div className="bg-ground-50 px-4 py-2 label text-ground-400">People</div>
          {[
            ["Alice Johnson", "AJ"],
            ["Bob Smith", "BS"],
            ["Carol White", "CW"],
          ].map(([name, initials]) => (
            <button
              key={name}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-ground-50"
            >
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="body text-ground-700">{name}</span>
            </button>
          ))}
          <div className="bg-ground-50 px-4 py-2 label text-ground-400">Documents</div>
          {["Q1 Report.pdf", "Brand Guidelines.pdf"].map((document) => (
            <button
              key={document}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-ground-50"
            >
              <FileText size={16} className="text-ground-500" />
              <span className="body text-ground-700">{document}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
