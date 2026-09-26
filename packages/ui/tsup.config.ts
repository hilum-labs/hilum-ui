import { defineConfig } from 'tsup'
import { prependUseClient } from '../../scripts/use-client-banner.mjs'

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
  // Preserve the components' "use client" boundary in the bundle. esbuild
  // drops per-module directives when bundling, so RSC frameworks (Next.js app
  // router, TanStack Start server components, …) would otherwise treat the
  // main entry as server code and crash on hooks. The directive is inert for
  // plain React/Vite/Electron consumers (Vite ignores it).
  //
  // Only the component entry gets it: `tokens`, `create-theme` and `icons`
  // (pure data / pure functions / lucide re-exports) must stay importable from
  // server code, and the shared chunk they import from must not be marked.
  async onSuccess() {
    await prependUseClient(['dist/index.js'])
  },
})
