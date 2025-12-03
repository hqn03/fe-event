import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/admin/_layout/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/admin/_layout/dashboard"!</div>
}
