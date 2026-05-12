
import { X } from "lucide-react";

function ToastShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-taupe-100 bg-white p-4 shadow-elevated">
      {children}
    </div>
  );
}

export default function NotificationSimple() {
  return (
    <ToastShell>
      <div className="relative pr-8">
        <button className="absolute right-0 top-0 text-taupe-400 hover:text-taupe-700" type="button">
          <X size={16} />
        </button>
        <p className="subheading text-taupe-900">Changes saved</p>
        <p className="body mt-1 text-taupe-500">
          Your dashboard filters were updated and synced across your team workspace.
        </p>
      </div>
    </ToastShell>
  );
}
