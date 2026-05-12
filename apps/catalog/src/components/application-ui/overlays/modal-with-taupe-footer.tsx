
import { Button } from "@hilum/ui";

function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-taupe-100 bg-white shadow-elevated overflow-hidden">
      {children}
    </div>
  );
}

export default function ModalWithTaupeFooter() {
  return (
    <ModalShell>
      <div className="p-6">
        <h3 className="subheading text-taupe-900">Move selected files?</h3>
        <p className="body mt-3 text-taupe-500">
          These files will be transferred into the archive folder and hidden from the active release queue.
        </p>
      </div>
      <div className="flex justify-end gap-3 border-t border-taupe-100 bg-taupe-50 px-6 py-4">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </div>
    </ModalShell>
  );
}
