---
'@hilum/ui': minor
---

Add the **eyebrow / overline / kicker** typescale family.

The existing `label` utility (12px uppercase tracked) was unnamed for the common "small uppercase label above a headline" pattern, so consumers were re-inventing it with `caption font-semibold uppercase tracking-wider` compositions.

New utilities — all share the same CSS (12px Inter 600, uppercase, 0.1em tracking) so consumers can pick the vocabulary that reads best in their context. `eyebrow` is canonical.

- `eyebrow` — canonical name. Use above a heading, on section markers, in cards.
- `eyebrow-sm` — compact 0.625rem variant for badge-sized chips and tiny status pills.
- `overline` — Material parlance alias of `eyebrow`.
- `kicker` — editorial parlance alias of `eyebrow`.
- `label` — kept as alias of `eyebrow` for backwards compatibility.

Catalog (`/foundations`) gains a dedicated "Eyebrow / overline / kicker" section. `llms.txt` updated.
