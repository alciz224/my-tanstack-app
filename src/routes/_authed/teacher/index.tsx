import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/teacher/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/teacher/"!</div>
}
