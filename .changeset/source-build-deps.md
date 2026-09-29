---
"@hilum/ui": patch
---

Apps that build from the published `src` (for per-route code splitting) build again. 4.4.0 moved `sonner` and `vaul` to dev dependencies because the dist bundles them with their `<style>` injection removed, but `src/components/sonner.tsx` and `drawer.tsx` still import them, so those builds failed to resolve `vaul`. Both are regular dependencies again; the dist is unchanged and still injects nothing. A test now checks that every runtime import in the published `src` is a dependency or peer dependency.
