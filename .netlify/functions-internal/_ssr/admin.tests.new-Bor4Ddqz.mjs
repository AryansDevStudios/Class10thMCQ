import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as addDoc, c as collection, s as serverTimestamp } from "../_libs/firebase__firestore.mjs";
import { F as FIREBASE_CONFIGURED, d as db } from "./firebase-BOBCTMcs.mjs";
import "../_libs/firebase.mjs";
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
function NewTest() {
  const navigate = useNavigate();
  const [title, setTitle] = reactExports.useState("");
  const [startAt, setStartAt] = reactExports.useState("");
  const [endAt, setEndAt] = reactExports.useState("");
  const [jsonInput, setJsonInput] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [parsedCount, setParsedCount] = reactExports.useState(null);
  const parseJson = (raw) => {
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : data.questions;
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('Expected a "questions" array.');
    }
    return arr.map((q, i) => {
      const text = q.question ?? q.text;
      const options = q.options;
      const correctIndex = q.correctAnswer ?? q.correctIndex;
      if (typeof text !== "string" || !text.trim()) {
        throw new Error(`Question ${i + 1}: missing "question" text.`);
      }
      if (!Array.isArray(options) || options.length < 2 || options.some((o) => typeof o !== "string")) {
        throw new Error(`Question ${i + 1}: "options" must be an array of at least 2 strings.`);
      }
      if (typeof correctIndex !== "number" || correctIndex < 0 || correctIndex >= options.length) {
        throw new Error(`Question ${i + 1}: "correctAnswer" must be between 0 and ${options.length - 1}.`);
      }
      const parsedQ = {
        id: q.id || crypto.randomUUID(),
        text,
        options,
        correctIndex
      };
      if (typeof q.explanation === "string" && q.explanation.trim()) {
        parsedQ.explanation = q.explanation;
      }
      return parsedQ;
    });
  };
  const validateJson = () => {
    setError("");
    setParsedCount(null);
    try {
      const qs = parseJson(jsonInput);
      setParsedCount(qs.length);
    } catch (e) {
      setError("JSON error: " + e.message);
    }
  };
  const save = async () => {
    setError("");
    if (!FIREBASE_CONFIGURED) {
      setError("Firebase not configured.");
      return;
    }
    if (!title.trim() || !startAt || !endAt) return setError("Title, start, and end are required.");
    const sMs = new Date(startAt).getTime();
    const eMs = new Date(endAt).getTime();
    if (!(eMs > sMs)) return setError("End time must be after start time.");
    let questions;
    try {
      questions = parseJson(jsonInput);
    } catch (e) {
      return setError("JSON error: " + e.message);
    }
    setSaving(true);
    try {
      const ref = await addDoc(collection(db(), "tests"), {
        title: title.trim(),
        startAt: sMs,
        endAt: eMs,
        createdAt: serverTimestamp(),
        questions
      });
      navigate({
        to: "/admin/tests/$testId/results",
        params: {
          testId: ref.id
        }
      });
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "New Test" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/tests", className: "text-sm text-slate-600 hover:text-slate-900", children: "← All tests" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), className: "input", placeholder: "e.g. Class 10 Maths — Chapter 4 Quick Test" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Start (local time)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: startAt, onChange: (e) => setStartAt(e.target.value), className: "input" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "End (local time)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "datetime-local", value: endAt, onChange: (e) => setEndAt(e.target.value), className: "input" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-800", children: "Questions (JSON)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-slate-600", children: [
        "Paste a JSON object with a ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-slate-100 px-1", children: "questions" }),
        " array. Each item needs",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-slate-100 px-1", children: "question" }),
        ", an array of",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-slate-100 px-1", children: "options" }),
        ", and",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-slate-100 px-1", children: "correctAnswer" }),
        " (zero-indexed). LaTeX (",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-slate-100 px-1", children: "$...$" }),
        " inline, ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-slate-100 px-1", children: "$$...$$" }),
        " block) is supported in both the question text and the options."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: jsonInput, onChange: (e) => {
        setJsonInput(e.target.value);
        setParsedCount(null);
      }, className: "input mt-3 h-72 font-mono text-xs", placeholder: SAMPLE_JSON, spellCheck: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: validateJson, className: "btn-secondary", children: "Validate JSON" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
            navigator.clipboard.writeText(SAMPLE_JSON);
            alert("Format copied to clipboard!");
          }, className: "btn-secondary", children: "Copy Format" })
        ] }),
        parsedCount !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-emerald-700", children: [
          "✓ Parsed ",
          parsedCount,
          " question",
          parsedCount === 1 ? "" : "s",
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-slate-500", children: "Paste this format to any AI to generate the questions in that format in a similar way." })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-red-600", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex justify-end gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, disabled: saving, className: "btn-primary", children: saving ? "Saving…" : "Create test" }) })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children })
  ] });
}
const SAMPLE_JSON = JSON.stringify({
  "questions": [{
    "question": "True or False: The value of $\\pi$ is exactly equal to $\\frac{22}{7}$.",
    "options": ["True", "False"],
    "correctAnswer": 1
  }, {
    "question": "Which of these countries is located entirely within the continent of Asia?",
    "options": ["Egypt", "Japan", "Turkey"],
    "correctAnswer": 1
  }, {
    "question": "What is the value of $5!$ (5 factorial)?",
    "options": ["5", "20", "60", "120", "240"],
    "correctAnswer": 3,
    "explanation": "The factorial of a number is the product of all positive integers less than or equal to it: $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$."
  }, {
    "question": "What is the chemical symbol for Gold?",
    "options": ["Gd", "Ag", "Au", "Fe"],
    "correctAnswer": 2,
    "explanation": "The chemical symbol for Gold is $\\text{Au}$, which comes from the Latin word *aurum*, meaning shining dawn."
  }, {
    "question": "What is the value of $x$ in the equation $3x - 7 = 11$?",
    "options": ["4", "5", "6", "7"],
    "correctAnswer": 2,
    "explanation": "Adding 7 to both sides gives $3x = 18$. Dividing both sides by 3 yields $x = 6$."
  }]
}, null, 2);
export {
  NewTest as component
};
