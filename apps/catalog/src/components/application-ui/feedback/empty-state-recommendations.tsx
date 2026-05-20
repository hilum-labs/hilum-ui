
import { BarChart2, Users, FileText } from "lucide-react";

const cards = [
  {
    icon: BarChart2,
    title: "Analytics",
    description: "Connect to Google Analytics or Mixpanel",
  },
  {
    icon: Users,
    title: "CRM",
    description: "Sync contacts from Salesforce or HubSpot",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Import from Notion or Confluence",
  },
] as const;

export default function EmptyStateRecommendations() {
  return (
    <div className="w-full bg-white px-6 py-10">
      <div>
        <h3 className="heading text-ground-900">No data sources connected</h3>
        <p className="body mt-2 text-ground-500">
          Connect your first source to start populating dashboards, reports, and team workspaces.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="cursor-pointer rounded-xl border border-ground-100 p-5 transition-colors hover:border-ground-200"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
                <card.icon size={18} className="text-brand-primary" />
              </div>
              <h4 className="body font-semibold text-ground-900">{card.title}</h4>
              <p className="caption mt-1 text-ground-500">{card.description}</p>
              <a href="#" className="mt-3 inline-block caption text-brand-primary hover:underline">
                Get started →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
