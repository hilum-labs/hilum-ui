import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Atom,
  Blocks,
  Box,
  Component,
  LayoutDashboard,
  Layers,
  Megaphone,
  Package,
  Palette,
  PanelTop,
  ShoppingBag,
  Terminal,
} from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@hilum/ui";
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

interface PackageDoc {
  name: string;
  version: string;
  description: string;
  install: string;
  setup: string;
  setupCode?: string;
  usage: string;
  bestFor: string[];
  dependencies: string;
  icon: LucideIcon;
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
    items: [
      "Button",
      "Button Group",
      "Badge",
      "Avatar",
      "Input",
      "Steps",
      "Card",
      "Select",
      "Combobox",
      "Dialog",
      "Table",
      "Calendar",
      "Carousel",
      "Sidebar",
      "Chart",
      "Data Table",
    ],
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
    items: [
      "Field",
      "Input Group",
      "Stat Card",
      "Empty State",
      "Section Heading",
      "Page Heading",
      "Activity Feed",
      "Stacked List",
      "Radio Cards",
      "Card Heading",
      "Grid List",
      "Command Palette",
    ],
  },
  {
    id: "blocks",
    label: "Blocks",
    description: "Full page sections ready to drop into any layout.",
    icon: Blocks,
    count: 7,
    href: "/blocks",
    comingSoon: false,
    items: [
      "Sign In",
      "Navbar",
      "Form Layout",
      "App Shell · Sidebar",
      "App Shell · Stacked",
      "Detail Screen",
      "Settings Screen",
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Website sections for landing pages — heroes, pricing, testimonials, and more.",
    icon: Megaphone,
    count: 15,
    href: "/marketing",
    comingSoon: false,
    items: [
      "Heroes",
      "Feature Sections",
      "CTA Sections",
      "Pricing",
      "Testimonials",
      "FAQ Sections",
      "Stats",
      "Logo Clouds",
      "Newsletter",
      "Content Sections",
      "Blog",
      "Contact",
      "Team",
      "Footers",
      "Headers",
    ],
  },
  {
    id: "ecommerce",
    label: "Ecommerce",
    description:
      "Shop UI patterns — product listings, checkout flows, navigation, and cart components.",
    icon: ShoppingBag,
    count: 14,
    href: "/ecommerce",
    comingSoon: false,
    items: [
      "Product Lists",
      "Product Overviews",
      "Product Features",
      "Shopping Carts",
      "Checkout Forms",
      "Category Filters",
      "Category Previews",
      "Store Navigation",
      "Promo Sections",
      "Incentives",
      "Reviews",
      "Order History",
    ],
  },
  {
    id: "application-ui",
    label: "Application UI",
    description:
      "App interface patterns — shells, forms, navigation, lists, overlays, and page layouts.",
    icon: LayoutDashboard,
    count: 11,
    href: "/application-ui",
    comingSoon: false,
    items: [
      "Application Shells",
      "Forms",
      "Navigation",
      "Lists",
      "Overlays",
      "Data Display",
      "Headings",
      "Layout",
      "Elements",
      "Feedback",
      "Page Examples",
    ],
  },
];

