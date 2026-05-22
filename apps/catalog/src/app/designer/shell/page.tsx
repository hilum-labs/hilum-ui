import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { useState } from "react"
import {
  MousePointer2,
  Hand,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  ChevronsUpDown,
} from "lucide-react"
import {
  DesignerShell,
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
} from "@hilum/designer"
import { Button, Input, Label, PropertyRow, InputNumber, ColorInput, Slider } from "@hilum/ui"

const TOOLS = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "hand", label: "Pan", icon: Hand },
  { id: "text", label: "Text", icon: Type },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "rect", label: "Rectangle", icon: Square },
  { id: "ellipse", label: "Ellipse", icon: Circle },
]

function DesignerShellDemo() {
  return (
    <div className="h-screen">
      <ShellProvider initialSelectedIds={["demo-1"]} initialTool="select" resolveKind={() => "text"}>
        <Demo />
      </ShellProvider>
    </div>
  )
}

function Demo() {
  const { activeTool, setActiveTool } = useShellContext()
  const [opacity, setOpacity] = useState(80)
  const [x, setX] = useState(120)
  const [y, setY] = useState(80)
  const [width, setWidth] = useState(320)
  const [height, setHeight] = useState(180)
  const [fill, setFill] = useState("#FFE9D6")

  return (
    <DesignerShell>
      <DesignerHeader
        left={
          <>
            <div className="flex size-6 items-center justify-center rounded-md bg-ground-900">
              <span className="caption-xs font-bold text-white">H</span>
            </div>
            <span className="caption font-semibold text-ground-900">Untitled design</span>
            <span className="caption-xs text-ground-300">/</span>
            <span className="caption text-ground-500">Demo workspace</span>
          </>
        }
        center={<span className="caption text-ground-400">Edited just now</span>}
        right={
          <>
            <Button variant="ghost" size="sm">Share</Button>
            <Button size="sm">Publish</Button>
          </>
        }
      />

      <div className="flex flex-1 min-h-0">
        <DesignerSidebar
          items={TOOLS.map((t) => ({
            id: t.id,
            label: t.label,
            icon: t.icon,
            active: activeTool === t.id,
            onClick: () => setActiveTool(t.id),
          }))}
        />

        <main className="flex-1 bg-ground-100 flex items-center justify-center">
          <div className="size-[420px] bg-white shadow-elevated rounded-md flex items-center justify-center">
            <span className="caption text-ground-400">Canvas surface</span>
          </div>
          <DesignerToolbar>
            <DesignerToolbarGroup>
              <DesignerToolbarButton label="Undo" shortcut="⌘Z" onClick={() => {}}>
                <span className="caption-xs">↶</span>
              </DesignerToolbarButton>
              <DesignerToolbarButton label="Redo" shortcut="⇧⌘Z" onClick={() => {}}>
                <span className="caption-xs">↷</span>
              </DesignerToolbarButton>
            </DesignerToolbarGroup>
            <DesignerToolbarSeparator />
            <DesignerToolbarGroup>
              <DesignerToolbarButton label="Zoom out" onClick={() => {}}>
                <span className="caption-xs">−</span>
              </DesignerToolbarButton>
              <DesignerToolbarButton label="Reset zoom" onClick={() => {}}>
                <span className="caption-xs tabular-nums">100%</span>
              </DesignerToolbarButton>
              <DesignerToolbarButton label="Zoom in" onClick={() => {}}>
                <span className="caption-xs">+</span>
              </DesignerToolbarButton>
            </DesignerToolbarGroup>
          </DesignerToolbar>
        </main>

        <DesignerPanel side="right" width={260}>
          <DesignerPane>
            <DesignerPaneTitle>Layer</DesignerPaneTitle>
            <DesignerPaneContent>
              <Label htmlFor="layer-name" className="caption text-ground-500">Name</Label>
              <Input id="layer-name" defaultValue="Hero text" />
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
                <span className="caption-xs tabular-nums text-ground-400 w-9 text-right">{opacity}%</span>
              </PropertyRow>
            </DesignerPaneContent>
          </DesignerPane>
        </DesignerPanel>
      </div>
    </DesignerShell>
  )
}

export const Route = createFileRoute("/designer/shell/")({
  head: () => createCatalogPageHead("/designer/shell/"),
  component: DesignerShellDemo,
});
