import { Plus } from "lucide-react";

export default function SectionHeadingWithAction() {
  return (
    <div className="w-full bg-white p-6">
      <div className="flex items-center justify-between border-b border-ground-100 pb-4">
        <h2 className="subheading text-ground-900">Team Members</h2>
        <button className="caption flex items-center gap-1 text-brand-primary hover:underline">
          <Plus className="size-3" />
          Add member
        </button>
      </div>
    </div>
  );
}