const packages: PackageDoc[] = [
  {
    name: "@hilum/ui",
    version: "2.0.1",
    description:
      "Core design system primitives: buttons, inputs, dialogs, comboboxes, data display, tokens, fonts, and Hilum icons.",
    install: "pnpm add @hilum/ui",
    setup: "Import the token and font stylesheets once in your app's global CSS.",
    setupCode:
      '@import "tailwindcss";\n@import "@hilum/ui/tokens.css";\n@import "@hilum/ui/fonts.css";',
    usage:
      'import { Button, Dialog, Input } from "@hilum/ui";\nimport { Plus } from "@hilum/ui/icons";\n\n<Button>\n  <Plus size={14} />\n  New project\n</Button>',
    bestFor: ["Product UI primitives", "Brand tokens", "Light/dark theming", "Shared icon exports"],
    dependencies: "Peer dependencies: react and react-dom.",
    icon: Component,
  },
  {
    name: "@hilum/app-shell",
    version: "2.0.1",
    description:
      "Composed product-app layouts built from Hilum primitives: sidebars, top bars, page headers, detail screens, and settings screens.",
    install: "pnpm add @hilum/app-shell @hilum/ui",
    setup:
      "Pass your router's Link component into AppShell. Active navigation state stays caller-controlled.",
    usage:
      'import { AppShell, AppSidebar, AppHeader } from "@hilum/app-shell";\n\n<AppShell linkComponent={Link}>\n  <AppSidebar sections={sections} user={currentUser} />\n  <AppHeader breadcrumbs={breadcrumbs} />\n  <main>{children}</main>\n</AppShell>',
    bestFor: [
      "Internal app shells",
      "Sidebar navigation",
      "Product chrome",
      "Settings and detail layouts",
    ],
    dependencies: "Peers: @hilum/ui, react, react-dom. Optional peer: lucide-react.",
    icon: PanelTop,
  },
  {
    name: "@hilum/designer",
    version: "2.0.1",
    description:
      "Engine-agnostic editor chrome for authoring surfaces: shell, toolbar, side panels, collapsible panes, history, and keybindings.",
    install: "pnpm add @hilum/designer @hilum/ui",
    setup:
      "Use it for the editor frame and control surface. Pair it with a canvas, form builder, layout editor, or custom authoring engine.",
    usage:
      'import { DesignerShell, DesignerToolbar, DesignerPanel } from "@hilum/designer";\n\n<DesignerShell>\n  <DesignerToolbar />\n  <DesignerPanel />\n  {editorSurface}\n</DesignerShell>',
    bestFor: [
      "Editor chrome",
      "Toolbar composition",
      "Property panels",
      "Undo and keyboard shortcuts",
    ],
    dependencies: "Peers: @hilum/ui, react, react-dom. Runtime dependency: lucide-react.",
    icon: Layers,
  },
  {
    name: "@hilum/designer-canvas",
    version: "2.0.1",
    description:
      "Generic free-positioned canvas engine with typed layers, pan/zoom, drag and resize, marquee selection, snap guides, actions, and pluggable renderers.",
    install: "pnpm add @hilum/designer-canvas @hilum/designer @hilum/ui",
    setup:
      "Register app-specific renderers and optional services for paths, fonts, units, uploads, or thumbnails.",
    usage:
      'import { CanvasProvider, DesignerCanvas, DesignerFrame } from "@hilum/designer-canvas";\n\n<CanvasProvider frameSize={frameSize} renderers={renderers} services={services}>\n  <DesignerCanvas>\n    <DesignerFrame />\n  </DesignerCanvas>\n</CanvasProvider>',
    bestFor: [
      "Layered canvases",
      "Pan and zoom viewports",
      "Drag/resize tools",
      "Renderer registries",
    ],
    dependencies:
      "Peers: @hilum/designer, @hilum/ui, react, react-dom. Optional peer: lucide-react.",
    icon: Box,
  },
  {
    name: "@hilum/blocks",
    version: "2.0.1",
    description:
      "CLI for installing Hilum marketing blocks into an application from the catalog registry.",
    install: "pnpm add -D @hilum/blocks",
    setup:
      "Run the CLI from an app workspace. Added blocks are written into src/components/blocks by default.",
    usage: "pnpm hilum list\npnpm hilum add hero-simple-centered",
    bestFor: ["Marketing block installs", "Registry-driven copy", "Dependency-aware scaffolding"],
    dependencies:
      "Runtime dependency: commander. The CLI installs block dependencies declared by the registry.",
    icon: Terminal,
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      {/* Header */}
      <div className="mb-10 -mx-8 px-8 py-8 rounded-2xl bg-brand-secondary/30">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary">packages v2.0.1</Badge>
          <Badge variant="outline">catalog v0.1.1</Badge>
        </div>
        <h1 className="display mb-3 text-ground-900">Design System</h1>
        <p className="body max-w-md text-ground-500">
          The visual language powering every interface we build. Consistent, accessible, and
          beautifully crafted components for every team.
        </p>
      </div>

      <PageDocs path="/" />

      {/* Packages */}
      <div className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 label text-ground-400">Packages</p>
            <h2 className="heading text-ground-900">Install and use Hilum packages</h2>
          </div>
          <Badge variant="outline">5 packages</Badge>
        </div>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {packages.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} />
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-10 flex items-center gap-6 border-y border-ground-100 py-4">
        <Stat label="Atoms" value="41" active />
        <Separator orientation="vertical" className="h-8" />
        <Stat label="Molecules" value="16" active />
        <Separator orientation="vertical" className="h-8" />
        <Stat label="Blocks" value="7" active />
        <Separator orientation="vertical" className="h-8" />
        <Stat label="Categories" value="7" active />
      </div>

      {/* Categories */}
      <div className="mb-10">
        <p className="mb-4 label text-ground-400">Categories</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {categories.map((cat) =>
            cat.comingSoon ? (
              <ComingSoonCard key={cat.id} cat={cat} />
            ) : (
              <ActiveCard key={cat.id} cat={cat} />
            ),
          )}
        </div>
      </div>

      {/* Getting started */}
      <div>
        <p className="mb-4 label text-ground-400">Getting started</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="subheading">Install the package</CardTitle>
              <CardDescription className="body">
                Add <code className="font-mono text-ground-600">@hilum/ui</code> to your project,
                import the tokens CSS, and start using components.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="rounded-b-xl bg-ground-950 px-5 py-4">
                <pre className="caption leading-relaxed">
                  <code>
                    <span className="text-brand-secondary">pnpm</span>
                    <span className="text-ground-300"> add @hilum/ui</span>
                    {"\n\n"}
                    <span className="text-ground-500">{`/* globals.css */`}</span>
                    {"\n"}
                    <span className="text-brand-secondary">@import</span>
                    <span className="text-ground-300"> "@hilum/ui/tokens.css";</span>
                    {"\n"}
                    <span className="text-brand-secondary">@import</span>
                    <span className="text-ground-300"> "@hilum/ui/fonts.css";</span>
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="subheading">Brand tokens and themes</CardTitle>
              <CardDescription className="body">
                Hilum ships a fixed brand palette, typography, fonts, component tokens, and
                automatic light/dark mode support.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="rounded-b-xl bg-ground-950 px-5 py-4">
                <pre className="caption leading-relaxed">
                  <code>
                    <span className="text-ground-500">{`<!-- force a mode when needed -->`}</span>
                    {"\n"}
                    <span className="text-ground-300">{'<html data-theme="light">'}</span>
                    {"\n"}
                    <span className="text-ground-300">{'<html data-theme="dark">'}</span>
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
          <span className="caption font-medium text-ground-400">{cat.count} items</span>
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
            <Badge key={item} variant="secondary" className="caption-xs text-ground-400">
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

function PackageCard({ pkg }: { pkg: PackageDoc }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary">
              <pkg.icon size={15} strokeWidth={1.75} className="text-white" />
            </div>
            <div className="min-w-0">
              <CardTitle className="subheading break-words">{pkg.name}</CardTitle>
              <CardDescription className="caption">v{pkg.version}</CardDescription>
            </div>
          </div>
          <Package size={16} strokeWidth={1.75} className="mt-1 shrink-0 text-ground-300" />
        </div>
        <CardDescription className="body">{pkg.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div>
          <p className="mb-2 caption font-medium text-ground-500">Install</p>
          <CodeBlock>{pkg.install}</CodeBlock>
        </div>

        <div>
          <p className="mb-2 caption font-medium text-ground-500">Setup</p>
          <p className="body text-ground-500">{pkg.setup}</p>
          {pkg.setupCode && (
            <div className="mt-2">
              <CodeBlock>{pkg.setupCode}</CodeBlock>
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 caption font-medium text-ground-500">Use</p>
          <CodeBlock>{pkg.usage}</CodeBlock>
        </div>

        <div className="flex flex-wrap gap-1">
          {pkg.bestFor.map((item) => (
            <Badge key={item} variant="secondary" className="caption-xs text-ground-400">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <p className="caption text-ground-400">{pkg.dependencies}</p>
      </CardFooter>
    </Card>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-ground-950 px-4 py-3">
      <pre className="caption whitespace-pre-wrap break-words leading-relaxed text-ground-300">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function ComingSoonCard({ cat }: { cat: Category }) {
  return (
    <Card variant="muted" className="flex flex-col opacity-50">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex size-8 items-center justify-center rounded-lg bg-ground-100">
            <cat.icon size={15} strokeWidth={1.75} className="text-ground-400" />
          </div>
          <Badge variant="outline">Soon</Badge>
        </div>
        <CardTitle className="subheading">{cat.label}</CardTitle>
        <CardDescription className="body">{cat.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1">
          {cat.items.map((item) => (
            <Badge key={item} variant="secondary" className="caption-xs text-ground-400">
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
      <p className={cn("heading font-medium", active ? "text-ground-900" : "text-ground-300")}>
        {value}
      </p>
      <p
        className={cn("mt-0.5 caption font-medium", active ? "text-ground-400" : "text-ground-300")}
      >
        {label}
      </p>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => createCatalogPageHead("/"),
  component: HomePage,
});
