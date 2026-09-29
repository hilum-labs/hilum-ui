---
"@hilum/ui": patch
"@hilum/designer": patch
---

Inspector grid: Figma-parity editor chrome, phase 1. Released as a patch (4.1.1) at the maintainers' request, although it adds APIs.

- **Grid rows:** new `DesignerPropertyRow layout="grid"`, the Figma inspector row. It has two equal field columns plus a fixed action column (24px in compact density, 32px in default), with the label (the `label` prop or a `<label>` child) spanning the row above. The fields stretch to their cells, overriding the default widths of `InputNumber`, `Select`, `ColorInput`, segmented groups and `Slider`. A row's only field spans both columns. Icon-only `Button` children and the new `action` prop sit centred in the action column. The column is always there, so field edges line up down the panel whether or not a row has an action. A `DesignerPropertyControls` inside a grid row becomes `display: contents`, so its children join the grid; it now carries `data-slot="designer-property-controls"`.
- **`DesignerPropertyField`:** new cell wrapper for grid rows. `span={2}` (or `data-span="2"` on any child) spans both field columns, and `span={1}` keeps a lone field in column 1. A field can hold several controls, such as a group of icon buttons.
- **Pane titles:** `DesignerPaneTitle` is now a header row: the title, then its `action`, then the collapse chevron. The actions are no longer nested inside the title `<button>`. The title button has `aria-expanded`, plus `aria-controls` pointing at `DesignerPaneContent`, which gets a generated `id`. In compact density the leading chevron is hidden and the title sits flush with the field labels. A 24px muted chevron trails the actions; it is pointer-only, since the title button is the accessible control. New `muted` prop for empty or optional sections: a muted, normal-weight title, typically next to a "+" action. Compact pane content now spaces rows 8px apart, and compact stacked rows drop their extra vertical padding.
- **Toolbar and rail:** `DesignerToolbarButton` and `DesignerSidebar` items are 32px (`rounded-md`, 16px icons with a 1.5px stroke) in every density, up from 36px outside compact. The touch sizes are unchanged. `DesignerToolbarSeparator` is 20px tall in every density.
- **Value controls:** the `TwoValueControl` / `FourValueControl` field gap is 8px in compact density too, matching the grid's column gap.
- **Button:** icon-only sizes (`icon`, `icon-xs`, `icon-sm`, `icon-lg`) render `data-icon-only` on the root, including with `asChild`. In compact density they all draw 14px icons.
