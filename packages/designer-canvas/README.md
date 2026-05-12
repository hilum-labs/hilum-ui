# @hilum/designer-canvas

Generic free-positioned canvas engine for Hilum apps. Pluggable Layer model, pan/zoom viewport, drag/resize/marquee interactions, snap guides, and a curated set of 49 generic actions (alignment, z-order, opacity, fill, transform, etc.).

The package ships **no concrete renderers** — apps register their own via the renderer registry. Advanced features (text-on-paths, custom warps, font registries, thumbnails) are exposed through optional injected services (`PathService`, `FontService`).

```tsx
import { CanvasProvider, DesignerCanvas, DesignerFrame } from "@hilum/designer-canvas"
import { GeometryService, FontService } from "@/services"

<CanvasProvider
  defaultLayers={layers}
  frameSize={{ width: 800, height: 600 }}
  services={{ paths: GeometryService, fonts: FontService }}
  renderers={{ rect: RectRenderer, text: TextRenderer }}
>
  <DesignerCanvas>
    <DesignerFrame />
  </DesignerCanvas>
</CanvasProvider>
```

## Architecture

- **State:** generic `Layer<TData>` shape with first-class typed geometry (x, y, width, height, rotation, opacity). Apps narrow `data` for their kind.
- **Selection / tool / history:** delegated to `@hilum/designer`'s ShellContext.
- **Actions:** 49 generic ones bundled (alignment, z-order, opacity, fill, transform, etc.). 6 require small abstractions (unit converter, font provider, image upload).
- **Services:** optional. Pappery injects WASM-backed `PathService` and `FontService`; apps without them use the no-op fallbacks.

See `PHASE_0_AUDIT.md` §P0.6 for the service interface and §P0.4 for the Layer shape.
