
import { LayoutDashboard, FileText, BarChart2, Users } from "lucide-react";

const templates = [
  {
    color: "bg-brand-primary",
    icon: LayoutDashboard,
    title: "Analytics Dashboard",
    description: "KPIs and metrics",
  },
  {
    color: "bg-brand-secondary",
    icon: FileText,
    title: "Project Tracker",
    description: "Tasks and milestones",
  },
  {
    color: "bg-brand-secondary",
    icon: BarChart2,
    title: "Sales Report",
    description: "Revenue and pipeline",
  },
  {
    color: "bg-ground-800",
    icon: Users,
    title: "Team Directory",
    description: "People and roles",
  },
] as const;

export default function EmptyStateTemplates() {
  return (
    <div className="w-full bg-white px-6 py-10">
      <div>
        <div className="mb-6">
          <h3 className="subheading mb-2 text-ground-900">Start from a template</h3>
          <p className="body text-ground-500">Choose a starting point and customize it to fit your team.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {templates.map((template) => (
            <div
              key={template.title}
              className="cursor-pointer overflow-hidden rounded-xl border border-ground-100 transition-colors hover:border-ground-200"
            >
              <div className={`h-2 ${template.color}`} />
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <template.icon size={16} className="text-ground-500" />
                  <h4 className="caption font-semibold text-ground-900">{template.title}</h4>
                </div>
                <p className="caption text-ground-500">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
