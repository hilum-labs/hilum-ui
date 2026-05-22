import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

/* ------------------------------------------------------------------ */
/*  Component registry                                                  */
/* ------------------------------------------------------------------ */

type ComponentEntry = {
  name: string;
  slug: string;
  description: string;
  category: "primitive" | "form" | "overlay" | "layout" | "feedback" | "data";
};

const GROUPS: { label: string; components: ComponentEntry[] }[] = [
  {
    label: "Primitives",
    components: [
      { name: "Button", slug: "button", description: "Triggers actions. Supports multiple variants, sizes, and icon compositions.", category: "primitive" },
      { name: "Button Group", slug: "button-group", description: "Multiple related actions as a unified joined control.", category: "primitive" },
      { name: "Badge", slug: "badge", description: "Compact labels for status, categories, and metadata.", category: "primitive" },
      { name: "Avatar", slug: "avatar", description: "User representations with image, fallback, and optional status indicator.", category: "primitive" },
      { name: "Avatar Stack", slug: "avatar-stack", description: "Overlapping group of avatars with optional overflow badge.", category: "primitive" },
      { name: "Input", slug: "input", description: "Single-line text field for user input.", category: "primitive" },
      { name: "Label", slug: "label", description: "Accessible form label that associates with its control.", category: "primitive" },
      { name: "Separator", slug: "separator", description: "Visual divider between sections, horizontal or vertical.", category: "primitive" },
      { name: "Card", slug: "card", description: "Contained surface for grouping related content. Supports media, stats, and article layouts.", category: "primitive" },
      { name: "Skeleton", slug: "skeleton", description: "Loading placeholder that mimics content shape.", category: "primitive" },
      { name: "Textarea", slug: "textarea", description: "Multi-line text input field.", category: "primitive" },
      { name: "Kbd", slug: "kbd", description: "Keyboard shortcut display using monospaced styling.", category: "primitive" },
      { name: "Steps", slug: "steps", description: "Multi-step progress indicator. Circles, bullets, and progress-bar variants.", category: "primitive" },
      { name: "Aspect Ratio", slug: "aspect-ratio", description: "Constrains content to a specific aspect ratio.", category: "primitive" },
    ],
  },
  {
    label: "Form",
    components: [
      { name: "Checkbox", slug: "checkbox", description: "Binary selection control, supports indeterminate state.", category: "form" },
      { name: "Radio Group", slug: "radio-group", description: "Single selection from a set of mutually exclusive options.", category: "form" },
      { name: "Switch", slug: "switch", description: "Toggle between two states — on and off.", category: "form" },
      { name: "Toggle", slug: "toggle", description: "Two-state press button for toolbars and filter controls.", category: "form" },
      { name: "Toggle Group", slug: "toggle-group", description: "Set of toggles with single or multiple selection.", category: "form" },
      { name: "Slider", slug: "slider", description: "Range input for selecting a numeric value.", category: "form" },
      { name: "Select", slug: "select", description: "Dropdown list for choosing a single option.", category: "form" },
      { name: "Native Select", slug: "native-select", description: "Styled native HTML select. No JavaScript overhead — uses the browser's built-in dropdown.", category: "form" },
      { name: "Combobox", slug: "combobox", description: "Searchable select field with autocomplete filtering.", category: "form" },
      { name: "Command", slug: "command", description: "Composable command menu with search, groups, keyboard navigation, and shortcut indicators.", category: "form" },
      { name: "Calendar", slug: "calendar", description: "Date picker calendar with single, range, and multi-select modes.", category: "form" },
      { name: "Date Picker", slug: "date-picker", description: "Composable date input combining calendar with a popover trigger.", category: "form" },
      { name: "Input OTP", slug: "input-otp", description: "One-time password input with individual character slots.", category: "form" },
    ],
  },
  {
    label: "Overlay",
    components: [
      { name: "Dialog", slug: "dialog", description: "Modal overlay for focused tasks and confirmations.", category: "overlay" },
      { name: "Alert Dialog", slug: "alert-dialog", description: "Confirmation modal that requires explicit user action before proceeding.", category: "overlay" },
      { name: "Sheet", slug: "sheet", description: "Slide-in panel anchored to a screen edge.", category: "overlay" },
      { name: "Drawer", slug: "drawer", description: "Bottom sheet that slides up from the edge, optimised for mobile.", category: "overlay" },
      { name: "Tooltip", slug: "tooltip", description: "Brief label that appears on hover to clarify an element.", category: "overlay" },
      { name: "Popover", slug: "popover", description: "Floating panel anchored to a trigger, for richer content.", category: "overlay" },
      { name: "Hover Card", slug: "hover-card", description: "Rich preview card that appears on hover over a link or element.", category: "overlay" },
      { name: "Dropdown Menu", slug: "dropdown-menu", description: "Contextual menu revealed on trigger interaction.", category: "overlay" },
      { name: "Context Menu", slug: "context-menu", description: "Right-click menu with nested sub-menus and keyboard support.", category: "overlay" },
    ],
  },
  {
    label: "Navigation",
    components: [
      { name: "Menubar", slug: "menubar", description: "Horizontal application menu bar with nested dropdown panels.", category: "layout" },
      { name: "Navigation Menu", slug: "navigation-menu", description: "Accessible top-level navigation with animated dropdown panels.", category: "layout" },
      { name: "Sidebar", slug: "sidebar", description: "Composable side navigation with collapsible, icon, and off-canvas modes.", category: "layout" },
    ],
  },
  {
    label: "Layout",
    components: [
      { name: "Tabs", slug: "tabs", description: "Organises content into switchable panels.", category: "layout" },
      { name: "Accordion", slug: "accordion", description: "Vertically stacked sections that expand and collapse.", category: "layout" },
      { name: "Collapsible", slug: "collapsible", description: "Toggleable content region, building block for nav groups.", category: "layout" },
      { name: "Scroll Area", slug: "scroll-area", description: "Scrollable container with a styled custom scrollbar.", category: "layout" },
      { name: "Breadcrumb", slug: "breadcrumb", description: "Navigation trail showing the current page location.", category: "layout" },
      { name: "Pagination", slug: "pagination", description: "Navigation control for multi-page content.", category: "layout" },
      { name: "Carousel", slug: "carousel", description: "Horizontally scrollable item sequence with previous/next controls.", category: "layout" },
      { name: "Resizable", slug: "resizable", description: "Drag-to-resize panel groups for flexible layouts.", category: "layout" },
    ],
  },
  {
    label: "Data",
    components: [
      { name: "Table", slug: "table", description: "Structured data display with rows and columns.", category: "data" },
      { name: "Data Table", slug: "data-table", description: "Sortable, filterable table powered by TanStack Table.", category: "data" },
      { name: "Chart", slug: "chart", description: "Recharts-based data visualisation with design-system styling.", category: "data" },
    ],
  },
  {
    label: "Feedback",
    components: [
      { name: "Alert", slug: "alert", description: "Inline message communicating status or feedback.", category: "feedback" },
      { name: "Progress", slug: "progress", description: "Visual indicator of completion or loading progress.", category: "feedback" },
      { name: "Spinner", slug: "spinner", description: "Animated loading indicator for async operations.", category: "feedback" },
      { name: "Toast", slug: "sonner", description: "Non-blocking notifications that appear briefly and dismiss automatically.", category: "feedback" },
    ],
  },
];

