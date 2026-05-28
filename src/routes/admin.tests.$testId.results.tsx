import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import * as XLSX from "xlsx";
import { db, FIREBASE_CONFIGURED } from "@/lib/firebase";
import { useServerNow } from "@/lib/server-time";
import type { Submission, TestDoc } from "@/lib/types";
import {
  exportClassReportPdf,
  exportSectionReportPdf,
  regradeSubmission,
  statusText,
  type Graded,
} from "@/lib/pdf-report";
import { StudentResultView } from "@/components/StudentResultView";

export const Route = createFileRoute("/admin/tests/$testId/results")({
  component: ResultsPage,
});

function formatTimeTaken(startedAt: any, submittedAt: any) {
  if (!startedAt || !submittedAt) return "-";
  const start = startedAt.toMillis ? startedAt.toMillis() : startedAt;
  const end = submittedAt.toMillis ? submittedAt.toMillis() : submittedAt;
  const diff = Math.max(0, end - start);
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

function ResultsPage() {
  const { testId } = Route.useParams();
  const { now } = useServerNow(1000);
  const [test, setTest] = useState<TestDoc | null>(null);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [selectedSr, setSelectedSr] = useState<string | null>(null);

  useEffect(() => {
    if (!FIREBASE_CONFIGURED) return;
    (async () => {
      const t = await getDoc(doc(db(), "tests", testId));
      if (t.exists()) setTest({ id: t.id, ...(t.data() as TestDoc) });
    })();
    const unsub = onSnapshot(collection(db(), "tests", testId, "submissions"), (snap) => {
      setSubs(snap.docs.map((d) => d.data() as Submission));
    });
    return () => unsub();
  }, [testId]);

  const graded = useMemo<Graded[]>(() => {
    if (!test) return [];
    return subs
      .map((s) => regradeSubmission(s, test))
      .sort((a, b) => b.score - a.score || a.wrongCount - b.wrongCount);
  }, [subs, test]);

  if (!test) return <p className="text-sm text-slate-500">Loading…</p>;

  const ended = now >= test.endAt;
  const selected = selectedSr ? graded.find((g) => g.srNo === selectedSr) ?? null : null;

  const exportClassExcel = () => {
    const rows = graded.map((s, i) => {
      const base: Record<string, any> = {
        Rank: i + 1,
        "Sr. No.": s.srNo,
        Name: s.name,
        Section: s.section,
        "Total Score": `${s.score} / ${test.questions.length}`,
      };
      return base;
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Class Results");
    XLSX.writeFile(wb, `${safeFile(test.title)}-class-results.xlsx`);
  };

  const exportStudentExcel = (s: Graded) => {
    const summary = [{
      "Sr. No.": s.srNo, Name: s.name, Section: s.section,
      "Total Score": `${s.score} / ${test.questions.length}`,
      "Correct Answers": s.correctCount,
      "Wrong Answers": s.wrongCount,
      Unattempted: s.unansweredCount,
      "Tab Switches": s.tabSwitches ?? 0,
      Status: statusText(s),
    }];
    const detail = test.questions.map((q, i) => {
      const chosen = s.answers?.[q.id];
      const chosenOrigIdx = chosen !== undefined && chosen !== null ? s.optionOrder?.[q.id]?.[chosen] : undefined;
      const status = chosenOrigIdx === undefined
        ? "Unattempted"
        : chosenOrigIdx === q.correctIndex ? "Correct" : "Wrong";
      return {
        "#": i + 1,
        Question: q.text,
        "Student answer": chosenOrigIdx === undefined ? "-" : q.options[chosenOrigIdx],
        "Correct answer": q.options[q.correctIndex],
        Status: status,
        Explanation: q.explanation ?? "",
      };
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), "Summary");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detail), "Per question");
    XLSX.writeFile(wb, `${safeFile(test.title)}-${s.srNo}-${safeFile(s.name)}.xlsx`);
  };

  return (
    <div>
      <header className="flex items-start justify-between gap-4">
        <div>
          <Link to="/admin/tests" className="text-sm text-slate-600 hover:text-slate-900">← All tests</Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{test.title}</h1>
          <p className="text-sm text-slate-600">
            {new Date(test.startAt).toLocaleString()} → {new Date(test.endAt).toLocaleString()} ·{" "}
            {ended ? "Ended" : "In progress"} · {graded.length} submission{graded.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={exportClassExcel} className="btn-primary">Class Excel</button>
        <button onClick={() => exportClassReportPdf(test, graded)} className="btn-secondary">Class PDF</button>
        <button onClick={() => exportSectionReportPdf(test, graded)} className="btn-secondary">Section PDF</button>
        {!ended && (
          <p className="self-center text-xs text-amber-700">
            Test still in progress — exports show a live snapshot.
          </p>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Rank</th>
              <th className="px-3 py-2">Sr.No</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Sec</th>
              <th className="px-3 py-2">Total score</th>
              <th className="px-3 py-2 hidden sm:table-cell">Time taken</th>
              <th className="px-3 py-2 hidden sm:table-cell">Correct</th>
              <th className="px-3 py-2 hidden sm:table-cell">Wrong</th>
              <th className="px-3 py-2 hidden sm:table-cell">Unattempted</th>
              <th className="px-3 py-2 hidden sm:table-cell">Tab switches</th>
              <th className="px-3 py-2 hidden sm:table-cell">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {graded.map((s, i) => (
              <tr key={s.srNo} className="border-t border-slate-100">
                <td className="px-3 py-2 font-mono">{i + 1}</td>
                <td className="px-3 py-2 font-mono">{s.srNo}</td>
                <td className="px-3 py-2">{s.name}</td>
                <td className="px-3 py-2">{s.section}</td>
                <td className="px-3 py-2 font-semibold">{s.score} / {test.questions.length}</td>
                <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">
                  {formatTimeTaken(s.startedAt, s.submittedAt)}
                </td>
                <td className="px-3 py-2 text-emerald-700 hidden sm:table-cell">{s.correctCount}</td>
                <td className="px-3 py-2 text-red-600 hidden sm:table-cell">{s.wrongCount}</td>
                <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">{s.unansweredCount}</td>
                <td className={"px-3 py-2 hidden sm:table-cell " + ((s.tabSwitches ?? 0) > 0 ? "text-amber-700 font-semibold" : "")}>
                  {s.tabSwitches ?? 0}
                </td>
                <td className="px-3 py-2 text-xs hidden sm:table-cell">{statusText(s)}</td>
                <td className="px-3 py-2 text-right">
                  {s.whatsapp && (
                    <button 
                      onClick={() => {
                        const msg = `Result for ${s.name} (Section ${s.section}): ${s.score} / ${test.questions.length}`;
                        window.open(`https://wa.me/91${s.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="text-emerald-600 hover:underline text-xs mr-3 font-semibold"
                    >
                      WhatsApp
                    </button>
                  )}
                  <button onClick={() => setSelectedSr(s.srNo)} className="text-blue-600 hover:underline text-xs">
                    View detail
                  </button>
                </td>
              </tr>
            ))}
            {graded.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-8 text-center text-slate-500">No submissions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <StudentDetailModal
          test={test}
          s={selected}
          onClose={() => setSelectedSr(null)}
          onExportExcel={() => exportStudentExcel(selected)}
        />
      )}
    </div>
  );
}

function StudentDetailModal({
  test, s, onClose, onExportExcel,
}: {
  test: TestDoc;
  s: Graded;
  onClose: () => void;
  onExportExcel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-6">
      <div className="my-10 w-full max-w-3xl rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <h2 className="text-lg font-bold text-slate-900">{test.title} — student detail</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 text-2xl leading-none">×</button>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
          <button onClick={onExportExcel} className="btn-secondary">Download Excel</button>
          {s.whatsapp && (
            <button 
              onClick={() => {
                const msg = `Result for ${s.name} (Section ${s.section}): ${s.score} / ${test.questions.length}`;
                window.open(`https://wa.me/91${s.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white"
            >
              Send on WhatsApp
            </button>
          )}
        </div>
        <div className="p-5">
          <StudentResultView test={test} s={s} />
        </div>
      </div>
    </div>
  );
}

function safeFile(s: string) {
  return s.replace(/[^a-z0-9-_]+/gi, "_");
}
