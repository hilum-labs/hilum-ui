# @hilum/designer-canvas

## 3.9.0

### Minor Changes

- Editor-grade visual pass and fixes.
  - New compact density tier (`data-density="compact"` / `DensityProvider`): 24px controls, 28px rows, 12px text. `DesignerShell` and `DesignerPanel` default to compact; pass `density="default"` to opt out.
  - Define `surface-1..8` elevation tokens plus `hover`, `active`, `canvas`, `border-strong` and checker tokens. Stronger light (#e5e5e5) and dark (#4a4a4a) borders. The global border-color rule now lives in the base layer so `border-*` utilities apply.
  - Slider filled range and thumb; color picker alpha track, field chrome, preset grid and disabled state; InputNumber tabular numerals, label-as-scrub-handle `label` prop, compact steppers.
  - Consistent primary/secondary button semantics across themes; working outline/ghost/brand variants; uniform 2px focus rings.
  - Fixes: AskUserQuestions hook-order crash, Tooltip/FileThumbnail hook order, CanvasProvider revision/onChange.
  - A11y: MenuItem `type` prop (menuitem/radio/checkbox), CommandPalette title, arrow-key navigation and `onNavigate`, Combobox id/name/disabled/aria/ref support.
  - Packaging: `types` first in exports, `./package.json` export, `"use client"` banners on component entries, `sideEffects: false`, `lucide-react` required peer for app-shell/designer-canvas, configurable pdf.js `workerSrc`.

## 3.8.6

### Patch Changes

- Automated AWS CodeCommit patch release from e2326ac.

## 3.8.5

### Patch Changes

- Automated AWS CodeCommit patch release from 57a07f0.

## 3.8.4

### Patch Changes

- Automated AWS CodeCommit patch release from 7356988.

## 3.8.3

### Patch Changes

- Automated AWS CodeCommit patch release from 147b990.

## 3.8.2

### Patch Changes

- Automated AWS CodeCommit patch release from eba58b6.

## 3.8.1

### Patch Changes

- Automated AWS CodeCommit patch release from 3241174.

## 3.8.0

## 3.7.1

## 3.7.0

## 3.6.12

## 3.6.11

## 3.6.10

## 3.6.9

## 3.6.8

## 3.6.7

## 3.6.6

## 3.6.5

## 3.6.4

## 3.6.3

## 3.6.2

## 3.6.1

## 3.6.0

## 3.5.4

## 3.5.3

## 3.5.2

## 3.5.1

## 3.5.0

## 3.4.0

### Minor Changes

- 96bd6ec: Add compact two-value and four-value designer controls for dense inspector panels.

  `@hilum/ui` InputNumber now supports mixed values and live commit-on-change behavior for editor controls.

## 3.3.4

### Patch Changes

- @hilum/ui@3.3.4
- @hilum/designer@3.3.4

## 3.3.3

### Patch Changes

- @hilum/ui@3.3.3
- @hilum/designer@3.3.3

## 3.3.2

### Patch Changes

- @hilum/ui@3.3.2
- @hilum/designer@3.3.2

## 3.3.1

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.3.1
  - @hilum/designer@3.3.1

## 3.3.0

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.3.0
  - @hilum/designer@3.3.0

## 3.2.14

### Patch Changes

- Improve AppStatusBanner mobile layout so actions stack below the message instead of squeezing banner copy.
- Updated dependencies
  - @hilum/ui@3.2.14
  - @hilum/designer@3.2.14

## 3.2.13

### Patch Changes

- @hilum/ui@3.2.13
- @hilum/designer@3.2.13

## 3.2.12

### Patch Changes

- @hilum/ui@3.2.12
- @hilum/designer@3.2.12

## 3.2.11

### Patch Changes

- Updated dependencies [aa3c2db]
  - @hilum/ui@3.2.11
  - @hilum/designer@3.2.11

## 3.2.10

### Patch Changes

- Updated dependencies [0dd03fd]
  - @hilum/ui@3.2.10
  - @hilum/designer@3.2.10

## 3.2.9

### Patch Changes

- Updated dependencies [ba1614b]
  - @hilum/ui@3.2.9
  - @hilum/designer@3.2.9

## 3.2.8

### Patch Changes

- Updated dependencies [9de7762]
  - @hilum/designer@3.2.8
  - @hilum/ui@3.2.8

## 3.2.7

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.2.7
  - @hilum/designer@3.2.7

## 3.2.6

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.2.6
  - @hilum/designer@3.2.6

## 3.2.5

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.2.5
  - @hilum/designer@3.2.5

## 3.2.4

### Patch Changes

- Updated dependencies
  - @hilum/designer@3.2.4
  - @hilum/ui@3.2.4

## 3.2.3

### Patch Changes

- Updated dependencies [9a27459]
  - @hilum/designer@3.2.3
  - @hilum/ui@3.2.3

## 3.2.2

### Patch Changes

- Updated dependencies [6610a27]
  - @hilum/ui@3.2.2
  - @hilum/designer@3.2.2

## 3.2.1

### Patch Changes

- Updated dependencies [48ddf55]
  - @hilum/ui@3.2.1
  - @hilum/designer@3.2.1

## 3.2.0

### Patch Changes

- Updated dependencies [b020e15]
- Updated dependencies [147ef45]
  - @hilum/ui@3.2.0
  - @hilum/designer@3.2.0

## 3.1.2

### Patch Changes

- Updated dependencies [421a631]
  - @hilum/ui@3.1.2
  - @hilum/designer@3.1.2

## 3.1.1

### Patch Changes

- f04ade5: Widen lucide-react peer compatibility to support dashboard apps using newer 0.x releases such as 0.542.x.
- Updated dependencies [f04ade5]
  - @hilum/ui@3.1.1
  - @hilum/designer@3.1.1

## 3.1.0

### Patch Changes

- Updated dependencies [784078f]
  - @hilum/ui@3.1.0
  - @hilum/designer@3.1.0

## 3.0.0

### Patch Changes

- Updated dependencies [e1b6340]
  - @hilum/ui@3.0.0
  - @hilum/designer@3.0.0

## 2.1.2

### Patch Changes

- Reduce AccountMenu sizing so it reads as a dropdown instead of a large account panel.
- Updated dependencies
  - @hilum/ui@2.1.2
  - @hilum/designer@2.1.2

## 2.1.1

### Patch Changes

- Restyle AccountMenu to use the standard light dropdown/card surface and foreground tokens.
- Updated dependencies
  - @hilum/ui@2.1.1
  - @hilum/designer@2.1.1

## 2.1.0

### Minor Changes

- Add reusable account menu primitives for profile dropdowns.

### Patch Changes

- Updated dependencies
  - @hilum/ui@2.1.0
  - @hilum/designer@2.1.0

## 2.0.4

### Patch Changes

- Updated dependencies
  - @hilum/designer@2.0.4
  - @hilum/ui@2.0.4

## 2.0.3

### Patch Changes

- Updated dependencies [af5108e]
  - @hilum/designer@2.0.3
  - @hilum/ui@2.0.3

## 2.0.2

### Patch Changes

- Updated dependencies [51cd5e0]
  - @hilum/ui@2.0.2
  - @hilum/designer@2.0.2

## 2.0.1

### Patch Changes

- Updated dependencies [8a8961c]
  - @hilum/ui@2.0.1
  - @hilum/designer@2.0.1

## 2.0.0

### Patch Changes

- Updated dependencies [eb7a2bb]
  - @hilum/ui@2.0.0
  - @hilum/designer@2.0.0

## 1.0.1

### Patch Changes

- Updated dependencies [842ee65]
  - @hilum/ui@1.0.1
  - @hilum/designer@1.0.1

## 1.0.0

### Patch Changes

- Updated dependencies [a35d39b]
  - @hilum/ui@1.0.0
  - @hilum/designer@1.0.0

## 0.1.5

### Patch Changes

- Updated dependencies [29977b5]
  - @hilum/ui@0.1.5
  - @hilum/designer@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies [5166c27]
  - @hilum/ui@0.1.4
  - @hilum/designer@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies [7b82093]
  - @hilum/ui@0.1.3
  - @hilum/designer@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [cfe6bec]
  - @hilum/ui@0.1.2
  - @hilum/designer@0.1.2

## 0.1.1

### Patch Changes

- 9b21b57: Fix npm packaging and release metadata, add MIT licensing, tighten published files, and document the blocks CLI.
- Updated dependencies [9b21b57]
  - @hilum/ui@0.1.1
  - @hilum/designer@0.1.1
