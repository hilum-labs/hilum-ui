---
"@hilum/ui": patch
"@hilum/designer": patch
"@hilum/app-shell": patch
---

Compact-scale consistency fixes from an audit of the Pappery editor, a readable secondary `Badge` in the mid and dark themes, and sentence-case sidebar section labels.

**Visible changes to check in your app:** under `data-density="compact"`, `TabsSubtle` tabs (and so `DesignerPanelTabs`) are 24px tall with a 5px radius (they were 26–28px with the shape radius). `DesignerToolbarButton` and `DesignerSidebar` items have a 5px radius (was 6px) in every density. `Badge` `variant="secondary"`, the default solid `Badge` without a `color` and `tone="neutral"` are a neutral gray wash (`foreground` at 7%) with the regular text colour, no longer the `--accent` brand tint: light gray instead of pale purple in light mode, and a faint lighter pill in mid and dark. They are translucent now, so they take the tone of the surface behind them.

- **`TabsSubtle` compact size:** the tab is `h-6` with no vertical padding, and the tab, its selected / hover pill and the focus ring take the compact control radius (5px; the ring sits 2px outside, so 7px). Default density is unchanged.
- **`ColorInput` percent suffix:** 11px in compact density (was 10px), like `InputNumber`'s unit suffix.
- **Toolbar and rail radius:** `DesignerToolbarButton` and `DesignerSidebar` items use `rounded-[5px]`, so editor chrome has one control radius.
- **`Badge` secondary:** the gray badge used `--accent` under `--foreground`. `--accent` is the brand tint, and `createTheme()` sets it on `:root`, which also wins on a `data-theme="mid"` root: white text on a near-white pill (1.03:1) in the mid theme, and a heavy brand-coloured pill in dark. It now uses `bg-foreground/[0.07] text-foreground` (as the secondary `Button` does): 15.6:1 in light, 4.9:1 in mid and 14.3:1 in dark on the page background, and never below 4.9:1 on the card, surface and muted colours. Being classes rather than inline styles, `className` can override them. The tinted variants were already at 4.5:1 or more in every theme and are unchanged.
- **Sentence-case section labels:** `SidebarGroupLabel` takes `variant="plain"` (a medium-weight caption, no uppercase or tracking) next to the default `"eyebrow"`. `AppSidebar`, `AppNavTree` and `AppMobileNav` (its drawer) take `sectionLabelVariant`, and `AppSidebarSection` takes `labelVariant`, so apps no longer need arbitrary selectors to undo the uppercase.
