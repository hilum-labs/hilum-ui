import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@hilum/ui";

export default function EmptyStateSimple() {
  return (
    <div className="w-full bg-white px-6 py-10">
      <div className="px-6 py-12 text-center">
        <FolderOpen size={48} className="mx-auto mb-4 text-ground-300" />
        <h3 className="heading mb-2 text-ground-900">No projects yet</h3>
        <p className="body mx-auto mb-6 max-w-sm text-ground-500">
          Get started by creating your first project.
        </p>
        <Button variant="brand" size="sm">
          <Plus size={16} />
          New Project
        </Button>
      </div>
    </div>
  );
}
