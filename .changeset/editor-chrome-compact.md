---
"@hilum/ui": minor
"@hilum/designer": minor
---

Editor chrome in the compact density tier. `data-density="compact"` (set by `DesignerShell` / `DesignerPanel`, or `<DensityProvider density="compact">`) now gives Figma-style inspector chrome out of the box, replacing app-level CSS override layers:

- **Fields** (Input, Textarea, SearchInput, NativeSelect, InputNumber, ColorInput, the Select trigger) are 24px filled surfaces with a 5px radius and no resting border; hover shows the border, focus turns the field to the background with a ring-coloured border and no halo. Values are 12px, labels 11px. The Select trigger and ColorInput span their row; InputNumber's prefix label is a fixed 22px column (the unit suffix keeps its own width).
- **Tokens:** new `--density-field`, `--density-field-hover` and `--density-divider` vars (`tokens.density.*.field / fieldHover / divider`). Compact subtrees use plain tabular Inter digits and a 1.5px lucide stroke (in the base layer, so hover-stroke utilities still apply).
- **Button:** new `variant="tile"` for pressable preset tiles (quiet fill; pressed via `aria-pressed="true"` or `active` is a background tile with a hairline ring; pass `h-auto compact:h-auto` for content-sized tiles) and `variant="field"` for triggers that read as a field (e.g. a font picker). A pressed `ghost` button (`aria-pressed="true"`) now keeps a subtle fill in the foreground colour. Compact buttons don't wrap (`compact:whitespace-normal` opts back in).
- **Segmented controls:** `ButtonGroup` accepts native div props (`role`, `aria-label`, …) and `ButtonGroupItem` reads `aria-pressed="true"` as active. New `ToggleGroup variant="segmented"` renders the same track and chip. In compact they are a 24px filled track with a white 20px chip; `w-full` stretches the items evenly.
- **Designer:** compact pane titles are sentence case in the foreground colour, group titles sentence case and muted, pane dividers use `--density-divider`. Inline `DesignerPropertyRow`s give a composed `<label>` child the same fixed label column as their own label (72px in compact; `labelWidth` still overrides). The linked-value "All" prefix is no longer forced to upper case. The `DesignerSidebar` active tool is a soft neutral tile instead of a solid black square, and tool icons use a 1.5px stroke.
