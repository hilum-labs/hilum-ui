import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Frame, MousePointer2, Image, Layers, Package, Code2 } from "lucide-react";
import { CornerRadiusControl, SpacingControl, TwoValueControl } from "@hilum/designer";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hilum/ui";

const SUBSECTIONS = [
  {
    href: "/designer/shell",
    title: "Shell",
    description: "DesignerShell, Header, Sidebar, Panel, Pane, Toolbar — engine-agnostic chrome.",
    icon: Frame,
    package: "@hilum/designer",
  },
  {
    href: "/designer/canvas",
    title: "Canvas",
    description:
      "Live demo of <Designer> + <DesignerCanvas> + <DesignerFrame>. Drag, marquee-select, zoom.",
    icon: MousePointer2,
    package: "@hilum/designer-canvas",
  },
  {
    href: "/designer/static-frame",
    title: "Static Frame",
    description:
      "Read-only DesignerStaticFrame for thumbnails / previews. Same renderers, no interactivity.",
    icon: Image,
    package: "@hilum/designer-canvas",
  },
  {
    href: "/designer/pane-visibility",
    title: "Pane Visibility",
    description: "Interactive demo of DesignerPane.showFor with multiple layer types selected.",
    icon: Layers,
    package: "@hilum/designer",
  },
];

const EXPORT_GROUPS = [
  {
    package: "@hilum/designer",
    description:
      "Engine-agnostic editor chrome for shells, panes, panels, sidebars, and toolbar controls.",
    items: [
      {
        name: "ShellProvider",
        kind: "Provider",
        description:
          "Provides selectedIds, activeTool, readOnly, and resolveKind to designer chrome.",
      },
      {
        name: "useShellContext",
        kind: "Hook",
        description:
          "Reads and updates the shell state from toolbars, panes, sidebars, and app controls.",
      },
      {
        name: "DesignerShell",
        kind: "Layout",
        description:
          "Root full-height shell that hosts header, sidebar, canvas, panels, and toolbars.",
      },
      {
        name: "DesignerHeader",
        kind: "Layout",
        description: "Top chrome for document title, breadcrumbs, status, and primary actions.",
      },
      {
        name: "DesignerSidebar",
        kind: "Navigation",
        description: "Vertical tool or mode rail wired to activeTool through ShellContext.",
      },
      {
        name: "DesignerPanel",
        kind: "Layout",
        description: "Left or right inspector panel with configurable width and border side.",
      },
      {
        name: "DesignerPane",
        kind: "Inspector",
        description:
          "Panel section with collapsible state and showFor visibility by selected item kind.",
      },
      {
        name: "DesignerPaneTitle",
        kind: "Inspector",
        description: "Pane header with optional action content and collapse trigger behavior.",
      },
      {
        name: "DesignerPaneContent",
        kind: "Inspector",
        description: "Consistent content spacing for property rows and controls inside a pane.",
      },
      {
        name: "TwoValueControl",
        kind: "Inspector",
        description: "Compact paired numeric fields for properties such as X/Y, W/H, and offsets.",
      },
      {
        name: "FourValueControl",
        kind: "Inspector",
        description:
          "Generic 2×2 numeric control with linked/unlinked behavior for sides and corners.",
      },
      {
        name: "SpacingControl / CornerRadiusControl",
        kind: "Inspector",
        description:
          "Semantic wrappers over FourValueControl for padding, margins, and corner radii.",
      },
      {
        name: "DesignerToolbar",
        kind: "Toolbar",
        description: "Floating or inline toolbar container for canvas and document actions.",
      },
      {
        name: "DesignerToolbarGroup",
        kind: "Toolbar",
        description: "Groups related toolbar controls without creating extra layout chrome.",
      },
      {
        name: "DesignerToolbarButton",
        kind: "Toolbar",
        description: "Tooltip-ready icon button with active, disabled, label, and shortcut states.",
      },
      {
        name: "DesignerToolbarSeparator",
        kind: "Toolbar",
        description: "Visual divider for related toolbar button groups.",
      },
      {
        name: "useHistory",
        kind: "Hook",
        description: "Small undo/redo state helper for editor workflows that need local history.",
      },
      {
        name: "useKeybindings",
        kind: "Hook",
        description:
          "Registers keyboard shortcuts with enablement and cleanup handled by the hook.",
      },
    ],
  },
  {
    package: "@hilum/designer-canvas",
    description:
      "Generic free-positioned canvas engine with context state, renderers, overlays, hooks, and actions.",
    items: [
      {
        name: "Designer",
        kind: "Composition",
        description:
          "High-level provider composition for canvas state, shell context, and renderer registry.",
      },
      {
        name: "CanvasProvider",
        kind: "Provider",
        description:
          "Owns canvas state, dispatch, selection, viewport, pan, zoom, and history wiring.",
      },
      {
        name: "useCanvasContext",
        kind: "Hook",
        description:
          "Reads canvas state and dispatch from custom inspectors, overlays, and actions.",
      },
      {
        name: "RendererProvider",
        kind: "Provider",
        description: "Registers layer renderers by type so the canvas can stay engine-agnostic.",
      },
      {
        name: "DesignerCanvas",
        kind: "Canvas",
        description:
          "Interactive surface that hosts frames, overlays, pointer selection, and pan behavior.",
      },
      {
        name: "DesignerFrame",
        kind: "Canvas",
        description:
          "Editable frame that renders positioned layers with the active renderer registry.",
      },
      {
        name: "DesignerStaticFrame",
        kind: "Preview",
        description: "Read-only frame for thumbnails, previews, and catalog examples.",
      },
      {
        name: "GridOverlay",
        kind: "Overlay",
        description: "Draws grid guides from the frame and viewport state.",
      },
      {
        name: "LayerSelectionOverlay",
        kind: "Overlay",
        description: "Displays selected-layer outlines and handles on top of rendered layers.",
      },
      {
        name: "MarqueeOverlay",
        kind: "Overlay",
        description: "Displays drag-selection bounds while selecting multiple layers.",
      },
      {
        name: "useLayers / useLayer / useSelectedLayers",
        kind: "Hooks",
        description:
          "Convenience readers for layer lists, individual layers, and current selection.",
      },
      {
        name: "useZoom / useDragInteraction / useHistoryActions",
        kind: "Hooks",
        description:
          "Canvas interaction helpers for viewport controls, dragging, and undo or redo actions.",
      },
      {
        name: "ActionAddLayer / ActionAlign / ActionArrange",
        kind: "Actions",
        description: "Reusable toolbar actions for creating layers and controlling layer position.",
      },
      {
        name: "ActionDelete / ActionDuplicate / ActionGroup",
        kind: "Actions",
        description: "Reusable toolbar actions for common document editing commands.",
      },
      {
        name: "ActionLock / ActionTool / ActionTransform / ActionUndoRedo / ActionZoom",
        kind: "Actions",
        description: "Reusable controls for locks, tools, transforms, history, and viewport zoom.",
      },
    ],
  },
];

