import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ADMIN_CODE } from "@/lib/firebase";

export const Route = createFileRoute("/admin")({
  component: AdminShell,
});

function AdminShell() {
  const { isAdmin, setAdmin } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-md">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">← Back to home</Link>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Admin Access</h1>
          <p className="mt-1 text-sm text-slate-600">Enter the shared management code.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (code === ADMIN_CODE) {
                setAdmin(true);
              } else {
                setError("Incorrect code.");
              }
            }}
            className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <input
              type="password"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input"
              placeholder="Admin code"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full">Enter</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <nav className="flex items-center gap-5 text-sm">
            <Link to="/admin" className="font-semibold text-slate-900">Admin</Link>
            <Link to="/admin/tests" className="text-slate-600 hover:text-slate-900">Tests</Link>
            <Link to="/admin/students" className="text-slate-600 hover:text-slate-900">Students</Link>
          </nav>
          <button
            onClick={() => { setAdmin(false); navigate({ to: "/" }); }}
            className="btn-ghost"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
