---
"@hilum/ui": patch
---

Accessibility fixes from an axe audit of every Hilum Shop page and every catalog demo, in light, mid and dark: `Callout` and `Alert` text on their tints, `FileDropzone` as one button, and a dozen smaller contrast, naming, keyboard and target-size fixes.

**Visible changes to check in your app:** tinted `Callout`s (info, success, warning, destructive) and `Alert`s show the description in the regular text colour instead of gray (the title keeps its weight). `Callout` success and warning icon chips are solid lime / butter with a dark icon. `Alert` info is a lighter butter tint and `Alert` warning is the warning surface (butter in light, deep amber in dark). A `StatCard` negative trend pill has dark text with a red arrow. `Calendar` days outside the month are no longer faded, and today is the darker brand text. The mid theme's hover and active washes darken instead of lighten. `FileDropzone`'s `ref` and HTML props now target a `<div>` (was a `<label>`).

- **`Callout` contrast:** the gray description was 4.49:1 on the info tint and 4.39:1 on the success tint in light mode (3.9:1 on destructive, 3.8:1 on info in dark). It now uses the regular foreground on every tinted tone. In the mid theme the pale butter tints (info, warning) are lighter (8%), and the info and destructive icon chips are solid. Icons are at least 3:1 on their chips everywhere (lime and butter icons on their own tint were about 1.1:1).
- **`FileDropzone` is one button.** It was a focusable `role="button"` label wrapped around the focusable file input (axe `nested-interactive`). The drop area is now a plain container (drop target) with one real `<button>` carrying the label. The button is stretched over the area, so a click anywhere still opens the picker, and it is described by the description and the selection chip. Enter and Space work natively. The hidden input is out of the tab order. While loading or disabled the button keeps focus, with `aria-disabled`. New: pasting files (⌘/Ctrl+V) while it has focus selects them.
- **Contrast:**
  - `Alert` variants (muted and red text on the tints, and butter tints under light text in dark mode);
  - `StatCard` trend pills;
  - `Calendar` selected days and range ends (white on the brand; `text-background` was 3.9:1 in dark), today and outside days (`opacity-40` was 1.7:1);
  - the `FileThumbnail` placeholder;
  - `SliderComfortable` resting labels (4.0:1 on the track).
- **Names:**
  - a collapsed `SidebarMenuButton` keeps its label as a visually hidden name (it was `display: none`, leaving icon-only buttons unnamed);
  - `CommandList` is named "Suggestions" unless you pass `aria-label` / `aria-labelledby`;
  - `PropertyRow`'s label is a `<label>` wired like `Field`'s: it targets the first Hilum control and names the others (a Slider and an InputNumber in one row);
  - a `Slider` without a name is labelled by a surrounding `Field` or `PropertyRow`.
- **Keyboard:**
  - `PaginationLink` without `href` renders a `<button>` (an `<a>` without `href` can't be focused), and takes `disabled`; `SearchableTable`'s page controls use it, so they work with the keyboard and its Prev / Next are disabled at the ends;
  - a `ScrollArea` or `Table` container that scrolls, with nothing focusable inside, joins the tab order so it can be scrolled with the keys.
- **Structure and targets:**
  - `CheckboxGroup` rows no longer nest a hidden Radix checkbox inside the row checkbox (`nested-interactive`);
  - `TimePicker` segments are 24×24px targets (WCAG 2.5.8);
  - disabled `InputCopy` and `FileDropzone` are marked `aria-disabled`.
