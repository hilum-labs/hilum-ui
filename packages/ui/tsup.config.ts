import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    icons: 'src/icons.ts',
    tokens: 'src/tokens/tokens.ts',
    'create-theme': 'src/tokens/create-theme.tsx',
  },
  format: ['esm'],
  // Inline external types from vaul + radix into the .d.ts so consumers in
  // pnpm-strict layouts don't need to traverse .pnpm/ paths (avoids TS2742).
  dts: {
    resolve: ['vaul', '@radix-ui/react-dialog', '@radix-ui/react-context'],
  },
  external: ['react', 'react-dom'],
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: true,
  // Keep the package entry framework-agnostic. Do not inject framework-
  // specific entrypoint directives into the published bundle.
})
