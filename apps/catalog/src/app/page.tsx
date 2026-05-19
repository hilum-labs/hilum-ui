import { Link } from "react-router-dom";
import { ArrowRight, Atom, Blocks, LayoutDashboard, Layers, Megaphone, Palette, ShoppingBag } from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hilum/ui";
import { Separator } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { cn } from "@hilum/ui";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Category {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  count: number;
  href: string;
  comingSoon: boolean;
  items: string[];
}

const categories: Category[] = [
  {
    id: "atoms",
    label: "Atoms",
    description: "The smallest functional units — buttons, badges, inputs, and more.",
    icon: Atom,
    count: 41,
    href: "/atoms",
    comingSoon: false,
    items: ["Button", "Button Group", "Badge", "Avatar", "Input", "Steps", "Card", "Select", "Combobox", "Dialog", "Table", "Calendar", "Carousel", "Sidebar", "Chart", "Data Table"],
  },
  {
    id: "foundations",
    label: "Foundations",
    description: "Color palette, typography scale, spacing, and visual language.",
    icon: Palette,
    count: 5,
    href: "/foundations",
    comingSoon: false,
    items: ["Colors", "Typography", "Spacing", "Radius", "Shadows"],
  },
  {
    id: "molecules",
    label: "Molecules",
    description: "Composed patterns — forms, navigation, data displays.",
    icon: Layers,
    count: 16,
    href: "/molecules",
    comingSoon: false,
    items: ["Field", "Input Group", "Stat Card", "Empty State", "Section Heading", "Page Heading", "Activity Feed", "Stacked List", "Radio Cards", "Card Heading", "Grid List", "Command Palette"],
  },
  {
    id: "blocks",
    label: "Blocks",
    description: "Full page sections ready to drop into any layout.",
    icon: Blocks,
    count: 7,
    href: "/blocks",
    comingSoon: false,
    items: ["Sign In", "Navbar", "Form Layout", "App Shell · Sidebar", "App Shell · Stacked", "Detail Screen", "Settings Screen"],
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Website sections for landing pages — heroes, pricing, testimonials, and more.",
    icon: Megaphone,
    count: 15,
    href: "/marketing",
    comingSoon: false,
    items: ["Heroes", "Feature Sections", "CTA Sections", "Pricing", "Testimonials", "FAQ Sections", "Stats", "Logo Clouds", "Newsletter", "Content Sections", "Blog", "Contact", "Team", "Footers", "Headers"],
  },
  {
    id: "ecommerce",
    label: "Ecommerce",
    description: "Shop UI patterns — product listings, checkout flows, navigation, and cart components.",
    icon: ShoppingBag,
    count: 14,
    href: "/ecommerce",
    comingSoon: false,
    items: ["Product Lists", "Product Overviews", "Product Features", "Shopping Carts", "Checkout Forms", "Category Filters", "Category Previews", "Store Navigation", "Promo Sections", "Incentives", "Reviews", "Order History"],
  },
  {
    id: "application-ui",
    label: "Application UI",
    description: "App interface patterns — shells, forms, navigation, lists, overlays, and page layouts.",
    icon: LayoutDashboard,
    count: 11,
    href: "/application-ui",
    comingSoon: false,
    items: ["Application Shells", "Forms", "Navigation", "Lists", "Overlays", "Data Display", "Headings", "Layout", "Elements", "Feedback", "Page Examples"],
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">

      {/* Header */}
      <div className="mb-10 -mx-8 px-8 py-8 rounded-2xl bg-brand-secondary/30">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary">v0.1.0</Badge>
          <Badge variant="outline">alpha</Badge>
        </div>
        <h1 className="display mb-3 text-taupe-900">
          Design System
        </h1>
        <p className="body max-w-md text-taupe-500">
          The visual language powering every interface we build. Consistent,
          accessible, and beautifully crafted components for every team.
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-10 flex items-center gap-6 border-y border-taupe-100 py-4">
        <Stat label="Atoms" value="41" active />
        <Separator orientation="vertical" className="h-8" />
        <Stat label="Molecules" value="16" active />
        <Separator orientation="vertical" className="h-8" />
        <Stat label="Blocks" value="7" active />
        <Separator orientation="vertical" className="h-8" />
        <Stat label="Categories" value="4" active />
      </div>

      {/* Categories */}
      <div className="mb-10">
        <p className="mb-4 label text-taupe-400">
          Categories
        </p>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) =>
            cat.comingSoon ? (
              <ComingSoonCard key={cat.id} cat={cat} />
            ) : (
              <ActiveCard key={cat.id} cat={cat} />
            )
          )}
        </div>
      </div>

      {/* Getting started */}
      <div>
        <p className="mb-4 label text-taupe-400">
          Getting started
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="subheading">Install the package</CardTitle>
              <CardDescription className="body">
                Add <code className="font-mono text-taupe-600">@hilum/ui</code> to your project, import the tokens CSS, and start using components.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="rounded-b-xl bg-taupe-950 px-5 py-4">
                <pre className="caption leading-relaxed">
                  <code>
                    <span className="text-brand-secondary">pnpm</span>
                    <span className="text-taupe-300"> add @hilum/ui</span>
                    {"\n\n"}
                    <span className="text-taupe-500">{`/* globals.css */`}</span>
                    {"\n"}
                    <span className="text-brand-secondary">@import</span>
                    <span className="text-taupe-300"> "@hilum/ui/tokens.css";</span>
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="subheading">Per-product theming</CardTitle>
              <CardDescription className="body">
                Each product gets its own brand colors. Pass primary and secondary hex values — palettes are generated automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="rounded-b-xl bg-taupe-950 px-5 py-4">
                <pre className="caption leading-relaxed">
                  <code>
                    <span className="text-taupe-500">{`// App.tsx`}</span>
                    {"\n"}
                    <span className="text-brand-secondary">import</span>
                    <span className="text-taupe-300"> {"{"} ThemeProvider {"}"}</span>
                    {"\n"}
                    <span className="text-taupe-300">  from </span>
                    <span className="text-taupe-400">"@hilum/ui/create-theme"</span>
                    {"\n\n"}
                    <span className="text-taupe-300">{"<ThemeProvider"}</span>
                    {"\n"}
                    <span className="text-taupe-400">  primary</span>
                    <span className="text-taupe-300">="#0066FF"</span>
                    {"\n"}
                    <span className="text-taupe-400">  secondary</span>
                    <span className="text-taupe-300">="#FF9900"</span>
                    {"\n"}
                    <span className="text-taupe-300">{">"}</span>
                  </code>
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/theming">
                  View theming docs <ArrowRight size={13} />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ActiveCard({ cat }: { cat: Category }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand-primary">
            <cat.icon size={15} strokeWidth={1.75} className="text-white" />
          </div>
          <span className="caption font-medium text-taupe-400">
            {cat.count} items
          </span>
        </div>
        <CardTitle className="subheading">{cat.label}</CardTitle>
        <CardDescription className="body">{cat.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {cat.id === "atoms" && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Button size="xs">Button</Button>
            <Badge variant="secondary">Badge</Badge>
            <Avatar size="xs">
              <AvatarFallback className="bg-brand-primary text-white">SP</AvatarFallback>
            </Avatar>
            <Badge variant="outline">Outline</Badge>
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {cat.items.map((item) => (
            <Badge key={item} variant="secondary" className="caption-xs text-taupe-400">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link to={cat.href}>
            Browse components <ArrowRight size={13} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function ComingSoonCard({ cat }: { cat: Category }) {
  return (
    <Card variant="muted" className="flex flex-col opacity-50">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex size-8 items-center justify-center rounded-lg bg-taupe-100">
            <cat.icon size={15} strokeWidth={1.75} className="text-taupe-400" />
          </div>
          <Badge variant="outline">Soon</Badge>
        </div>
        <CardTitle className="subheading">{cat.label}</CardTitle>
        <CardDescription className="body">{cat.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1">
          {cat.items.map((item) => (
            <Badge key={item} variant="secondary" className="caption-xs text-taupe-400">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div>
      <p className={cn("heading font-medium", active ? "text-taupe-900" : "text-taupe-300")}>
        {value}
      </p>
      <p className={cn("mt-0.5 caption font-medium", active ? "text-taupe-400" : "text-taupe-300")}>
        {label}
      </p>
    </div>
  );
}
