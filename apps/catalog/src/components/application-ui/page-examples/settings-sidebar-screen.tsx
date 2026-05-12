
import { useState } from "react";
import { ChevronRight, CreditCard } from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const SETTINGS_SECTIONS = ["Account", "Password", "Notifications", "Billing", "Integrations"];

function ExampleFrame({ children }: { children: any }) {
  return (
    <div className="min-h-[600px] overflow-hidden rounded-xl border border-taupe-100 bg-white">
      {children}
    </div>
  );
}

export default function SettingsSidebarScreen() {
  const [activeSection, setActiveSection] = useState("Account");

  return (
    <ExampleFrame>
      <div className="grid min-h-[600px] lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-taupe-100 bg-white p-5 lg:border-b-0 lg:border-r">
          <p className="label mb-4 text-taupe-400">Settings</p>
          <div className="space-y-2">
            {SETTINGS_SECTIONS.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left body transition-colors ${
                  activeSection === section
                    ? "bg-brand-primary/10 text-brand-primary font-medium"
                    : "text-taupe-600 hover:bg-taupe-50 hover:text-taupe-900"
                }`}
              >
                {section}
                <ChevronRight className="size-4" />
              </button>
            ))}
          </div>
        </aside>

        <main className="bg-taupe-50 p-6">
          <div className="rounded-2xl border border-taupe-100 bg-white p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="caption text-taupe-400">Settings / {activeSection}</p>
                <h3 className="heading mt-1 text-taupe-900">
                  {activeSection === "Account" ? "Profile" : activeSection}
                </h3>
              </div>
              <Button size="sm">Save changes</Button>
            </div>

            {activeSection === "Account" && (
              <div className="space-y-6">
                {[
                  {
                    label: "Name",
                    field: (
                      <input
                        type="text"
                        defaultValue="Tom Cook"
                        className="h-10 w-full rounded-xl border border-taupe-200 bg-white px-3 body text-taupe-900 outline-none"
                      />
                    ),
                  },
                  {
                    label: "Email",
                    field: (
                      <input
                        type="email"
                        defaultValue="tom@example.com"
                        className="h-10 w-full rounded-xl border border-taupe-200 bg-white px-3 body text-taupe-900 outline-none"
                      />
                    ),
                  },
                  {
                    label: "Photo",
                    field: (
                      <div className="flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-full bg-brand-primary text-white">
                          <span className="heading">TC</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>
                    ),
                  },
                  {
                    label: "Bio",
                    field: (
                      <textarea
                        defaultValue="Product leader focused on customer onboarding, internal tooling, and team operations."
                        className="min-h-28 w-full rounded-xl border border-taupe-200 bg-white px-3 py-2 body text-taupe-900 outline-none"
                      />
                    ),
                  },
                ].map((row) => (
                  <div key={row.label} className="grid gap-3 border-b border-taupe-100 pb-6 last:border-b-0 last:pb-0 md:grid-cols-[160px_1fr]">
                    <div>
                      <p className="body font-medium text-taupe-900">{row.label}</p>
                    </div>
                    <div>{row.field}</div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "Password" && (
              <div className="space-y-6">
                {["Current password", "New password", "Confirm password"].map((label) => (
                  <div key={label} className="grid gap-3 border-b border-taupe-100 pb-6 last:border-b-0 last:pb-0 md:grid-cols-[160px_1fr]">
                    <p className="body font-medium text-taupe-900">{label}</p>
                    <input
                      type="password"
                      defaultValue="password"
                      className="h-10 w-full rounded-xl border border-taupe-200 bg-white px-3 body text-taupe-900 outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSection === "Notifications" && (
              <div className="space-y-4">
                {[
                  "Daily summary emails",
                  "Comment mentions",
                  "Project reminder alerts",
                ].map((label) => (
                  <div key={label} className="grid gap-3 border-b border-taupe-100 pb-6 last:border-b-0 last:pb-0 md:grid-cols-[160px_1fr]">
                    <p className="body font-medium text-taupe-900">{label}</p>
                    <div className="rounded-xl bg-taupe-50 px-4 py-3 body text-taupe-600">Enabled for your account</div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "Billing" && (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[160px_1fr]">
                  <p className="body font-medium text-taupe-900">Plan</p>
                  <div className="rounded-xl bg-taupe-50 px-4 py-3 body text-taupe-900">Growth plan · billed monthly</div>
                </div>
                <div className="grid gap-3 md:grid-cols-[160px_1fr]">
                  <p className="body font-medium text-taupe-900">Payment method</p>
                  <div className="flex items-center gap-3 rounded-xl bg-taupe-50 px-4 py-3">
                    <CreditCard className="size-4 text-taupe-500" />
                    <span className="body text-taupe-900">Visa ending in 4242</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "Integrations" && (
              <div className="space-y-3">
                {["Slack workspace", "Google Calendar", "Analytics export"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl bg-taupe-50 px-4 py-4">
                    <div>
                      <p className="body font-medium text-taupe-900">{item}</p>
                      <p className="caption text-taupe-400">Connected and syncing successfully</p>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ExampleFrame>
  );
}
