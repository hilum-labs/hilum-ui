import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { useState } from "react";
import {
  MousePointer2,
  Hand,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  ChevronsUpDown,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  CircleHelp,
  Moon,
} from "lucide-react";
import {
  DesignerShell,
  DesignerWorkspace,
  DesignerWorkspaceViewport,
  DesignerHeader,
  DesignerSidebar,
  DesignerPanel,
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
  DesignerToolbar,
  DesignerToolbarButton,
  DesignerToolbarGroup,
  DesignerToolbarSeparator,
  ShellProvider,
  useShellContext,
} from "@hilum/designer";
import { Button, Input, Label, PropertyRow, InputNumber, ColorInput, Slider, cn } from "@hilum/ui";

const TOOLS = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "hand", label: "Pan", icon: Hand },
  { id: "text", label: "Text", icon: Type },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "rect", label: "Rectangle", icon: Square },
  { id: "ellipse", label: "Ellipse", icon: Circle },
];

function DesignerShellDemo() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/designer" className="hover:text-ground-700">
            Designer
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Shell</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Shell</h1>
        <p className="body max-w-2xl text-ground-500">
          Engine-agnostic editor chrome with floating sidebars, toolbars, and contextual panels
          layered over a full-bleed authoring canvas.
        </p>
      </div>

      <PageDocs path="/designer/shell/" />

      <section className="overflow-hidden rounded-2xl border border-ground-100 shadow-natural">
        <div className="h-[720px] bg-white">
          <ShellProvider
            initialSelectedIds={["demo-1"]}
            initialTool="select"
            resolveKind={() => "text"}
          >
            <Demo />
          </ShellProvider>
        </div>
      </section>
    </div>
  );
}

