
import { useState } from "react";
import { Calendar, FolderKanban, LayoutDashboard, Users } from "lucide-react";

const tabItems = ["Overview", "Team", "Projects", "Calendar"] as const;

export default function TabsUnderlineIcons() {
  const [activeTab, setActiveTab] = useState<(typeof tabItems)[number]>("Overview");
  const tabs = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Team", icon: Users },
    { label: "Projects", icon: FolderKanban },
    { label: "Calendar", icon: Calendar },
  ] as const;

  return (
    <div className="w-full bg-white px-6 py-5">
      <nav className="flex flex-wrap gap-5 border-b border-taupe-200">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActiveTab(tab.label)}
            className={`flex items-center gap-2 border-b-2 pb-2 px-1 text-sm transition-colors ${
              activeTab === tab.label
                ? "border-brand-primary text-brand-primary font-medium"
                : "border-transparent text-taupe-500 hover:text-taupe-700"
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
