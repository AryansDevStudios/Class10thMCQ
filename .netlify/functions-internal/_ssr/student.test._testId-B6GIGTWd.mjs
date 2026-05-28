import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { g as getDoc, b as doc, u as updateDoc, s as serverTimestamp, i as increment, j as setDoc } from "../_libs/firebase__firestore.mjs";
import { F as FIREBASE_CONFIGURED, d as db } from "./firebase-BOBCTMcs.mjs";
import { R as Route$2, u as useAuth } from "./router-QEy6FD-2.mjs";
import { u as useServerNow, g as getServerNow, K as KatexText } from "./katex-text-B3-KgC-6.mjs";
import "../_libs/firebase.mjs";
import "../_libs/react-katex.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/idb.mjs";
import "../_libs/firebase__webchannel-wrapper.mjs";
import "../_libs/@grpc/grpc-js.mjs";
import "process";
import "tls";
import "fs";
import "os";
import "net";
import "events";
import "http2";
import "http";
import "url";
import "dns";
import "zlib";
import "../_libs/@grpc/proto-loader.mjs";
import "path";
import "../_libs/lodash.camelcase.mjs";
import "../_libs/protobufjs.mjs";
import "../_libs/protobufjs__aspromise.mjs";
import "../_libs/protobufjs__base64.mjs";
import "../_libs/protobufjs__eventemitter.mjs";
import "../_libs/protobufjs__float.mjs";
import "../_libs/@protobufjs/inquire.mjs";
import "../_libs/protobufjs__utf8.mjs";
import "../_libs/protobufjs__pool.mjs";
import "../_libs/long.mjs";
import "../_libs/protobufjs__codegen.mjs";
import "../_libs/protobufjs__fetch.mjs";
import "../_libs/protobufjs__path.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/katex.mjs";
function hashSeed(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function seededShuffle(arr, seed) {
  const rng = mulberry32(hashSeed(seed));
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function shuffledOrder(length, seed) {
  return seededShuffle(
    Array.from({ length }, (_, i) => i),
    seed
  );
}
function TakeTest() {
  const {
    testId
  } = Route$2.useParams();
  const {
    student
  } = useAuth();
  const navigate = useNavigate();
  const {
    now,
    synced
  } = useServerNow(500);
  const [test, setTest] = reactExports.useState(null);
  const [loadError, setLoadError] = reactExports.useState(null);
  const [answers, setAnswers] = reactExports.useState({});
  const [optionOrder, setOptionOrder] = reactExports.useState({});
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [tabSwitches, setTabSwitches] = reactExports.useState(0);
  const [warnOpen, setWarnOpen] = reactExports.useState(false);
  const [testStarted, setTestStarted] = reactExports.useState(false);
  const submittingRef = reactExports.useRef(false);
  const startedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!student) {
      navigate({
        to: "/student/login"
      });
      return;
    }
    if (!FIREBASE_CONFIGURED) return;
    (async () => {
      try {
        const tSnap = await getDoc(doc(db(), "tests", testId));
        if (!tSnap.exists()) {
          setLoadError("Test not found.");
          return;
        }
        const t = {
          id: tSnap.id,
          ...tSnap.data()
        };
        setTest(t);
        const subRef = doc(db(), "tests", testId, "submissions", student.srNo);
        const subSnap = await getDoc(subRef);
        let order = {};
        let existingAnswers = {};
        let existingTabSwitches = 0;
        if (subSnap.exists()) {
          const s = subSnap.data();
          order = s.optionOrder ?? {};
          existingAnswers = s.answers ?? {};
          existingTabSwitches = s.tabSwitches ?? 0;
          if (!s.submittedAt) {
            let correct = 0, wrong = 0, unanswered = 0;
            for (const q of t.questions) {
              const chosen = existingAnswers[q.id];
              if (chosen === void 0 || chosen === null) unanswered++;
              else {
                const orig = order[q.id]?.[chosen];
                if (orig === q.correctIndex) correct++;
                else wrong++;
              }
            }
            await updateDoc(subRef, {
              submittedAt: serverTimestamp(),
              autoSubmitted: true,
              score: correct,
              correctCount: correct,
              wrongCount: wrong,
              unansweredCount: unanswered
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
        setLoadError(e.message);
      }
    })();
  }, [testId, student, navigate]);
  const finalize = reactExports.useCallback(async (auto) => {
    if (!student || !test || submittingRef.current || submitted) return;
    submittingRef.current = true;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    for (const q of test.questions) {
      const chosenShuffled = answers[q.id];
      if (chosenShuffled === void 0 || chosenShuffled === null) {
        unanswered++;
        continue;
      }
      const originalIndex = optionOrder[q.id]?.[chosenShuffled];
      if (originalIndex === q.correctIndex) correct++;
      else wrong++;
    }
    const score = correct;
    try {
      await updateDoc(doc(db(), "tests", testId, "submissions", student.srNo), {
        answers,
        submittedAt: serverTimestamp(),
        autoSubmitted: auto,
        score,
        correctCount: correct,
        wrongCount: wrong,
        unansweredCount: unanswered
      });
      setSubmitted(true);
    } catch (e) {
      console.error("submit failed", e);
      submittingRef.current = false;
    }
  }, [student, test, answers, optionOrder, testId, submitted]);
  const startTest = async () => {
    if (!student || !test) return;
    try {
      const subRef = doc(db(), "tests", testId, "submissions", student.srNo);
      await setDoc(subRef, {
        srNo: student.srNo,
        name: student.name,
        section: student.section,
        whatsapp: student.whatsapp || "",
        optionOrder,
        answers: {},
        tabSwitches: 0,
        startedAt: serverTimestamp(),
        submittedAt: null,
        autoSubmitted: false
      });
      setTestStarted(true);
    } catch (e) {
      alert("Failed to start test: " + e.message);
    }
  };
  reactExports.useEffect(() => {
    if (!test || submitted || !synced) return;
    const remaining = test.endAt - now;
    if (remaining <= 0) {
      finalize(true);
      return;
    }
    const id = setTimeout(() => finalize(true), Math.max(0, test.endAt - getServerNow()));
    return () => clearTimeout(id);
  }, [test, now, synced, submitted, finalize]);
  reactExports.useEffect(() => {
    if (!student || !test || submitted || !testStarted) return;
    const onHide = async () => {
      if (document.visibilityState === "hidden") {
        setTabSwitches((c) => c + 1);
        setWarnOpen(true);
        try {
          await updateDoc(doc(db(), "tests", testId, "submissions", student.srNo), {
            tabSwitches: increment(1)
          });
        } catch {
        }
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [student, test, submitted, testId, testStarted]);
  reactExports.useEffect(() => {
    if (!testStarted || submitted) return;
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch (err) {
      }
    };
    requestWakeLock();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (wakeLock) wakeLock.release().catch(() => {
      });
    };
  }, [testStarted, submitted]);
  reactExports.useEffect(() => {
    if (!student || !test || submitted || !testStarted) return;
    const ref = doc(db(), "tests", testId, "submissions", student.srNo);
    const t = setTimeout(() => {
      updateDoc(ref, {
        answers
      }).catch(() => {
      });
    }, 400);
    return () => clearTimeout(t);
  }, [answers, student, test, submitted, testId]);
  const renderedQuestions = reactExports.useMemo(() => {
    if (!test) return [];
    return test.questions.map((q) => ({
      q,
      order: optionOrder[q.id] ?? [0, 1, 2, 3]
    }));
  }, [test, optionOrder]);
  if (loadError) return /* @__PURE__ */ jsxRuntimeExports.jsxs(Centered, { children: [
    "Error: ",
    loadError
  ] });
  if (!student) return null;
  if (!test) return /* @__PURE__ */ jsxRuntimeExports.jsx(Centered, { children: "Loading test…" });
  const notYet = now < test.startAt;
  const ended = now >= test.endAt;
  if (notYet) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Centered, { children: [
      "This test opens at ",
      new Date(test.startAt).toLocaleString(),
      "."
    ] });
  }
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Centered, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Submission recorded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-600", children: "Your answers have been saved. Results will be available after the test window ends." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/student"
      }), className: "btn-primary mt-6", children: "Back to dashboard" })
    ] });
  }
  if (!testStarted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Centered, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg rounded-xl bg-white p-8 shadow-md text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-2xl font-bold text-slate-900", children: "Test Rules & Guidelines" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mb-8 space-y-3 pl-5 text-slate-700 list-disc", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "The timer will start exactly when you click the agree button below." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Do not refresh or close the page!" }),
          " If you do, your test will be instantly auto-submitted and you cannot re-enter."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Do not switch tabs." }),
          " Every time you switch to another tab or application, it is recorded and reported to your teacher as cheating."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Your screen will stay awake automatically during the test." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: startTest, className: "btn-primary w-full py-3 text-lg", children: "Yes, I agree and continue" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-10 border-b border-slate-200 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl items-center justify-between px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-900", children: test.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
          "Sr. No. ",
          student.srNo,
          " · ",
          student.name,
          " · Tab switches: ",
          tabSwitches
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CountdownPill, { endAt: test.endAt, now, synced })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 py-6 select-none", onCopy: (e) => e.preventDefault(), onContextMenu: (e) => e.preventDefault(), children: [
      !synced && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900", children: "Syncing server time…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-6", children: renderedQuestions.map(({
        q,
        order
      }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionCard, { idx: idx + 1, q, order, selected: answers[q.id], onSelect: (shuffledIdx) => setAnswers((a) => ({
        ...a,
        [q.id]: shuffledIdx
      })) }, q.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => finalize(false), disabled: ended, className: "btn-primary", children: "Submit now" }) })
    ] }),
    warnOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm rounded-xl bg-white p-6 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-red-600", children: "Tab switch detected" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-slate-700", children: [
        "Leaving the test window has been recorded (",
        tabSwitches,
        " time",
        tabSwitches === 1 ? "" : "s",
        "). Your teacher will see this. Please stay on this page until you submit."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setWarnOpen(false), className: "btn-primary mt-4 w-full", children: "I understand" })
    ] }) })
  ] });
}
function QuestionCard({
  idx,
  q,
  order,
  selected,
  onSelect
}) {
  const letters = ["A", "B", "C", "D"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-500", children: [
        idx,
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KatexText, { text: q.text }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-2", children: order.map((origIdx, shuffledIdx) => {
      const active = selected === shuffledIdx;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => onSelect(shuffledIdx), className: "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition " + (active ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-600", children: [
          letters[shuffledIdx],
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(KatexText, { text: q.options[origIdx] })
      ] }, shuffledIdx);
    }) })
  ] });
}
function CountdownPill({
  endAt,
  now,
  synced
}) {
  const ms = Math.max(0, endAt - now);
  const s = Math.floor(ms / 1e3);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const text = h ? `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const urgent = ms < 6e4;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full px-4 py-1.5 font-mono text-sm font-semibold " + (urgent ? "bg-red-100 text-red-700" : "bg-slate-900 text-white"), title: synced ? "Server-synced" : "Syncing…", children: text });
}
function Centered({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-slate-50 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md text-center text-slate-700", children }) });
}
export {
  TakeTest as component
};
