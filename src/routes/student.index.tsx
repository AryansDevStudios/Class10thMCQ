import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db, FIREBASE_CONFIGURED } from "@/lib/firebase";
import { useAuth } from "@/lib/auth";
import { useServerNow } from "@/lib/server-time";
import type { Submission, TestDoc } from "@/lib/types";
import { StudentResultView } from "@/components/StudentResultView";
import { regradeSubmission, type Graded } from "@/lib/pdf-report";

export const Route = createFileRoute("/student/")({
  component: StudentHome,
});

type TabKey = "live" | "upcoming" | "past";

function StudentHome() {
  const { student, logoutStudent } = useAuth();
  const navigate = useNavigate();
  const { now } = useServerNow(1000);
  const [tests, setTests] = useState<TestDoc[]>([]);
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("live");
  const [viewing, setViewing] = useState<{ test: TestDoc; graded: Graded } | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    if (!student) {
      navigate({ to: "/student/login" });
      return;
    }
    if (!FIREBASE_CONFIGURED) {
      setLoading(false);
      return;
    }
    (async () => {
      const snap = await getDocs(query(collection(db(), "tests"), orderBy("startAt", "desc")));
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as TestDoc) }));
      setTests(list);
      const results = await Promise.all(
        list.map(async (t) => {
          try {
            const sub = await getDoc(doc(db(), "tests", t.id!, "submissions", student.srNo));
            return sub.exists() && (sub.data() as any).submittedAt ? t.id! : null;
          } catch { return null; }
        })
      );
      setSubmittedIds(new Set(results.filter((x): x is string => !!x)));
      setLoading(false);
    })();
  }, [student, navigate]);

  const openResult = async (t: TestDoc) => {
    if (!student) return;
    setViewLoading(true);
    try {
      const sub = await getDoc(doc(db(), "tests", t.id!, "submissions", student.srNo));
      if (!sub.exists()) return;
      const graded = regradeSubmission(sub.data() as Submission, t);
      setViewing({ test: t, graded });
    } finally {
      setViewLoading(false);
    }
  };

  if (!student) return null;

  const live = tests.filter((t) => now >= t.startAt && now < t.endAt);
  const upcoming = tests.filter((t) => now < t.startAt);
  const past = tests.filter((t) => now >= t.endAt);

  const groups: Record<TabKey, { label: string; items: TestDoc[]; empty: string }> = {
    live: { label: `Live now (${live.length})`, items: live, empty: "No tests are live right now. Check back at the scheduled start time." },
    upcoming: { label: `Upcoming (${upcoming.length})`, items: upcoming, empty: "No upcoming tests scheduled." },
    past: { label: `Past (${past.length})`, items: past, empty: "You have no past tests yet." },
  };
  const current = groups[tab];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <div>
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-800">← Home</Link>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Welcome, {student.name}</h1>
            <p className="text-sm text-slate-600">Sr. No. {student.srNo} · Class 10-{student.section}</p>
          </div>
          <button onClick={() => { logoutStudent(); navigate({ to: "/" }); }} className="btn-ghost">
            Log out
          </button>
        </header>

        <div className="mt-8 flex gap-2 border-b border-slate-200">
          {(["live", "upcoming", "past"] as TabKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={
                "px-4 py-2 text-sm font-medium transition border-b-2 -mb-px " +
                (tab === k
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-800")
              }
            >
              {groups[k].label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : current.items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm text-slate-600">{current.empty}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {current.items.map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div>
                    <p className="font-medium text-slate-900">{t.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(t.startAt).toLocaleString()} → {new Date(t.endAt).toLocaleString()}
                    </p>
                  </div>
                  {tab === "live" && !submittedIds.has(t.id!) && (
                    <Link to="/student/test/$testId" params={{ testId: t.id! }} className="btn-primary">
                      Start test · {fmtRemaining(t.endAt - now)}
                    </Link>
                  )}
                  {tab === "live" && submittedIds.has(t.id!) && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                      ✓ Already submitted
                    </span>
                  )}
                  {tab === "upcoming" && (
                    <span className="text-sm text-slate-500">Not yet open</span>
                  )}
                  {tab === "past" && submittedIds.has(t.id!) && (
                    <button onClick={() => openResult(t)} className="btn-primary" disabled={viewLoading}>
                      {viewLoading ? "Loading…" : "View result"}
                    </button>
                  )}
                  {tab === "past" && !submittedIds.has(t.id!) && (
                    <span className="text-sm text-slate-500">Not attempted</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {viewing && (
        <StudentResultModal
          test={viewing.test}
          graded={viewing.graded}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}

function StudentResultModal({
  test, graded, onClose,
}: {
  test: TestDoc;
  graded: Graded;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-6">
      <div className="my-6 w-full max-w-3xl rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{test.title}</h2>
            <p className="text-xs text-slate-500">Your result</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 text-2xl leading-none">×</button>
        </div>
        <div className="p-5">
          <StudentResultView test={test} s={graded} />
        </div>
      </div>
    </div>
  );
}

function fmtRemaining(ms: number) {
  if (ms <= 0) return "—";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h) return `${h}h ${m % 60}m left`;
  return `${m}m ${s % 60}s left`;
}
