# @hilum/ui

UI primitives for the Hilum design system — Button, Input, Dialog, Combobox, and 118 component modules total (112 on the main entry, 6 AI/chat modules on `@hilum/ui/ai`), plus brand tokens, fonts, and a curated icon set.

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

## Entry points

| Import                                        | Contents                                                                                                                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@hilum/ui`                                   | Components, providers, hooks and utilities (`cn`, `HilumProvider`, `LinkProvider`, `IconProvider`, …). Marked `"use client"`.                                                          |
| `@hilum/ui/ai`                                | AI / chat surfaces: `AskUserQuestions`, `ChatMessage`, `InputMessage`, `ThinkingIndicator`, `ThinkingSteps`, `UrlRedirectPrompt`.                                                      |
| `@hilum/ui/form`                              | react-hook-form bindings: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`. Requires the optional peer `react-hook-form`. |
| `@hilum/ui/icon-libraries`                    | Alternative icon sets for `IconProvider` (`iconLibraries`, `phosphorIcons`, `tablerIcons`, `hugeiconsIcons`, `untitleduiIcons`). Requires the matching optional icon peers.            |
| `@hilum/ui/icons`                             | Curated lucide re-exports. Server-safe.                                                                                                                                                |
| `@hilum/ui/tokens`                            | JS design tokens. Server-safe.                                                                                                                                                         |
| `@hilum/ui/create-theme`                      | `createTheme`, `applyTheme`, `ThemeProvider`.                                                                                                                                          |
| `@hilum/ui/tokens.css`, `@hilum/ui/fonts.css` | Stylesheets (see Setup).                                                                                                                                                               |

### AI components (`@hilum/ui/ai`)

Since 4.0 the conversational components ship from their own subpath, so apps without a chat UI don't bundle them:

```tsx
import { ChatMessage, InputMessage, ThinkingIndicator } from "@hilum/ui/ai";
```

Migrating from 3.x: move `AskUserQuestions`, `ChatMessage`, `InputMessage`, `ThinkingIndicator`, `ThinkingSteps` (and its `ThinkingStep*` parts), `UrlRedirectPrompt` (and `hasUrlHandleChanged` / `normalizeUrlHandle` / `urlResourcePath`), plus their prop types, from `@hilum/ui` to `@hilum/ui/ai`. Their user-facing strings can be localized with a `labels` prop (English defaults are exported, e.g. `INPUT_MESSAGE_DEFAULT_LABELS`).

### Forms (`@hilum/ui/form`)

```tsx
import { useForm } from "react-hook-form";
import { Input } from "@hilum/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@hilum/ui/form";

const form = useForm({ defaultValues: { email: "" } });

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>;
```

### Icon libraries (`@hilum/ui/icon-libraries`)

The main entry only depends on `lucide-react`. To let components render another icon set, install its package and register it:

```tsx
import { IconProvider } from "@hilum/ui";
import { phosphorIcons } from "@hilum/ui/icon-libraries";

<IconProvider libraries={{ phosphor: phosphorIcons }} defaultLibrary="phosphor">
  <App />
</IconProvider>;
```

## Providers

All providers are optional; components work without them.

### `HilumProvider` (reduced motion)

Hilum components follow the OS `prefers-reduced-motion` setting by default (movement becomes instant; opacity and colour still fade). Wrap your app in `HilumProvider` to change the policy or to extend it to your own framer-motion animations:

```tsx
import { HilumProvider } from "@hilum/ui";

<HilumProvider reducedMotion="user">
  {/* "user" (default) | "always" | "never" */}
  <App />
</HilumProvider>;
```

`MotionProvider` is an alias. `usePrefersReducedMotion()` returns the effective setting for imperative animations.

### `LinkProvider` (client-side routing)

Components that render links (breadcrumbs, nav items, pagination, …) use a plain `<a>` by default. Inject your router's link so they navigate client-side:

```tsx
import { LinkProvider } from "@hilum/ui";
import { Link } from "@tanstack/react-router";

<LinkProvider value={({ href, ...rest }) => <Link to={href} {...rest} />}>
  <App />
</LinkProvider>;
```

(`@hilum/app-shell`'s `<AppShell linkComponent={Link}>` sets this for you.)

### `DensityProvider` (editor chrome)

`<DensityProvider density="compact">` (or `data-density="compact"` on any element) switches the subtree to the editor-chrome tier used by `@hilum/designer` panels: 24px filled fields with no resting border (hover shows the border, focus the ring colour), 11px labels and 12px values with tabular digits, 1.5px icon strokes, and a 24px segmented track for `ButtonGroup` and `ToggleGroup variant="segmented"`. Components opt in with the `compact:` Tailwind variant; the `--density-*` vars (`--density-field`, `--density-divider`, …) are there for bespoke controls.

Editor-oriented Button variants: `variant="tile"` for pressable preset tiles (pressed via `aria-pressed` or `active`; pass `h-auto compact:h-auto` for content-sized tiles) and `variant="field"` for triggers that read as a field (e.g. a font picker).

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
