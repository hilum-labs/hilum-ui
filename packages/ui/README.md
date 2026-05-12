# @hilum/ui

UI primitives for the Hilum design system — Button, Input, Dialog, Combobox, and ~65 other components, plus brand tokens, fonts, and a curated icon set.

## Install

```bash
pnpm add @hilum/ui
```

## Setup

In your app's `globals.css`:

```css
@import "tailwindcss";
@import "@hilum/ui/tokens.css";

@source "../../node_modules/@hilum/ui/src";
```

That's the whole setup — palette, typography, fonts, and light/dark theming are all imported in those three lines.

## Usage

```tsx
import { Button, Dialog, Input } from "@hilum/ui"
import { ChevronDown, Plus } from "@hilum/ui/icons"
import { tokens } from "@hilum/ui/tokens"

<Button>Click me</Button>
```

See the live catalog at [ui.hilum.dev](https://ui.hilum.dev) for component docs, props, and examples.

## Brand

Hilum UI ships a fully-fixed brand: `--brand-orange` primary, `--brand-lime` success, `--brand-yellow` warning, taupe scale neutrals. No per-app overrides — apps pass through this identity unchanged. See `PLATFORM_PLAN.md` §2.1 D8.

## Light / dark

Both modes ship out of the box. `prefers-color-scheme` is respected by default; force a mode by setting `<html data-theme="light">` or `<html data-theme="dark">`.
