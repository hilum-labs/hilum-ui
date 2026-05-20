
import { useState } from "react";

const tabItems = ["Overview", "Team", "Projects", "Calendar"] as const;

export default function TabsUnderline() {
  const [activeTab, setActiveTab] = useState<(typeof tabItems)[number]>("Overview");

  return (
    <div className="w-full bg-white px-6 py-5">
      <nav className="flex gap-6 border-b border-ground-200">
        {tabItems.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 pb-2 px-1 text-sm transition-colors ${
              activeTab === tab
                ? "border-brand-primary text-brand-primary font-medium"
                : "border-transparent text-ground-500 hover:text-ground-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}
