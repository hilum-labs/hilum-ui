
import { type ReactNode, useState } from "react";
import { Button } from "@hilum/ui";
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
    <div className={`rounded-2xl border border-taupe-100 bg-taupe-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-taupe-400">{title}</p>
      {children}
    </div>
  );
}

export default function ActionPanels() {
  const [renewalsEnabled, setRenewalsEnabled] = useState<boolean>(true);

  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5">
        <VariantCard title="1. Simple">
          <div className="rounded-lg border border-taupe-200 bg-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="subheading text-taupe-900">Upgrade to Pro</p>
                <p className="caption text-taupe-400">
                  Add advanced permissions, priority support, and custom automation runs.
                </p>
              </div>
              <Button>Upgrade</Button>
            </div>
          </div>
        </VariantCard>

        <VariantCard title="2. With toggle">
          <div className="rounded-lg border border-taupe-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="subheading text-taupe-900">Enable automatic renewals</p>
                <p className="caption text-taupe-400">
                  Keep your plan active and renew invoices without manual approval.
                </p>
              </div>
              <Switch
                checked={renewalsEnabled}
                onCheckedChange={setRenewalsEnabled}
              />
            </div>
          </div>
        </VariantCard>

        <VariantCard title="3. With well">
          <div className="rounded-lg border border-taupe-200 bg-white p-6">
            <div className="mb-4">
              <p className="subheading text-taupe-900">Preview notification</p>
              <p className="caption text-taupe-400">
                See how recipients will experience your message before sending.
              </p>
            </div>
            <div className="rounded-md bg-taupe-50 p-4">
              <p className="body font-medium text-taupe-900">Quarterly planning is live</p>
              <p className="caption mt-1 text-taupe-500">
                Review dependencies, add comments, and confirm staffing before Wednesday.
              </p>
            </div>
            <div className="mt-4">
              <Button variant="outline">Send test email</Button>
            </div>
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
