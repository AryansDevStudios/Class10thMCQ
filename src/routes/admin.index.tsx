import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Management Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/tests"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-400"
        >
          <h2 className="text-lg font-semibold">Tests</h2>
          <p className="text-sm text-slate-600">
            Create tests, schedule windows, view live results.
          </p>
        </Link>
        <Link
          to="/admin/students"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-400"
        >
          <h2 className="text-lg font-semibold">Students</h2>
          <p className="text-sm text-slate-600">View registrations and reset passwords.</p>
        </Link>
      </div>
    </div>
  );
}
