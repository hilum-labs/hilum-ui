import { useState } from "react";
import { cn } from "@hilum/ui";

const tabs = ["Overview", "Members", "Settings"] as const;

export default function SectionHeadingWithInlineTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Members");

  return (
    <div className="w-full bg-white p-6">
      <div className="flex items-center justify-between border-b border-taupe-100 pb-3">
        <h2 className="subheading text-taupe-900">Team Members</h2>
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "caption border-b-2 pb-1 transition-colors",
                activeTab === tab
                  ? "border-brand-primary text-taupe-900"
                  : "border-transparent text-taupe-400 hover:text-taupe-700"
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
