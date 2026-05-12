import { Link } from "react-router-dom"
import { ArrowRight, Frame, MousePointer2, Image, Layers } from "lucide-react"
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hilum/ui"

const SUBSECTIONS = [
  {
    href: "/designer/shell",
    title: "Shell",
    description:
      "DesignerShell, Header, Sidebar, Panel, Pane, Toolbar — engine-agnostic chrome.",
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
    description:
      "Interactive demo of DesignerPane.showFor with multiple layer types selected.",
    icon: Layers,
    package: "@hilum/designer",
  },
]

export default function DesignerIndex() {
  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <div className="mb-10">
        <p className="caption-xs uppercase tracking-wider font-semibold text-taupe-400">
          Section
        </p>
        <h1 className="display text-taupe-900 mt-1">Designer</h1>
        <p className="body-lg text-taupe-500 mt-3 max-w-2xl">
          Composable canvas-editor primitives. The chrome lives in{" "}
          <code className="caption font-mono bg-taupe-50 px-1.5 py-0.5 rounded text-taupe-900">@hilum/designer</code>{" "}
          (engine-agnostic) and the canvas engine in{" "}
          <code className="caption font-mono bg-taupe-50 px-1.5 py-0.5 rounded text-taupe-900">@hilum/designer-canvas</code>{" "}
          (generic free-positioned canvas with a pluggable renderer registry).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUBSECTIONS.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.href} to={s.href} className="group">
              <Card className="h-full transition-all hover:shadow-natural">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex size-9 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
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
                  <span className="caption text-brand-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open <ArrowRight size={12} />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
