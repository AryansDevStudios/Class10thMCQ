import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTestByIdFn } from "@/server.functions/tests.functions";
import { getStudentSubmissionFn, submitTestFn } from "@/server.functions/submissions.functions";
import { useAuth } from "@/lib/auth";
import { useServerNow, getServerNow } from "@/lib/server-time";
import { shuffledOrder } from "@/lib/shuffle";
import { KatexText } from "@/components/katex-text";
import type { Question, Submission, TestDoc } from "@/lib/types";

export const Route = createFileRoute("/student/test/$testId")({
  component: TakeTest,
});

function TakeTest() {
  const { testId } = Route.useParams();
  const { student } = useAuth();
  const navigate = useNavigate();
  const { now, synced } = useServerNow(500);

  const [test, setTest] = useState<TestDoc | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [optionOrder, setOptionOrder] = useState<Record<string, number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [warnOpen, setWarnOpen] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const submittingRef = useRef(false);
  const startedRef = useRef(false);

  // Load test + initialize submission doc
  useEffect(() => {
    if (!student) {
      navigate({ to: "/student/login" });
      return;
    }
    (async () => {
      try {
        const t = await getTestByIdFn({ data: { testId } });
        if (!t) {
          setLoadError("Test not found.");
          return;
        }
        setTest(t);

        // Build / restore option order
        const s = await getStudentSubmissionFn({ data: { testId, srNo: student.srNo } });
        let order: Record<string, number[]> = {};
        let existingAnswers: Record<string, number> = {};
        let existingTabSwitches = 0;

        if (s) {
          order = s.optionOrder ?? {};
          existingAnswers = s.answers ?? {};
          existingTabSwitches = s.tabSwitches ?? 0;

          if (!s.submittedAt) {
            let correct = 0,
              wrong = 0,
              unanswered = 0;
            for (const q of t.questions) {
              const chosen = existingAnswers[q.id];
              if (chosen === undefined || chosen === null) unanswered++;
              else {
                const orig = order[q.id]?.[chosen];
                if (orig === q.correctIndex) correct++;
                else wrong++;
              }
            }
            await submitTestFn({
              data: {
                testId,
                srNo: student.srNo,
                updateData: {
                  submittedAt: Date.now() as unknown as any, // Firebase timestamp workaround
                  autoSubmitted: true,
                  score: correct,
                  correctCount: correct,
                  wrongCount: wrong,
                  unansweredCount: unanswered,
                },
              },
            });
            setSubmitted(true);
          } else {
            setSubmitted(true);
          }
        } else {
          for (const q of t.questions) {
            order[q.id] = shuffledOrder(q.options.length, `${student.srNo}:${testId}:${q.id}`);
          }
        }

        setOptionOrder(order);
        setAnswers(existingAnswers);
        setTabSwitches(existingTabSwitches);
        startedRef.current = true;
      } catch (e) {
        setLoadError((e as Error).message);
      }
    })();
  }, [testId, student, navigate]);

  const finalize = useCallback(
    async (auto: boolean) => {
      if (!student || !test || submittingRef.current || submitted) return;
      submittingRef.current = true;
      // Grade
      let correct = 0;
      let wrong = 0;
      let unanswered = 0;
      for (const q of test.questions) {
        const chosenShuffled = answers[q.id];
        if (chosenShuffled === undefined || chosenShuffled === null) {
          unanswered++;
          continue;
        }
        const originalIndex = optionOrder[q.id]?.[chosenShuffled];
        if (originalIndex === q.correctIndex) correct++;
        else wrong++;
      }
      const score = correct;
      try {
        await submitTestFn({
          data: {
            testId,
            srNo: student.srNo,
            updateData: {
              answers,
              submittedAt: Date.now() as unknown as any,
              autoSubmitted: auto,
              score,
              correctCount: correct,
              wrongCount: wrong,
              unansweredCount: unanswered,
            },
          },
        });
        setSubmitted(true);
      } catch (e) {
        console.error("submit failed", e);
        submittingRef.current = false;
      }
    },
    [student, test, answers, optionOrder, testId, submitted],
  );

  const startTest = async () => {
    if (!student || !test) return;
    try {
      await submitTestFn({
        data: {
          testId,
          srNo: student.srNo,
          updateData: {
            srNo: student.srNo,
            name: student.name,
            section: student.section,
            whatsapp: student.whatsapp || "",
            optionOrder,
            answers: {},
            tabSwitches: 0,
            startedAt: Date.now() as unknown as any,
            submittedAt: null,
            autoSubmitted: false,
          },
        },
      });
      setTestStarted(true);
    } catch (e) {
      alert("Failed to start test: " + (e as Error).message);
    }
  };

  // Auto-submit when window ends
  useEffect(() => {
    if (!test || submitted || !synced) return;
    const remaining = test.endAt - now;
    if (remaining <= 0) {
      finalize(true);
      return;
    }
    const id = setTimeout(() => finalize(true), Math.max(0, test.endAt - getServerNow()));
    return () => clearTimeout(id);
  }, [test, now, synced, submitted, finalize]);

  // Page visibility / tab-switch detection
  const lastPenaltyTime = useRef(0);

  useEffect(() => {
    if (!student || !test || submitted || !testStarted) return;
    const onLeave = async (e?: Event) => {
      if (e?.type === "visibilitychange" && document.visibilityState === "visible") return;

      const nowMs = Date.now();
      if (nowMs - lastPenaltyTime.current < 2000) return; // Prevent double trigger
      lastPenaltyTime.current = nowMs;

      setTabSwitches((c) => c + 1);
      setWarnOpen(true);
      try {
        // Just send the updated count instead of increment to avoid server function complexities
        await submitTestFn({
          data: {
            testId,
            srNo: student.srNo,
            updateData: {
              tabSwitches: tabSwitches + 1,
            },
          },
        });
      } catch {}
    };

    document.addEventListener("visibilitychange", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [student, test, submitted, testId, testStarted, tabSwitches]);

  // Screen Wake Lock
  useEffect(() => {
    if (!testStarted || submitted) return;
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        }
      } catch (err) {}
    };
    requestWakeLock();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, [testStarted, submitted]);

  // Live sync teacher-side answers updates (so we save incrementally)
  useEffect(() => {
    if (!student || !test || submitted || !testStarted) return;
    const t = setTimeout(() => {
      submitTestFn({
        data: { testId, srNo: student.srNo, updateData: { answers } },
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [answers, student, test, submitted, testId]);

  const renderedQuestions = useMemo(() => {
    if (!test) return [];
    return test.questions.map((q) => ({
      q,
      order: optionOrder[q.id] ?? [0, 1, 2, 3],
    }));
  }, [test, optionOrder]);

  if (loadError) return <Centered>Error: {loadError}</Centered>;
  if (!student) return null;
  if (!test) return <Centered>Loading test…</Centered>;

  const notYet = now < test.startAt;
  const ended = now >= test.endAt;

  if (notYet) {
    return <Centered>This test opens at {new Date(test.startAt).toLocaleString()}.</Centered>;
  }

  if (submitted) {
    return (
      <Centered>
        <h2 className="text-xl font-semibold">Submission recorded</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your answers have been saved. Results will be available after the test window ends.
        </p>
        <button onClick={() => navigate({ to: "/student" })} className="btn-primary mt-6">
          Back to dashboard
        </button>
      </Centered>
    );
  }

  if (!testStarted) {
    return (
      <Centered>
        <div className="max-w-lg rounded-xl bg-white p-8 shadow-md text-left">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Test Rules & Guidelines</h2>
          <ul className="mb-8 space-y-3 pl-5 text-slate-700 list-disc">
            <li>The timer will start exactly when you click the agree button below.</li>
            <li>
              <strong>Do not refresh or close the page!</strong> If you do, your test will be
              instantly auto-submitted and you cannot re-enter.
            </li>
            <li>
              <strong>Do not switch tabs.</strong> Every time you switch to another tab or
              application, it is recorded and reported to your teacher as cheating.
            </li>
            <li>Your screen will stay awake automatically during the test.</li>
          </ul>
          <button onClick={startTest} className="btn-primary w-full py-3 text-lg">
            Yes, I agree and continue
          </button>
        </div>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{test.title}</p>
            <p className="text-xs text-slate-500">
              Sr. No. {student.srNo} · {student.name} · Tab switches: {tabSwitches}
            </p>
          </div>
          <CountdownPill endAt={test.endAt} now={now} synced={synced} />
        </div>
      </header>

      <main
        className="mx-auto max-w-3xl px-4 py-6 select-none"
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {!synced && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Syncing server time…
          </div>
        )}

        <ol className="space-y-6">
          {renderedQuestions.map(({ q, order }, idx) => (
            <QuestionCard
              key={q.id}
              idx={idx + 1}
              q={q}
              order={order}
              selected={answers[q.id]}
              onSelect={(shuffledIdx) => setAnswers((a) => ({ ...a, [q.id]: shuffledIdx }))}
            />
          ))}
        </ol>

        <div className="mt-8 flex justify-end">
          <button onClick={() => finalize(false)} disabled={ended} className="btn-primary">
            Submit now
          </button>
        </div>
      </main>

      {warnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-red-600">Tab switch detected</h3>
            <p className="mt-2 text-sm text-slate-700">
              Leaving the test window has been recorded ({tabSwitches} time
              {tabSwitches === 1 ? "" : "s"}). Your teacher will see this. Please stay on this page
              until you submit.
            </p>
            <button onClick={() => setWarnOpen(false)} className="btn-primary mt-4 w-full">
              I understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  idx,
  q,
  order,
  selected,
  onSelect,
}: {
  idx: number;
  q: Question;
  order: number[];
  selected: number | undefined;
  onSelect: (shuffledIdx: number) => void;
}) {
  const letters = ["A", "B", "C", "D"];
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-3">
        <span className="font-semibold text-slate-500">{idx}.</span>
        <div className="flex-1">
          <KatexText text={q.text} />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {order.map((origIdx, shuffledIdx) => {
          const active = selected === shuffledIdx;
          return (
            <button
              key={shuffledIdx}
              type="button"
              onClick={() => onSelect(shuffledIdx)}
              className={
                "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition " +
                (active
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50")
              }
            >
              <span className="font-semibold text-slate-600">{letters[shuffledIdx]}.</span>
              <KatexText text={q.options[origIdx]} />
            </button>
          );
        })}
      </div>
    </li>
  );
}

function CountdownPill({ endAt, now, synced }: { endAt: number; now: number; synced: boolean }) {
  const ms = Math.max(0, endAt - now);
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const text = h
    ? `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const urgent = ms < 60_000;
  return (
    <div
      className={
        "rounded-full px-4 py-1.5 font-mono text-sm font-semibold " +
        (urgent ? "bg-red-100 text-red-700" : "bg-slate-900 text-white")
      }
      title={synced ? "Server-synced" : "Syncing…"}
    >
      {text}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center text-slate-700">{children}</div>
    </div>
  );
}
