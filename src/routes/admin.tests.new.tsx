import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, FIREBASE_CONFIGURED } from "@/lib/firebase";
import type { Question } from "@/lib/types";

export const Route = createFileRoute("/admin/tests/new")({
  component: NewTest,
});

function NewTest() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [parsedCount, setParsedCount] = useState<number | null>(null);

  const parseJson = (raw: string): Question[] => {
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : data.questions;
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error('Expected a "questions" array.');
    }
    return arr.map((q: any, i: number) => {
      const text = q.question ?? q.text;
      const options = q.options;
      const correctIndex = q.correctAnswer ?? q.correctIndex;
      if (typeof text !== "string" || !text.trim()) {
        throw new Error(`Question ${i + 1}: missing "question" text.`);
      }
      if (!Array.isArray(options) || options.length < 2 || options.some((o: any) => typeof o !== "string")) {
        throw new Error(`Question ${i + 1}: "options" must be an array of at least 2 strings.`);
      }
      if (typeof correctIndex !== "number" || correctIndex < 0 || correctIndex >= options.length) {
        throw new Error(`Question ${i + 1}: "correctAnswer" must be between 0 and ${options.length - 1}.`);
      }
      const parsedQ: Question = {
        id: q.id || crypto.randomUUID(),
        text,
        options: options as string[],
        correctIndex: correctIndex,
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
      setError("JSON error: " + (e as Error).message);
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
    let questions: Question[];
    try {
      questions = parseJson(jsonInput);
    } catch (e) {
      return setError("JSON error: " + (e as Error).message);
    }
    setSaving(true);
    try {
      const ref = await addDoc(collection(db(), "tests"), {
        title: title.trim(),
        startAt: sMs,
        endAt: eMs,
        createdAt: serverTimestamp(),
        questions,
      });
      navigate({ to: "/admin/tests/$testId/results", params: { testId: ref.id } });
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">New Test</h1>
        <Link to="/admin/tests" className="text-sm text-slate-600 hover:text-slate-900">← All tests</Link>
      </div>

      <div className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="e.g. Class 10 Maths — Chapter 4 Quick Test"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start (local time)">
            <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="input" />
          </Field>
          <Field label="End (local time)">
            <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} className="input" />
          </Field>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Questions (JSON)</h2>
        <p className="mt-1 text-sm text-slate-600">
          Paste a JSON object with a <code className="rounded bg-slate-100 px-1">questions</code> array. Each item needs
          {" "}<code className="rounded bg-slate-100 px-1">question</code>, an array of{" "}
          <code className="rounded bg-slate-100 px-1">options</code>, and{" "}
          <code className="rounded bg-slate-100 px-1">correctAnswer</code> (zero-indexed).
          LaTeX (<code className="rounded bg-slate-100 px-1">$...$</code> inline, <code className="rounded bg-slate-100 px-1">$$...$$</code> block)
          is supported in both the question text and the options.
        </p>
        <textarea
          value={jsonInput}
          onChange={(e) => { setJsonInput(e.target.value); setParsedCount(null); }}
          className="input mt-3 h-72 font-mono text-xs"
          placeholder={SAMPLE_JSON}
          spellCheck={false}
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" onClick={validateJson} className="btn-secondary">Validate JSON</button>
            <button 
              type="button" 
              onClick={() => {
                navigator.clipboard.writeText(SAMPLE_JSON);
                alert("Format copied to clipboard!");
              }} 
              className="btn-secondary"
            >
              Copy Format
            </button>
          </div>
          {parsedCount !== null && (
            <p className="text-sm text-emerald-700">✓ Parsed {parsedCount} question{parsedCount === 1 ? "" : "s"}.</p>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Paste this format to any AI to generate the questions in that format in a similar way.
        </p>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex justify-end gap-3">
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Create test"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const SAMPLE_JSON = JSON.stringify({
  "questions": [
    {
      "question": "True or False: The value of $\\pi$ is exactly equal to $\\frac{22}{7}$.",
      "options": [
        "True",
        "False"
      ],
      "correctAnswer": 1
    },
    {
      "question": "Which of these countries is located entirely within the continent of Asia?",
      "options": [
        "Egypt",
        "Japan",
        "Turkey"
      ],
      "correctAnswer": 1
    },
    {
      "question": "What is the value of $5!$ (5 factorial)?",
      "options": [
        "5",
        "20",
        "60",
        "120",
        "240"
      ],
      "correctAnswer": 3,
      "explanation": "The factorial of a number is the product of all positive integers less than or equal to it: $5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$."
    },
    {
      "question": "What is the chemical symbol for Gold?",
      "options": [
        "Gd",
        "Ag",
        "Au",
        "Fe"
      ],
      "correctAnswer": 2,
      "explanation": "The chemical symbol for Gold is $\\text{Au}$, which comes from the Latin word *aurum*, meaning shining dawn."
    },
    {
      "question": "What is the value of $x$ in the equation $3x - 7 = 11$?",
      "options": [
        "4",
        "5",
        "6",
        "7"
      ],
      "correctAnswer": 2,
      "explanation": "Adding 7 to both sides gives $3x = 18$. Dividing both sides by 3 yields $x = 6$."
    }
  ]
}, null, 2);
