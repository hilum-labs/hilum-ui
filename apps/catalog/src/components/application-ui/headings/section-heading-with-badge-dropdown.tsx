import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@hilum/ui";

export default function SectionHeadingWithBadgeDropdown() {
  return (
    <div className="w-full bg-white p-6">
      <div className="flex items-center justify-between border-b border-taupe-100 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="subheading text-taupe-900">Team Members</h2>
          <Badge>New</Badge>
        </div>
        <button className="body flex items-center gap-1 text-taupe-400 hover:text-taupe-700">
          <MoreHorizontal className="size-4" />
          <ChevronDown className="size-3" />
        </button>
      </div>
    </div>
  );
}
