import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getTestsFn, deleteTestFn } from "@/server.functions/tests.functions";
import type { TestDoc } from "@/lib/types";

export const Route = createFileRoute("/admin/tests/")({
  component: TestsList,
});

function TestsList() {
  const [tests, setTests] = useState<TestDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getTestsFn();
      setTests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this test? Submissions will remain orphaned in Firestore.")) return;
    await deleteTestFn({ data: { testId: id } });
    load();
  };

  const now = Date.now();
  const statusLabel = (t: TestDoc) => {
    if (now < t.startAt) return { text: "Upcoming", cls: "bg-slate-200 text-slate-700" };
    if (now < t.endAt) return { text: "Active", cls: "bg-emerald-100 text-emerald-700" };
    return { text: "Ended", cls: "bg-slate-100 text-slate-500" };
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Tests</h1>
        <Link to="/admin/tests/new" className="btn-primary">
          + New test
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading…</p>
      ) : tests.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No tests yet. Create one to get started.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {tests.map((t) => {
            const s = statusLabel(t);
            return (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900">{t.title}</p>
                    <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + s.cls}>
                      {s.text}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(t.startAt).toLocaleString()} → {new Date(t.endAt).toLocaleString()} ·{" "}
                    {t.questions?.length ?? 0} questions
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/admin/tests/$testId/results"
                    params={{ testId: t.id! }}
                    className="btn-secondary"
                  >
                    Results
                  </Link>
                  <button onClick={() => onDelete(t.id!)} className="btn-danger">
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
