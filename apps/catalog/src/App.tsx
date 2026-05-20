import { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import { Sidebar } from './components/catalog/sidebar'
import { Toaster } from '@hilum/ui'

export function App() {
  return (
    <div className="flex min-h-screen bg-white text-ground-900 antialiased">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<div className="p-8 caption text-ground-500">Loading…</div>}>
          {useRoutes(routes)}
        </Suspense>
      </main>
      <Toaster />
    </div>
  )
}
