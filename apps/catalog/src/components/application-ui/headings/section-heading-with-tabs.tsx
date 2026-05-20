import { useState } from "react";
import { cn } from "@hilum/ui";

const tabs = ["Overview", "Members", "Settings"] as const;

export default function SectionHeadingWithTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Members");

  return (
    <div className="w-full bg-white p-6">
      <div>
        <div className="border-b border-ground-100 pb-4">
          <h2 className="subheading text-ground-900">Team Members</h2>
        </div>
        <div className="mt-3 flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "caption border-b-2 pb-2 transition-colors",
                activeTab === tab
                  ? "border-brand-primary text-ground-900"
                  : "border-transparent text-ground-400 hover:text-ground-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
