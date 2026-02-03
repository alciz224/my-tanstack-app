import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  component: AuthedHome,
})

function AuthedHome() {
  // Access user from parent loader via useLoaderData
  // In TanStack Router v1, we can use useMatch to get parent loader data
  // But here we keep it simple and just render a message
  return (
    <div className="p-4">
      <h2 className="text-white text-xl font-semibold">Welcome to the protected area</h2>
      <p className="text-slate-300 mt-2">You're authenticated.</p>
    </div>
  )
}
