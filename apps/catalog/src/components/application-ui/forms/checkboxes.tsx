import { type ReactNode, useState } from "react";
import { Checkbox } from "@hilum/ui";

type ToggleKey = "comments" | "candidates" | "offers";
type PreferenceKey = "newsletter" | "summary" | "alerts";

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

export default function Checkboxes() {
  const [notifications, setNotifications] = useState<Record<ToggleKey, boolean>>({
    comments: true,
    candidates: false,
    offers: true,
  });
  const [preferences, setPreferences] = useState<Record<PreferenceKey, boolean>>({
    newsletter: true,
    summary: false,
    alerts: true,
  });

  const toggleNotification = (key: ToggleKey) => {
    setNotifications((current) => ({ ...current, [key]: !current[key] }));
  };

  const togglePreference = (key: PreferenceKey) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5 lg:grid-cols-2">
        <VariantCard title="1. Simple list with heading">
          <div className="space-y-4">
            <div>
              <h3 className="subheading text-ground-900">Notifications</h3>
              <p className="caption text-ground-400">
                Choose which updates should arrive in your inbox.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { key: "comments" as const, label: "Comments" },
                { key: "candidates" as const, label: "Candidates" },
                { key: "offers" as const, label: "Offers" },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-3">
                  <Checkbox
                    checked={notifications[item.key]}
                    onCheckedChange={() => toggleNotification(item.key)}
                  />
                  <span className="body text-ground-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </VariantCard>

        <VariantCard title="2. List with description">
          <div className="space-y-4">
            {[
              {
                key: "newsletter" as const,
                title: "Weekly newsletter",
                description: "A curated digest of new components and shipping updates.",
              },
              {
                key: "summary" as const,
                title: "Monthly summary",
                description:
                  "A concise overview of performance, adoption, and contributor activity.",
              },
              {
                key: "alerts" as const,
                title: "Incident alerts",
                description: "High-priority operational events that require immediate follow-up.",
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start gap-3 rounded-xl border border-ground-100 bg-white p-3"
              >
                <Checkbox
                  checked={preferences[item.key]}
                  onCheckedChange={() => togglePreference(item.key)}
                  className="mt-1"
                />
                <div>
                  <p className="body font-medium text-ground-900">{item.title}</p>
                  <p className="caption text-ground-400">{item.description}</p>
                </div>
              </label>
            ))}
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
