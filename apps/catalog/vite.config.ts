import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwind(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
      },
      router: {
        routesDirectory: "app",
        generatedRouteTree: "routeTree.gen.ts",
        indexToken: "page",
      },
    }),
    react(),
  ],
  server: {
    port: 3000,
  },
})
