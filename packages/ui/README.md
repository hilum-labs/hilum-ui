# @hilum/ui

UI primitives for the Hilum design system — Button, Input, Dialog, Combobox, and 85 components total, plus brand tokens, fonts, and a curated icon set.

## Install

```bash
pnpm add @hilum/ui
```

## Setup

In your app's `globals.css`:

```css
@import "tailwindcss";
@import "@hilum/ui/tokens.css";
@import "@hilum/ui/fonts.css";
```

These imports provide the palette, typography, fonts, light/dark theming and the surface elevation ladder (`bg-surface-1…8`, `shadow-surface-1…8`).

### Tailwind class scanning (`@source`)

Tailwind v4 only generates utilities for class names it finds in scanned files, and it doesn't scan `node_modules` by default.

- **`@hilum/ui`**: `tokens.css` contains `@source "../src";`, resolved relative to the file itself (`node_modules/@hilum/ui/dist/tokens.css` → `node_modules/@hilum/ui/src`, which ships in the package). This only works when your Tailwind build resolves `@import "@hilum/ui/tokens.css"` to the real file, which `@tailwindcss/vite`, `@tailwindcss/postcss` and the CLI all do. If components come out unstyled, add the path yourself (relative to your CSS file):

  ```css
  @source "../node_modules/@hilum/ui/src";
  ```

- **`@hilum/app-shell`, `@hilum/designer`, `@hilum/designer-canvas`**: these don't ship `src`, and `tokens.css` doesn't cover them. Add an `@source` for each one you use, pointing at its `dist`:

  ```css
  @source "../node_modules/@hilum/app-shell/dist";
  @source "../node_modules/@hilum/designer/dist";
  @source "../node_modules/@hilum/designer-canvas/dist";
  ```

In a monorepo with hoisted dependencies, adjust the relative path (for example `../../../node_modules/...`).

## Usage

```tsx
import { Button, Dialog, Input } from "@hilum/ui";
import { ChevronDown, Plus } from "@hilum/ui/icons";
import { tokens } from "@hilum/ui/tokens";

<Button>Click me</Button>;
```

See the live catalog at [ui.hilum.dev](https://ui.hilum.dev) for component docs, props, and examples.

## Brand

Hilum UI ships a fully-fixed brand: vivid purple `#C100F1` primary, pale lemon `#FFF5BF` secondary, lime `#CDEA19` success, and `ground` scale neutrals. No per-app overrides — apps pass through this identity unchanged. See `PLATFORM_PLAN.md` §2.1 D8.

## Design Tokens

Import JS tokens for runtime access:

```ts
import { tokens } from "@hilum/ui/tokens";

tokens.brand.primary; // "#C100F1"
tokens.brand.secondary; // "#FFF5BF"
tokens.ground[500]; // "#737373"
```

## PDF previews (`FileThumbnail`)

PDF thumbnails use pdf.js, which needs a worker script. By default it loads from jsDelivr (matching the installed `pdfjs-dist` version). To self-host (strict CSP, offline apps), set it once at startup, or per component with the `pdfWorkerSrc` prop:

```ts
import { setPdfWorkerSrc } from "@hilum/ui";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url"; // Vite

setPdfWorkerSrc(workerSrc);
```

## Theming

Light/dark mode works automatically via `prefers-color-scheme`. Override explicitly:

```html
<html data-theme="dark">
  <!-- force dark -->
  <html data-theme="light">
    <!-- force light -->
  </html>
</html>
```

## Light / dark

Both modes ship out of the box. `prefers-color-scheme` is respected by default; force a mode by setting `<html data-theme="light">` or `<html data-theme="dark">`.

## Credits

[Fluid Functionalism](https://github.com/mickadesign/fluid-functionalism) by Micka Touillaud.
