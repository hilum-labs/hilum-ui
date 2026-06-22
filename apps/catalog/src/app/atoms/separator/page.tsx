import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/atoms/separator/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/atoms/separator/"!</div>
}