function Demo() {
  const { activeTool, setActiveTool, selectedIds, setSelectedIds } = useShellContext();
  const [opacity, setOpacity] = useState(80);
  const [x, setX] = useState(120);
  const [y, setY] = useState(80);
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(180);
  const [fill, setFill] = useState("#c100f1");
  const [name, setName] = useState("Hero text");
  const [zoom, setZoom] = useState(100);
  const [headerMode, setHeaderMode] = useState<"edit" | "preview">("edit");
  const selected = selectedIds.includes("demo-1");

  const zoomScale = zoom / 100;

  return (
    <DesignerShell className="h-full w-full">
      <DesignerHeader
        left={
          <>
            <Button variant="ghost" size="icon-sm" aria-label="Back to projects">
              <ArrowLeft size={16} />
            </Button>
            <div className="flex size-6 items-center justify-center rounded-md bg-ground-900">
              <span className="caption-xs font-bold text-white">H</span>
            </div>
            <span className="caption truncate font-semibold text-ground-900">Untitled design</span>
          </>
        }
        center={
          <div className="grid w-72 grid-cols-3 rounded-xl border border-border bg-muted p-0.5">
            <button
              type="button"
              aria-pressed={headerMode === "edit"}
              onClick={() => setHeaderMode("edit")}
              className={cn(
                "rounded-lg px-5 py-1.5 caption font-semibold",
                headerMode === "edit"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Edit
            </button>
            <button
              type="button"
              aria-pressed={headerMode === "preview"}
              onClick={() => setHeaderMode("preview")}
              className={cn(
                "rounded-lg px-5 py-1.5 caption font-medium",
                headerMode === "preview"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Preview
            </button>
            <button
              type="button"
              className="rounded-lg px-5 py-1.5 caption font-medium text-muted-foreground hover:text-foreground"
            >
              Export
            </button>
          </div>
        }
        right={
          <>
            <Button variant="ghost" size="icon-sm" aria-label="Toggle theme">
              <Moon size={16} />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Open help">
              <CircleHelp size={16} />
            </Button>
            <span className="h-5 w-px bg-border" aria-hidden="true" />
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-full bg-primary caption font-semibold text-primary-foreground"
              aria-label="Open account settings"
            >
              W
            </button>
          </>
        }
      />

      <DesignerWorkspace className="bg-ground-100">
        <DesignerSidebar
          variant="floating"
          floatingInset={{ left: 0 }}
          items={TOOLS.map((t) => ({
            id: t.id,
            label: t.label,
            icon: t.icon,
            active: activeTool === t.id,
            onClick: () => setActiveTool(t.id),
          }))}
        />

        <DesignerWorkspaceViewport>
          <main className="relative flex-1 overflow-hidden bg-ground-100">
            <div className="absolute left-4 top-4 rounded-md border border-ground-200 bg-white px-2.5 py-1 shadow-natural">
              <span className="caption-xs font-mono text-ground-500">
                {activeTool} · {zoom}%
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center p-8">
              <button
                type="button"
                aria-label="Select demo layer"
                aria-pressed={selected}
                onClick={() => setSelectedIds(["demo-1"])}
                className="relative h-[520px] w-[620px] rounded-md bg-white shadow-natural outline-none"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div
                  className={cn(
                    "absolute flex items-center justify-center rounded-lg border-2 text-center transition-shadow",
                    selected ? "border-brand-primary shadow-natural" : "border-ground-200",
                    activeTool === "hand" ? "cursor-grab" : "cursor-pointer",
                  )}
                  style={{
                    left: x,
                    top: y,
                    width,
                    height,
                    backgroundColor: fill,
                    opacity: opacity / 100,
                  }}
                >
                  <div className={cn("px-4", opacity < 35 ? "text-ground-900" : "text-white")}>
                    <p className="heading">{name}</p>
                    <p className="caption mt-1">Move, resize, recolor, and fade this layer.</p>
                  </div>
                </div>
              </button>
            </div>
          </main>
        </DesignerWorkspaceViewport>

        <DesignerToolbar boundary="workspace" center="boundary">
          <DesignerToolbarGroup>
            <DesignerToolbarButton
              label="Undo"
              shortcut="⌘Z"
              onClick={() => {
                setX(120);
                setY(80);
                setWidth(320);
                setHeight(180);
                setOpacity(80);
                setFill("#c100f1");
              }}
            >
              <Undo2 size={16} />
            </DesignerToolbarButton>
            <DesignerToolbarButton
              label="Redo"
              shortcut="⇧⌘Z"
              onClick={() => {
                setX(180);
                setY(130);
                setWidth(280);
                setHeight(150);
                setOpacity(64);
                setFill("#740092");
              }}
            >
              <Redo2 size={16} />
            </DesignerToolbarButton>
          </DesignerToolbarGroup>
          <DesignerToolbarSeparator />
          <DesignerToolbarGroup>
            <DesignerToolbarButton
              label="Zoom out"
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
            >
              <ZoomOut size={16} />
            </DesignerToolbarButton>
            <DesignerToolbarButton label="Reset zoom" onClick={() => setZoom(100)}>
              <span className="caption-xs tabular-nums">{zoom}%</span>
            </DesignerToolbarButton>
            <DesignerToolbarButton
              label="Zoom in"
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
            >
              <ZoomIn size={16} />
            </DesignerToolbarButton>
          </DesignerToolbarGroup>
        </DesignerToolbar>

        <DesignerPanel
          side="left"
          variant="floating"
          width={220}
          floatingInset={{ top: 16, bottom: 16, left: 60 }}
        >
          <DesignerPane>
            <DesignerPaneTitle>Layers</DesignerPaneTitle>
            <DesignerPaneContent className="gap-1">
              {["Hero text", "Background", "Decoration"].map((layer, index) => (
                <button
                  key={layer}
                  type="button"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-2 text-left caption",
                    index === 0
                      ? "bg-ground-100 font-medium text-ground-900"
                      : "text-ground-500 hover:bg-ground-50",
                  )}
                  onClick={() => index === 0 && setSelectedIds(["demo-1"])}
                >
                  <span className="size-2 rounded-sm bg-brand-primary/60" />
                  {layer}
                </button>
              ))}
            </DesignerPaneContent>
          </DesignerPane>
        </DesignerPanel>

        <DesignerPanel side="right" variant="floating" width={260}>
          <DesignerPane>
            <DesignerPaneTitle>Layer</DesignerPaneTitle>
            <DesignerPaneContent>
              <Label htmlFor="layer-name" className="caption text-ground-500">
                Name
              </Label>
              <Input id="layer-name" value={name} onChange={(e) => setName(e.target.value)} />
            </DesignerPaneContent>
          </DesignerPane>

          <DesignerPane collapsible defaultOpen>
            <DesignerPaneTitle>Position</DesignerPaneTitle>
            <DesignerPaneContent>
              <PropertyRow label="X">
                <InputNumber value={x} onChange={setX} unit="px" />
              </PropertyRow>
              <PropertyRow label="Y">
                <InputNumber value={y} onChange={setY} unit="px" />
              </PropertyRow>
              <PropertyRow label="W">
                <InputNumber value={width} onChange={setWidth} unit="px" />
              </PropertyRow>
              <PropertyRow label="H">
                <InputNumber value={height} onChange={setHeight} unit="px" />
              </PropertyRow>
            </DesignerPaneContent>
          </DesignerPane>

          <DesignerPane collapsible showFor={["text"]}>
            <DesignerPaneTitle action={<ChevronsUpDown size={12} className="text-ground-300" />}>
              Appearance
            </DesignerPaneTitle>
            <DesignerPaneContent>
              <PropertyRow label="Fill">
                <ColorInput value={fill} onChange={setFill} />
              </PropertyRow>
              <PropertyRow label="Opacity">
                <Slider
                  value={[opacity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(v) => setOpacity(v[0] ?? 0)}
                />
                <span className="caption-xs tabular-nums text-ground-400 w-9 text-right">
                  {opacity}%
                </span>
              </PropertyRow>
            </DesignerPaneContent>
          </DesignerPane>
        </DesignerPanel>
      </DesignerWorkspace>
    </DesignerShell>
  );
}

export const Route = createFileRoute("/designer/shell/")({
  head: () => createCatalogPageHead("/designer/shell/"),
  component: DesignerShellDemo,
});
