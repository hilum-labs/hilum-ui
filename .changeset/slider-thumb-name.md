---
"@hilum/ui": patch
---

`Slider` and `SliderComfortable` put `aria-label` / `aria-labelledby` only on the thumb (the `role="slider"` element). In 4.0.0 they were also set on the root `div`, so two elements had the same accessible name.
