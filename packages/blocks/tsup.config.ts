import { readFileSync } from "fs";
import { defineConfig } from "tsup";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")) as {
  version: string;
};

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  banner: { js: "#!/usr/bin/env node" },
  sourcemap: true,
  clean: true,
  treeshake: true,
  // Baked into the bundle so `hilum --version` reports the published version.
  define: { __HILUM_BLOCKS_VERSION__: JSON.stringify(pkg.version) },
});
