import { configDefaults, defineConfig } from "vitest/config";
import { resolve } from "path";

// Resolve workspace packages from source so tests run without a prior build.
const root = resolve(import.meta.dirname);

export default defineConfig({
  resolve: {
    alias: {
      "@hilum/ui": resolve(root, "packages/ui/src/index.ts"),
      "@hilum/app-shell": resolve(root, "packages/app-shell/src/index.ts"),
      "@hilum/designer": resolve(root, "packages/designer/src/index.ts"),
      "@hilum/designer-canvas": resolve(root, "packages/designer-canvas/src/index.ts"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Real-browser tests run separately via `pnpm test:browser` (vitest.browser.config.ts).
    exclude: [...configDefaults.exclude, "**/*.browser.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["packages/*/src/**/*.{ts,tsx}"],
      exclude: [
        "packages/*/src/**/*.test.{ts,tsx}",
        "packages/*/src/**/__tests__/**",
        "packages/*/src/**/*.d.ts",
        "packages/*/src/**/index.ts",
        "packages/*/dist/**",
      ],
      // Enforced by `pnpm test:coverage` (part of `pnpm verify`). Requires the
      // @vitest/coverage-v8 devDependency (same version as vitest).
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
