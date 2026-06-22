import { Trash2 } from "lucide-react";
import { Button } from "@hilum/ui";

function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-ground-100 bg-white shadow-elevated overflow-hidden">
      {children}
    </div>
  );
}

export default function ModalCenteredWideButtons() {
  return (
    <ModalShell>
      <div className="px-6 py-8 text-center">
        <Trash2 size={40} className="mx-auto text-brand-primary" />
        <h3 className="subheading mt-4 text-ground-900">Delete workspace</h3>
        <p className="body mt-2 text-ground-500">
          This permanently removes files, comments, and member access across the entire workspace.
        </p>
        <div className="mt-6 space-y-3">
          <Button variant="destructive" className="w-full">
            Delete workspace
          </Button>
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
