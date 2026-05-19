import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

// Resolve workspace packages from source so tests run without a prior build.
const root = resolve(import.meta.dirname)

export default defineConfig({
  resolve: {
    alias: {
      '@hilum/ui': resolve(root, 'packages/ui/src/index.ts'),
      '@hilum/app-shell': resolve(root, 'packages/app-shell/src/index.ts'),
      '@hilum/designer': resolve(root, 'packages/designer/src/index.ts'),
      '@hilum/designer-canvas': resolve(root, 'packages/designer-canvas/src/index.ts'),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: [
        'packages/*/src/**/*.{ts,tsx}',
      ],
      exclude: [
        'packages/*/src/**/*.test.{ts,tsx}',
        'packages/*/src/**/index.ts',
        'packages/*/dist/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
})