const CATEGORY_LABEL: Record<ComponentEntry["category"], string> = {
  primitive: "Primitive",
  form: "Form",
  overlay: "Overlay",
  layout: "Layout",
  feedback: "Feedback",
  data: "Data",
};

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

function AtomsPage() {
  const totalComponents = GROUPS.reduce((acc, g) => acc + g.components.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Atoms</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Atoms</h1>
        <p className="body max-w-md text-ground-400">
          The smallest functional units of the design system. These primitives
          are the foundation for all molecules and blocks.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">{totalComponents} components</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Based on shadcn/ui · Radix UI</p>
        </div>
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-12">
        {GROUPS.map((group) => (
          <section key={group.label}>
            {/* Section heading */}
            <div className="mb-6 flex items-center gap-3">
              <h2 className="label text-ground-400">{group.label}</h2>
              <div className="h-px flex-1 bg-ground-100" />
            </div>

            {/* Component grid */}
            <div className="grid grid-cols-3 gap-4">
              {group.components.map((component) => (
                <Card
                  key={component.slug}
                  className="shadow-natural flex flex-col justify-between transition-shadow hover:shadow-elevated"
                >
                  <CardHeader className="pb-2">
                    <div className="mb-2">
                      <Badge variant="secondary" className="caption-xs">
                        {CATEGORY_LABEL[component.category]}
                      </Badge>
                    </div>
                    <CardTitle className="subheading text-ground-900">
                      {component.name}
                    </CardTitle>
                    <CardDescription className="caption leading-relaxed text-ground-400">
                      {component.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 py-0 text-ground-500 hover:text-ground-900 hover:bg-transparent"
                    >
                      <a href={`/atoms/${component.slug}`}>View component →</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom spacer */}
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/")({
  head: () => createCatalogPageHead("/atoms/"),
  component: AtomsPage,
});