const API_NOTES = [
  {
    name: "DesignerPane.showFor",
    description:
      "Accepts selected item kinds and renders the pane only when ShellContext.resolveKind returns a matching kind.",
    href: "/designer/pane-visibility",
  },
  {
    name: "ShellContext.resolveKind",
    description:
      "Maps opaque selected IDs to app-defined layer kinds such as text, image, shape, or group.",
    href: "/designer/pane-visibility",
  },
  {
    name: "Renderer registry",
    description:
      "Maps layer type strings to app-owned React renderers so the canvas package does not own domain UI.",
    href: "/designer/canvas",
  },
  {
    name: "Static frame rendering",
    description:
      "Uses the same canvas state and renderers without pointer interactions for thumbnails and previews.",
    href: "/designer/static-frame",
  },
];

function DesignerIndex() {
  const [position, setPosition] = useState({ x: 48, y: 32 });
  const [spacing, setSpacing] = useState({ top: 10, right: 12, bottom: 10, left: 12 });
  const [spacingLinked, setSpacingLinked] = useState(false);
  const [corners, setCorners] = useState({
    topLeft: 16,
    topRight: 24,
    bottomLeft: 16,
    bottomRight: 24,
  });
  const [cornersLinked, setCornersLinked] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="mb-10">
        <p className="caption-xs uppercase tracking-wider font-semibold text-muted-foreground">
          Section
        </p>
        <h1 className="display text-foreground mt-1">Designer</h1>
        <p className="body-lg text-muted-foreground mt-3 max-w-3xl">
          Composable canvas-editor primitives. The chrome lives in{" "}
          <code className="caption font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
            @hilum/designer
          </code>{" "}
          (engine-agnostic) and the canvas engine in{" "}
          <code className="caption font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
            @hilum/designer-canvas
          </code>{" "}
          (generic free-positioned canvas with a pluggable renderer registry).
        </p>
      </div>

      <PageDocs path="/designer/" />

      <section className="mb-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="caption-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Runnable demos
            </p>
            <h2 className="heading mt-1 text-foreground">Start with a working surface</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUBSECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.href} to={s.href} className="group">
                <Card className="h-full transition-[box-shadow] hover:shadow-natural">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex size-10 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                        <Icon size={18} />
                      </div>
                      <Badge variant="secondary" className="caption-xs font-mono">
                        {s.package}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3">{s.title}</CardTitle>
                    <CardDescription>{s.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <span className="caption flex items-center gap-1 text-brand-primary transition-[gap] group-hover:gap-2">
                      Open <ArrowRight size={12} />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-4">
          <p className="caption-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Property controls
          </p>
          <h2 className="heading mt-1 text-foreground">Dense inspector inputs</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>TwoValueControl</CardTitle>
              <CardDescription>Paired numeric values for geometry and offsets.</CardDescription>
            </CardHeader>
            <CardContent>
              <TwoValueControl
                label="Position"
                unit="px"
                values={position}
                items={[
                  { key: "x", label: "X", ariaLabel: "X position" },
                  { key: "y", label: "Y", ariaLabel: "Y position" },
                ]}
                onChange={(key, value) => setPosition((next) => ({ ...next, [key]: value }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SpacingControl</CardTitle>
              <CardDescription>Four sides with optional linked editing.</CardDescription>
            </CardHeader>
            <CardContent>
              <SpacingControl
                label="Margins"
                unit="mm"
                values={spacing}
                linked={spacingLinked}
                onLinkedChange={setSpacingLinked}
                onChange={(side, value) => setSpacing((next) => ({ ...next, [side]: value }))}
                onChangeAll={(value) =>
                  setSpacing({ top: value, right: value, bottom: value, left: value })
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CornerRadiusControl</CardTitle>
              <CardDescription>Corner-specific values over the same four-value base.</CardDescription>
            </CardHeader>
            <CardContent>
              <CornerRadiusControl
                label="Corners"
                unit="px"
                values={corners}
                linked={cornersLinked}
                onLinkedChange={setCornersLinked}
                onChange={(corner, value) => setCorners((next) => ({ ...next, [corner]: value }))}
                onChangeAll={(value) =>
                  setCorners({
                    topLeft: value,
                    topRight: value,
                    bottomLeft: value,
                    bottomRight: value,
                  })
                }
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-4">
          <p className="caption-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Exported API
          </p>
          <h2 className="heading mt-1 text-foreground">
            Components, providers, hooks, and actions
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {EXPORT_GROUPS.map((group) => (
            <Card key={group.package} className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                      <Package size={18} />
                    </div>
                    <div>
                      <CardTitle className="font-mono">{group.package}</CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="grid gap-3 rounded-lg border border-border bg-muted px-3 py-3 md:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.35fr)] md:items-start"
                    >
                      <p className="caption font-mono font-semibold text-foreground">{item.name}</p>
                      <Badge variant="secondary" className="w-fit caption-xs">
                        {item.kind}
                      </Badge>
                      <p className="caption text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="caption-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Integration contracts
          </p>
          <h2 className="heading mt-1 text-foreground">Behavior that apps wire themselves</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {API_NOTES.map((note) => (
            <Link key={note.name} to={note.href} className="group">
              <Card className="h-full transition-[box-shadow] hover:shadow-natural">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Code2 size={18} />
                    </div>
                    <ArrowRight
                      size={14}
                      className="mt-2 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    />
                  </div>
                  <CardTitle className="mt-3 font-mono">{note.name}</CardTitle>
                  <CardDescription>{note.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/designer/")({
  head: () => createCatalogPageHead("/designer/"),
  component: DesignerIndex,
});
