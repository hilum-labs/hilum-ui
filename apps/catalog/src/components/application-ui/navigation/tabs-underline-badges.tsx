import { useState } from "react";
import { Badge } from "@hilum/ui";

const tabItems = ["Overview", "Team", "Projects", "Calendar"] as const;

export default function TabsUnderlineBadges() {
  const [activeTab, setActiveTab] = useState<(typeof tabItems)[number]>("Overview");
  const counts = { Overview: 12, Team: 4, Projects: 9, Calendar: 3 };

  return (
    <div className="w-full bg-white px-6 py-5">
      <nav className="flex flex-wrap gap-5 border-b border-ground-200">
        {tabItems.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 border-b-2 pb-2 px-1 text-sm transition-colors ${
              activeTab === tab
                ? "border-brand-primary text-brand-primary font-medium"
                : "border-transparent text-ground-500 hover:text-ground-700"
            }`}
          >
            <span>{tab}</span>
            <Badge variant="secondary">{counts[tab]}</Badge>
          </button>
        ))}
      </nav>
    </div>
  );
}
