import { useState } from "react";

const TABS = ["Overview", "Components", "Patterns", "Resources"] as const;

export default function HeaderSimpleWithSelectMenu() {
  const [lightTab, setLightTab] = useState<(typeof TABS)[number]>("Overview");

  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="caption text-brand-primary">Explore the catalog</p>
        <h2 className="display mt-4 text-ground-900">Patterns for every page state</h2>
        <p className="body mt-5 text-ground-500">
          Filter the examples by section type to jump between foundations, growth patterns, and
          editorial layouts.
        </p>
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-ground-100 p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setLightTab(tab)}
              className={`rounded-full px-4 py-2 body font-medium transition-colors ${
                lightTab === tab
                  ? "bg-brand-primary text-white"
                  : "text-ground-600 hover:text-ground-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
