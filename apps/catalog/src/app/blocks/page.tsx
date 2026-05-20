import { Link } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

type BlockEntry = {
  name: string;
  slug: string;
  description: string;
  category: string;
};

const BLOCKS: BlockEntry[] = [
  {
    name: "Sign In",
    slug: "sign-in",
    description: "A centered authentication card with email, password, and OAuth provider buttons.",
    category: "Auth",
  },
  {
    name: "Navbar",
    slug: "navbar",
    description: "A top navigation bar with logo, nav links, and a user profile menu.",
    category: "Navigation",
  },
  {
    name: "Form Layout",
    slug: "form-layout",
    description: "A multi-section settings form with labels on the left and controls on the right.",
    category: "Forms",
  },
  {
    name: "App Shell · Sidebar",
    slug: "app-shell-sidebar",
    description: "A sidebar navigation shell with logo, nav links, and a user menu. Collapses on mobile.",
    category: "Shell",
  },
  {
    name: "App Shell · Stacked",
    slug: "app-shell-stacked",
    description: "A top-navigation shell with logo, links, notification bell, and a user dropdown.",
    category: "Shell",
  },
  {
    name: "Detail Screen",
    slug: "detail-screen",
    description: "A full entity detail page with page heading, description list, team roster, and activity feed.",
    category: "Pages",
  },
  {
    name: "Settings Screen",
    slug: "settings-screen",
    description: "A multi-section settings page with profile, notifications, password, and danger zone.",
    category: "Pages",
  },
];

export default function BlocksPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Blocks</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Blocks</h1>
        <p className="body max-w-md text-ground-400">
          Full page sections assembled from atoms and molecules. Copy the code and drop it directly into any layout.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">{BLOCKS.length} blocks</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Built on Molecules + Atoms</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {BLOCKS.map((block) => (
          <Card
            key={block.slug}
            className="shadow-natural flex flex-col justify-between transition-shadow hover:shadow-elevated"
          >
            <CardHeader className="pb-2">
              <div className="mb-2">
                <Badge variant="secondary" className="caption-xs">
                  {block.category}
                </Badge>
              </div>
              <CardTitle className="subheading text-ground-900">{block.name}</CardTitle>
              <CardDescription className="caption leading-relaxed text-ground-400">
                {block.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-auto px-0 py-0 text-ground-500 hover:text-ground-900 hover:bg-transparent"
              >
                <Link to={`/blocks/${block.slug}`}>View block →</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="h-16" />
    </div>
  );
}
