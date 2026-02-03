import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/unauthorized')({
  component: Unauthorized,
})

function Unauthorized() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-white text-2xl font-bold">Unauthorized</h2>
      <p className="text-slate-300 mt-2">You do not have permission to view this page.</p>
    </div>
  )
}
