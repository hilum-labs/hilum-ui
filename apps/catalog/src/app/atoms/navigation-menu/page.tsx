
import * as React from "react";
import { Box, Code2, FileText, Globe, LayoutDashboard, Layers, Zap } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
} from "@hilum/ui";
import { cn } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                               */
/* ------------------------------------------------------------------ */

interface ProductCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

function ProductCard({ icon, title, description, href = "#" }: ProductCardProps) {
  return (
    <NavigationMenuLink
      href={href}
      className={cn(
        "flex select-none flex-col gap-1 rounded-xl p-3",
        "hover:bg-ground-50 outline-none transition-colors",
        "no-underline"
      )}
    >
      <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
        {icon}
      </div>
      <p className="subheading text-ground-900">{title}</p>
      <p className="caption text-ground-400">{description}</p>
    </NavigationMenuLink>
  );
}

interface DevLinkProps {
  title: string;
  description: string;
  href?: string;
}

function DevLink({ title, description, href = "#" }: DevLinkProps) {
  return (
    <NavigationMenuLink
      href={href}
      className={cn(
        "flex select-none flex-col gap-0.5 rounded-md p-2.5",
        "hover:bg-ground-50 outline-none transition-colors",
        "no-underline"
      )}
    >
      <p className="body font-medium text-ground-900">{title}</p>
      <p className="caption text-ground-400">{description}</p>
    </NavigationMenuLink>
  );
}

/* ------------------------------------------------------------------ */
/*  Code strings                                                        */
/* ------------------------------------------------------------------ */

const CODE = {
  horizontal: `import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@hilum/ui"

<NavigationMenu>
  <NavigationMenuList>
    {/* Products — rich card dropdown */}
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[480px] grid-cols-3 gap-1 p-3">
          <ProductCard
            icon={<Box size={16} />}
            title="Components"
            description="Reusable UI building blocks"
          />
          <ProductCard
            icon={<Layers size={16} />}
            title="Templates"
            description="Ready-to-use page layouts"
          />
          <ProductCard
            icon={<Zap size={16} />}
            title="Integrations"
            description="Connect your favourite tools"
          />
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>

    {/* Developers — 2-col grid */}
    <NavigationMenuItem>
      <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[360px] grid-cols-2 gap-1 p-3">
          <DevLink title="API Reference" description="Explore the full REST API" />
          <DevLink title="SDKs" description="Client libraries for every platform" />
          <DevLink title="Documentation" description="Guides and tutorials" />
          <DevLink title="Status" description="Uptime and incident history" />
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>

    {/* Plain links */}
    <NavigationMenuItem>
      <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
        Pricing
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
        Blog
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,

  withViewport: `import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
  NavigationMenuViewport, NavigationMenuIndicator,
  navigationMenuTriggerStyle,
} from "@hilum/ui"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuIndicator />

    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[480px] grid-cols-3 gap-1 p-3">
          {/* ... product cards */}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>

    <NavigationMenuItem>
      <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[360px] grid-cols-2 gap-1 p-3">
          {/* ... dev links */}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>

    <NavigationMenuItem>
      <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
        Pricing
      </NavigationMenuLink>
    </NavigationMenuItem>

    <NavigationMenuItem>
      <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
        Blog
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>

  {/* Animated floating viewport */}
  <NavigationMenuViewport />
</NavigationMenu>`,
};

/* ------------------------------------------------------------------ */
/*  Section heading                                                     */
/* ------------------------------------------------------------------ */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo: Horizontal navigation (direct dropdowns, no viewport)        */
/* ------------------------------------------------------------------ */

function HorizontalNavDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Products */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[480px] grid-cols-3 gap-1 p-3">
              <ProductCard
                icon={<Box size={16} />}
                title="Components"
                description="Reusable UI building blocks for every use case"
              />
              <ProductCard
                icon={<Layers size={16} />}
                title="Templates"
                description="Ready-to-use page layouts and starter kits"
              />
              <ProductCard
                icon={<Zap size={16} />}
                title="Integrations"
                description="Connect your favourite tools and services"
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Developers */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[360px] grid-cols-2 gap-1 p-3">
              <DevLink
                title="API Reference"
                description="Explore the full REST API"
              />
              <DevLink
                title="SDKs"
                description="Client libraries for every platform"
              />
              <DevLink
                title="Documentation"
                description="Guides, tutorials, and examples"
              />
              <DevLink
                title="Status"
                description="Uptime and incident history"
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Plain links */}
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo: With viewport (animated floating panel)                      */
/* ------------------------------------------------------------------ */

function WithViewportDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuIndicator />

        {/* Products */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[480px] grid-cols-3 gap-1 p-3">
              <ProductCard
                icon={<Box size={16} />}
                title="Components"
                description="Reusable UI building blocks for every use case"
              />
              <ProductCard
                icon={<Layers size={16} />}
                title="Templates"
                description="Ready-to-use page layouts and starter kits"
              />
              <ProductCard
                icon={<Zap size={16} />}
                title="Integrations"
                description="Connect your favourite tools and services"
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Developers */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[360px] grid-cols-2 gap-1 p-3">
              <DevLink
                title="API Reference"
                description="Explore the full REST API"
              />
              <DevLink
                title="SDKs"
                description="Client libraries for every platform"
              />
              <DevLink
                title="Documentation"
                description="Guides, tutorials, and examples"
              />
              <DevLink
                title="Status"
                description="Uptime and incident history"
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Resources */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[340px] grid-cols-1 gap-1 p-3">
              <DevLink
                title="Blog"
                description="Product updates, guides, and design articles"
              />
              <DevLink
                title="Changelog"
                description="See what's new in each release"
              />
              <DevLink
                title="Community"
                description="Forums, Discord, and open-source contributions"
              />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Plain link */}
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      {/* Animated viewport panel */}
      <NavigationMenuViewport />
    </NavigationMenu>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function NavigationMenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Navigation Menu</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Navigation Menu</h1>
        <p className="body max-w-lg text-ground-500">
          Horizontal navigation with rich dropdown panels. Supports direct
          content dropdowns and animated viewport transitions.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Navigation Menu · Variants" />

        <PreviewBlock
          title="Horizontal navigation"
          description="Products and Developers dropdowns with rich content, plus plain nav links"
          code={CODE.horizontal}
          previewClassName="min-h-48 items-start pt-8"
        >
          <HorizontalNavDemo />
        </PreviewBlock>

        <PreviewBlock
          title="With viewport"
          description="Animated floating viewport panel with cross-fade transitions between items"
          code={CODE.withViewport}
          previewClassName="min-h-64 items-start pt-8"
        >
          <WithViewportDemo />
        </PreviewBlock>
      </div>
    </div>
  );
}
