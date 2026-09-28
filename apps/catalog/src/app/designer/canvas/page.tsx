import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import {
  Designer,
  DesignerCanvas,
  DesignerFrame,
  type LayerRendererProps,
  type RendererRegistry,
  ActionAddLayer,
  ActionAlign,
  ActionArrange,
  ActionDelete,
  ActionDuplicate,
  ActionTransform,
  ActionUndoRedo,
  ActionZoom,
  ActionTool,
} from "@hilum/designer-canvas";
import { DesignerToolbar, DesignerToolbarSeparator } from "@hilum/designer";
import { Square, Type } from "lucide-react";

/* ---------------- Renderers (app supplies these) ---------------- */

interface RectData {
  fill: string;
}
interface TextData {
  value: string;
  fill: string;
}

function RectRenderer({ layer, ctx }: LayerRendererProps<RectData>) {
  return (
    <div
      className="size-full rounded-md"
      style={{
        background: layer.data.fill,
        outline: ctx.selected ? "2px solid var(--brand-primary)" : undefined,
      }}
    />
  );
}

function TextRenderer({ layer }: LayerRendererProps<TextData>) {
  return (
    <div
      className="size-full flex items-center justify-center px-3 text-center heading"
      style={{ color: layer.data.fill }}
    >
      {layer.data.value}
    </div>
  );
}

const renderers: RendererRegistry = {
  rect: RectRenderer as RendererRegistry["x"],
  text: TextRenderer as RendererRegistry["x"],
};

/* ---------------- Initial state ---------------- */

const initialLayers = [
  {
    id: "l1",
    type: "rect",
    name: "Background",
    x: 60,
    y: 80,
    width: 480,
    height: 320,
    rotation: 0,
    opacity: 1,
    isLocked: false,
    isVisible: true,
    data: { fill: "#FDE086" } as Record<string, unknown>,
  },
  {
    id: "l2",
    type: "rect",
    name: "Accent",
    x: 120,
    y: 140,
    width: 200,
    height: 160,
    rotation: 0,
    opacity: 1,
    isLocked: false,
    isVisible: true,
    data: { fill: "#FF4D01" } as Record<string, unknown>,
  },
  {
    id: "l3",
    type: "text",
    name: "Title",
    x: 80,
    y: 360,
    width: 440,
    height: 60,
    rotation: 0,
    opacity: 1,
    isLocked: false,
    isVisible: true,
    data: { value: "Hilum Designer", fill: "#26181a" } as Record<string, unknown>,
  },
];

const layerTypes = [
  {
    type: "rect",
    label: "Rectangle",
    icon: Square,
    defaultData: { fill: "#FF4D01" },
    defaultSize: { width: 200, height: 120 },
  },
  {
    type: "text",
    label: "Text",
    icon: Type,
    defaultData: { value: "Type something", fill: "#26181a" },
    defaultSize: { width: 300, height: 60 },
  },
];

/* ---------------- Page ---------------- */

function CanvasDemo() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/designer" className="hover:text-foreground">
            Designer
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Canvas demo</span>
        </div>
        <h1 className="display mb-2 text-foreground">Canvas demo</h1>
        <p className="body max-w-2xl text-muted-foreground">
          Live <code className="font-mono">@hilum/designer-canvas</code> surface with draggable
          layers, selection, and toolbar actions.
        </p>
      </div>

      <PageDocs path="/designer/canvas/" />

      <section className="overflow-hidden rounded-2xl border border-border bg-muted shadow-natural">
        <div className="flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <p className="subheading text-foreground">Live canvas preview</p>
            <p className="caption mt-0.5 text-muted-foreground">
              Drag layers, marquee-select, and zoom with Cmd+wheel.
            </p>
          </div>
        </div>

        <div className="relative flex h-[720px] flex-col overflow-hidden">
          <Designer
            initial={{
              layers: initialLayers,
              frameSize: { width: 600, height: 440 },
              layerTypes,
            }}
            renderers={renderers}
          >
            <DesignerCanvas className="bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <DesignerFrame />
              </div>
            </DesignerCanvas>

            <DesignerToolbar boundary="workspace">
              <ActionTool />
              <DesignerToolbarSeparator />
              <ActionAddLayer />
              <DesignerToolbarSeparator />
              <ActionUndoRedo />
              <DesignerToolbarSeparator />
              <ActionAlign />
              <DesignerToolbarSeparator />
              <ActionArrange />
              <DesignerToolbarSeparator />
              <ActionTransform />
              <DesignerToolbarSeparator />
              <ActionDuplicate />
              <ActionDelete />
              <DesignerToolbarSeparator />
              <ActionZoom />
            </DesignerToolbar>
          </Designer>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/designer/canvas/")({
  head: () => createCatalogPageHead("/designer/canvas/"),
  component: CanvasDemo,
});
