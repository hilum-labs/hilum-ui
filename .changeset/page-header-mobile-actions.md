---
"@hilum/app-shell": patch
---

PageHeader actions fill the row on narrow headers. The stacked layout was a two-column grid, so an action alone on its row (like "More actions" under the primary action) came up one gap (8px) short of the primary. It is now a wrapping row where actions grow to fill their line.
