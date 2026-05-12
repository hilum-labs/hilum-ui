import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  external: ['react', 'react-dom', '@hilum/ui', '@hilum/designer'],
  sourcemap: true,
  clean: true,
  treeshake: true,
})
