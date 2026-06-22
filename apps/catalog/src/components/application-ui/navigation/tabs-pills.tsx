import { useState } from "react";

const tabItems = ["Overview", "Team", "Projects", "Calendar"] as const;

export default function TabsPills() {
  const [activeTab, setActiveTab] = useState<(typeof tabItems)[number]>("Overview");

  return (
    <div className="w-full bg-white px-6 py-5">
      <nav className="flex gap-1 rounded-xl bg-ground-50 p-1">
        {tabItems.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "rounded-lg bg-brand-primary/10 px-3 py-1.5 text-sm font-medium text-brand-primary"
                : "rounded-lg px-3 py-1.5 text-sm text-ground-600 hover:text-ground-900"
            }
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
