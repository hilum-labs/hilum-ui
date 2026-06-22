import { useState } from "react";

const TABS = ["Overview", "Components", "Patterns", "Resources"] as const;

export default function HeaderSimpleWithSelectMenuDark() {
  const [darkTab, setDarkTab] = useState<(typeof TABS)[number]>("Components");

  return (
    <section className="w-full bg-ground-900 px-8 py-16 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <p className="caption text-ground-400">Browse by topic</p>
        <h2 className="display mt-4 text-white">
          A sharper way to explore a growing design system
        </h2>
        <p className="body mt-5 text-ground-300">
          Switch between foundations, components, patterns, and resources without leaving the page.
        </p>
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-ground-800 p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setDarkTab(tab)}
              className={`rounded-full px-4 py-2 body font-medium transition-colors ${
                darkTab === tab
                  ? "bg-brand-secondary text-ground-950"
                  : "text-ground-400 hover:text-white"
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
