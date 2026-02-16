import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/student/')({
    component: StudentDashboard,
})

function StudentDashboard() {
    return (
        <div className="p-4">
            <h2 className="text-white text-xl font-semibold">Student Portal</h2>
            <p className="text-slate-300 mt-2">View your grades and schedule here.</p>
        </div>
    )
}
