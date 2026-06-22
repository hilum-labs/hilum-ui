import { Reply, Trash2 } from "lucide-react";

function ToastShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-ground-100 bg-white p-4 shadow-elevated">
      {children}
    </div>
  );
}

export default function NotificationWithSplitButtons() {
  return (
    <ToastShell>
      <div className="flex items-stretch gap-4">
        <div className="min-w-0 flex-1">
          <p className="subheading text-ground-900">Review request</p>
          <p className="body mt-1 text-ground-500">
            Tom Cook requested sign-off on the new navigation copy before 3 PM.
          </p>
        </div>
        <div className="w-px bg-ground-100" />
        <div className="flex flex-col justify-center gap-3">
          <button
            className="flex min-h-10 items-center gap-2 caption font-medium text-brand-primary"
            type="button"
          >
            <Reply size={14} />
            Reply
          </button>
          <button
            className="flex min-h-10 items-center gap-2 caption font-medium text-ground-500"
            type="button"
          >
            <Trash2 size={14} />
            Clear
          </button>
        </div>
      </div>
    </ToastShell>
  );
}
