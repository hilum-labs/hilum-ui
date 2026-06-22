import { type ReactNode, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@hilum/ui";

function VariantCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-ground-100 bg-ground-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-ground-400">{title}</p>
      {children}
    </div>
  );
}

export default function Toggles() {
  const [emailUpdates, setEmailUpdates] = useState<boolean>(true);
  const [autoRenew, setAutoRenew] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5 lg:grid-cols-3">
        <VariantCard title="1. Simple toggle">
          <label className="flex items-center gap-3">
            <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
            <span className="body text-ground-700">Email updates</span>
          </label>
        </VariantCard>

        <VariantCard title="2. With left label and description">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="body font-medium text-ground-900">Enable automatic renewals</p>
              <p className="caption text-ground-400">
                Renew annual plans before they expire and avoid service interruption.
              </p>
            </div>
            <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
          </div>
        </VariantCard>

        <VariantCard title="3. Toggle with icon">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full p-2 ${
                  darkMode ? "bg-ground-900 text-white" : "bg-brand-secondary/70 text-ground-800"
                }`}
              >
                {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              </span>
              <div>
                <p className="body font-medium text-ground-900">
                  {darkMode ? "Night mode" : "Day mode"}
                </p>
                <p className="caption text-ground-400">
                  Switch the editor appearance for focused work.
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
