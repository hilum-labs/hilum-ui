import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  external: ['react', 'react-dom', '@hilum/ui'],
  sourcemap: true,
  clean: true,
  treeshake: true,
})
