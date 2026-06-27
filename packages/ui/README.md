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

That's the whole setup — palette, typography, fonts, light/dark theming, and Tailwind class scanning are handled by these imports.

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
