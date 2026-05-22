import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import {
  Designer,
  DesignerStaticFrame,
  type LayerRendererProps,
  type RendererRegistry,
} from "@hilum/designer-canvas"
import { Card, CardContent } from "@hilum/ui"

interface RectData { fill: string }
interface TextData { value: string; fill: string }

function RectRenderer({ layer }: LayerRendererProps<RectData>) {
  return <div className="size-full rounded-md" style={{ background: layer.data.fill }} />
}

function TextRenderer({ layer }: LayerRendererProps<TextData>) {
  return (
    <div
      className="size-full flex items-center justify-center px-2 text-center caption"
      style={{ color: layer.data.fill }}
    >
      {layer.data.value}
    </div>
  )
}

const renderers: RendererRegistry = {
  rect: RectRenderer as RendererRegistry["x"],
  text: TextRenderer as RendererRegistry["x"],
}

const SAMPLES = [
  {
    title: "Onboarding hero",
    layers: [
      { id: "1", type: "rect", x: 0, y: 0, width: 320, height: 200, data: { fill: "#FDE086" } },
      { id: "2", type: "text", x: 16, y: 84, width: 288, height: 32, data: { value: "Welcome", fill: "#26181a" } },
    ],
  },
  {
    title: "Activity card",
    layers: [
      { id: "1", type: "rect", x: 0, y: 0, width: 320, height: 200, data: { fill: "#ffffff" } },
      { id: "2", type: "rect", x: 12, y: 12, width: 296, height: 4, data: { fill: "#FF4D01" } },
      { id: "3", type: "text", x: 16, y: 32, width: 280, height: 24, data: { value: "Recent activity", fill: "#26181a" } },
    ],
  },
  {
    title: "Brand block",
    layers: [
      { id: "1", type: "rect", x: 0, y: 0, width: 320, height: 200, data: { fill: "#FF4D01" } },
      { id: "2", type: "text", x: 16, y: 80, width: 288, height: 40, data: { value: "Hilum", fill: "#ffffff" } },
    ],
  },
  {
    title: "Success state",
    layers: [
      { id: "1", type: "rect", x: 0, y: 0, width: 320, height: 200, data: { fill: "#CDEA19" } },
      { id: "2", type: "text", x: 16, y: 80, width: 288, height: 40, data: { value: "All systems go", fill: "#26181a" } },
    ],
  },
]

function StaticFrameDemo() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <div className="mb-10">
        <h1 className="display text-ground-900">Static frame</h1>
        <p className="body-lg text-ground-500 mt-3 max-w-2xl">
          <code className="font-mono caption bg-ground-50 px-1.5 py-0.5 rounded">DesignerStaticFrame</code>{" "}
          renders a canvas read-only — no interactivity, no overlays. Use it for dashboard thumbnails, project gallery
          tiles, and PDF previews. The same renderers from your <code className="font-mono caption">RendererProvider</code>{" "}
          drive both interactive and static modes.
        </p>
      </div>

      <PageDocs path="/designer/static-frame/" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {SAMPLES.map((s, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Designer
                initial={{
                  layers: s.layers.map((l) => ({
                    rotation: 0,
                    opacity: 1,
                    isLocked: false,
                    isVisible: true,
                    ...l,
                    data: l.data as Record<string, unknown>,
                  })),
                  frameSize: { width: 320, height: 200 },
                }}
                renderers={renderers}
                readOnly
              >
                <DesignerStaticFrame />
              </Designer>
            </CardContent>
            <div className="px-4 py-3 border-t border-ground-100">
              <p className="caption font-medium text-ground-900">{s.title}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const Route = createFileRoute("/designer/static-frame/")({
  head: () => createCatalogPageHead("/designer/static-frame/"),
  component: StaticFrameDemo,
});
