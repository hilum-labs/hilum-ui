import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import Pages from 'vite-plugin-pages'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    tailwind(),
    // Next-style file-based routing: src/app/**/page.tsx → routes
    // Folder names map to URL segments; [slug] → :slug.
    Pages({
      dirs: [{ dir: 'src/app', baseRoute: '' }],
      extensions: ['tsx'],
      importMode: 'async',
      routeStyle: 'next',
      exclude: ['**/components/**', '**/layout.tsx'],
      // vite-plugin-pages treats `page.tsx` as a literal path segment `/page`.
      // This remaps it to an index route so `atoms/page.tsx` → `/atoms`.
      extendRoute(route, parent) {
        if (route.path === 'page') {
          if (parent) return { path: undefined, index: true }
          return { path: '/' }
        }
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    sourcemap: true,
  },
})
