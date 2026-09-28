import { defineConfig } from "tsup";
import { prependUseClient } from "../../scripts/use-client-banner.mjs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  external: ["react", "react-dom", "@hilum/ui", "@hilum/designer"],
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Every export is a client component/hook: keep the "use client" boundary
  // that esbuild strips from the per-file directives when bundling (inert
  // outside RSC frameworks). Single entry, no shared chunks.
  async onSuccess() {
    await prependUseClient(["dist/index.js"]);
  },
});
