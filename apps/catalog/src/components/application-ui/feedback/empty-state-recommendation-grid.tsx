import { BarChart2, Users, FileText, LayoutDashboard } from "lucide-react";
import { Button } from "@hilum/ui";

const cards = [
  {
    icon: BarChart2,
    title: "Analytics",
    description: "Connect web and product analytics to measure engagement, funnels, and retention.",
  },
  {
    icon: Users,
    title: "CRM",
    description: "Bring in accounts, contacts, and lifecycle stages from your sales systems.",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Index docs, meeting notes, and policies so teams can reference them in context.",
  },
  {
    icon: LayoutDashboard,
    title: "Integrations",
    description: "Connect third-party tools and automate the data handoff between systems.",
  },
] as const;

export default function EmptyStateRecommendationGrid() {
  return (
    <div className="w-full bg-white px-6 py-10">
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div key={card.title} className="rounded-xl border border-ground-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
                <card.icon size={18} className="text-brand-primary" />
              </div>
              <h3 className="heading text-ground-900">{card.title}</h3>
            </div>
            <p className="body mt-2 text-ground-600">{card.description}</p>
            <Button size="sm" variant="outline" className="mt-4">
              Connect
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
