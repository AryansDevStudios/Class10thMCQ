import { KatexText } from "@/components/katex-text";
import type { TestDoc } from "@/lib/types";
import type { Graded } from "@/lib/pdf-report";
import { statusText } from "@/lib/pdf-report";

export function StudentResultView({ test, s }: { test: TestDoc; s: Graded }) {
  return (
    <div>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{s.name}</span>{" "}
          <span className="font-mono text-xs">({s.srNo})</span> · Class 10-{s.section}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <Stat label="Total score" value={`${s.score} / ${test.questions.length}`} />
          <Stat label="Correct answers" value={String(s.correctCount)} valueClass="text-emerald-700" />
          <Stat label="Wrong answers" value={String(s.wrongCount)} valueClass="text-red-600" />
          <Stat label="Unattempted" value={String(s.unansweredCount)} />
          <Stat label="Tab switches" value={String(s.tabSwitches ?? 0)} />
          <Stat label="Status" value={statusText(s)} />
        </div>
      </div>

      <ol className="mt-5 space-y-4">
        {test.questions.map((q, i) => {
          const chosen = s.answers?.[q.id];
          const chosenOrig =
            chosen !== undefined && chosen !== null ? s.optionOrder?.[q.id]?.[chosen] : undefined;
          const unanswered = chosenOrig === undefined;
          const isCorrect = chosenOrig === q.correctIndex;
          return (
            <li key={q.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-slate-500">{i + 1}.</span>
                <div className="flex-1"><KatexText text={q.text} /></div>
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-xs font-semibold " +
                    (unanswered
                      ? "bg-slate-200 text-slate-700"
                      : isCorrect
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700")
                  }
                >
                  {unanswered ? "Unattempted" : isCorrect ? "Correct" : "Wrong"}
                </span>
              </div>
              <div className="mt-3 space-y-1.5 text-sm">
                {q.options.map((opt, idx) => {
                  const isStudent = idx === chosenOrig;
                  const isAnswer = idx === q.correctIndex;
                  return (
                    <div
                      key={idx}
                      className={
                        "flex items-start gap-2 rounded border p-2 " +
                        (isAnswer
                          ? "border-emerald-300 bg-emerald-50"
                          : isStudent
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200")
                      }
                    >
                      <span className="font-mono text-xs text-slate-500">{String.fromCharCode(65 + idx)}.</span>
                      <div className="flex-1"><KatexText text={opt} /></div>
                      {isAnswer && <span className="text-xs font-semibold text-emerald-700">correct answer</span>}
                      {isStudent && !isAnswer && (
                        <span className="text-xs font-semibold text-red-700">student chose</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {q.explanation && (
                <div className="mt-3 rounded bg-slate-50 p-3 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Explanation
                  </span>
                  <div className="mt-1"><KatexText text={q.explanation} /></div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Stat({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded bg-white px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className={"text-base font-semibold text-slate-900 " + valueClass}>{value}</div>
    </div>
  );
}
