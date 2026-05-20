
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@hilum/ui";

function ExampleFrame({ children }: { children: any }) {
  return (
    <div className="min-h-[600px] overflow-hidden rounded-xl border border-ground-100 bg-white">
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  detail,
  enabled,
  onToggle,
}: {
  label: string;
  detail: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="body font-medium text-ground-900">{label}</p>
        <p className="caption mt-1 text-ground-400">{detail}</p>
      </div>
      <button
        type="button"
        aria-pressed={enabled}
        onClick={onToggle}
        className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
          enabled ? "bg-brand-primary" : "bg-ground-200"
        }`}
      >
        <span
          className={`size-5 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function CenteredSettingsScreen() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  return (
    <ExampleFrame>
      <div className="min-h-[600px] bg-ground-50 px-6 py-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="caption mb-3 flex items-center gap-1.5 text-ground-400">
            <span>Design System</span>
            <span>/</span>
            <span>Application UI</span>
            <span>/</span>
            <span className="text-ground-900">Account Settings</span>
          </div>
          <h3 className="heading text-ground-900">Account Settings</h3>
          <p className="caption mt-1 text-ground-400">A centered settings form with clear section separation.</p>

          <div className="mt-6 rounded-2xl border border-ground-100 bg-white p-6">
            <div className="border-b border-ground-100 pb-6">
              <p className="subheading text-ground-900">Personal Info</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label text-ground-400">First name</label>
                  <input
                    type="text"
                    defaultValue="Tom"
                    className="mt-2 h-10 w-full rounded-xl border border-ground-200 bg-white px-3 body text-ground-900 outline-none"
                  />
                </div>
                <div>
                  <label className="label text-ground-400">Last name</label>
                  <input
                    type="text"
                    defaultValue="Cook"
                    className="mt-2 h-10 w-full rounded-xl border border-ground-200 bg-white px-3 body text-ground-900 outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label text-ground-400">Email</label>
                  <input
                    type="email"
                    defaultValue="tom@example.com"
                    className="mt-2 h-10 w-full rounded-xl border border-ground-200 bg-white px-3 body text-ground-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-ground-100 py-6">
              <p className="subheading text-ground-900">Notifications</p>
              <div className="mt-4 space-y-4">
                <ToggleRow
                  label="Email updates"
                  detail="Receive a summary when key projects change state."
                  enabled={notifications.email}
                  onToggle={() =>
                    setNotifications((current) => ({ ...current, email: !current.email }))
                  }
                />
                <ToggleRow
                  label="Push alerts"
                  detail="Get urgent updates for blockers and approvals."
                  enabled={notifications.push}
                  onToggle={() =>
                    setNotifications((current) => ({ ...current, push: !current.push }))
                  }
                />
                <ToggleRow
                  label="Weekly digest"
                  detail="A Friday summary of project performance and team activity."
                  enabled={notifications.weekly}
                  onToggle={() =>
                    setNotifications((current) => ({ ...current, weekly: !current.weekly }))
                  }
                />
              </div>
            </div>

            <div className="pt-6">
              <p className="subheading text-ground-900">Danger Zone</p>
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="body font-medium text-red-700">Delete account</p>
                    <p className="caption mt-1 text-red-600">
                      Permanently remove your workspace profile and personal preferences.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="size-4" />
                    Delete account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExampleFrame>
  );
}
