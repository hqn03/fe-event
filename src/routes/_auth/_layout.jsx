import Header from '@/components/header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <Header />
    <main><Outlet/></main>
  </div>
}
