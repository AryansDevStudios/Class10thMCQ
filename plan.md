# Academic Testing Platform — Build Plan

A real-time MCQ testing app for one class (10th, sections A/B/H) with strict server-time windows, KaTeX rendering, and anti-cheat. Firebase Firestore is the only backend.

## Stack

- React + TanStack Start (current template), Tailwind, shadcn/ui
- Firebase Web SDK: Firestore + (optional) Cloud Functions trigger for server time
- KaTeX via `react-katex` for math/chemistry
- `xlsx` for Excel export, `jspdf` + `jspdf-autotable` for PDF export

## What you'll need to provide

A Firebase project (free Spark tier is fine). Paste the 6 Web-app config values (apiKey, authDomain, projectId, etc.) — these are publishable and live in code. I'll give you the Firestore security rules to paste into the Firebase console.

## Roles & Routes

- `/` — role picker (Student / Admin)
- `/student/register`, `/student/login`
- `/student` — list of currently active / upcoming tests
- `/student/test/$testId` — test interface (timer, KaTeX, auto-submit)
- `/admin` — gated by shared admin code stored in `localStorage` after entry
- `/admin/tests` — list/create tests
- `/admin/tests/new` — create form + JSON bulk upload
- `/admin/tests/$testId/results` — live submissions + PDF/Excel export
- `/admin/students` — view students (including plain-text passwords, per spec)

## Firestore Data Model

```text
students/{srNo}
  srNo, name, class: "10", section: "A"|"B"|"H", password (plaintext)

tests/{testId}
  title, createdAt, startAt (Timestamp), endAt (Timestamp),
  questions: [{ id, text, options: [a,b,c,d], correctIndex }]

tests/{testId}/submissions/{srNo}
  srNo, name, section,
  optionOrder: { [qid]: [shuffledIndices] },   // for audit
  answers: { [qid]: selectedShuffledIndex },
  tabSwitches: number,
  startedAt, submittedAt, autoSubmitted: bool,
  score, correctCount, wrongCount, unansweredCount
```

## Auth (per your spec)

- Student register writes a doc to `students/{srNo}` with `password` in plain text.
- Login reads `students/{srNo}` and compares `password` client-side; on match, store `{srNo, name, section}` in `localStorage` and React context.
- Admin enters a shared code (stored as constant in code, editable later). On match, set `admin=true` in `localStorage`.
- No Firebase Auth. Firestore rules will permit the documented reads/writes; the trade-off (anyone with the URL + Firebase config can read student docs) is accepted because you asked for plaintext, admin-recoverable passwords.

## Server Time (the critical bit)

Firestore client clocks can't be trusted. I'll use `serverTimestamp()` for writes and, on every page load and every 15s, fetch a server-authoritative "now" by writing a heartbeat doc and reading back its `serverTimestamp`, then compute `offset = serverNow - Date.now()`. All timer math uses `Date.now() + offset`. Auto-submit fires the instant `serverNow >= test.endAt`. Submission writes carry `submittedAt: serverTimestamp()`; rules reject writes after `endAt`.

## Test Creation (admin)

- Form: title, start datetime, end datetime, then repeatable question blocks (question + 4 options + correct).
- Every text field accepts LaTeX inline as `$...$` or block `$$...$$`; a live preview renders via KaTeX so the teacher sees what students will see.
- "Bulk upload JSON" button accepts:

```json
{
  "title": "Chemistry Mock 1",
  "startAt": "2026-05-30T18:00:00+05:30",
  "endAt": "2026-05-30T19:00:00+05:30",
  "questions": [
    { "text": "Balance: $H_2 + O_2 \\to H_2O$", "options": ["1", "2", "3", "4"], "correctIndex": 1 }
  ]
}
```

## Student Test Flow

1. On open, fetch test; reject if `now < startAt` or `now >= endAt`.
2. Shuffle each question's options with a per-student seed; store `optionOrder` in the in-progress submission doc so grading maps shuffled→original correctly.
3. Render with KaTeX. Sticky header shows countdown to `endAt` using server-synced offset.
4. Selecting an answer writes incrementally to `submissions/{srNo}` (so partial answers survive a refresh or crash).
5. At `endAt` (or on manual submit), finalize: compute score, set `autoSubmitted`, lock UI.

## Anti-Cheat

- Option shuffle per student (above).
- `document.visibilitychange` + `window.blur`: each event increments `tabSwitches` on the submission doc and shows a warning modal with the current count. Non-blocking.

## Results & Export

- Admin results page subscribes via `onSnapshot` to `submissions` — table updates live.
- After `endAt`, a "Finalize & Export" panel exposes:
  - Excel (.xlsx) — full breakdown: Sr.No, Name, Section, Score, Correct, Wrong, Unanswered, TabSwitches, AutoSubmitted, per-question correctness columns.
  - PDF — printable summary table sorted by score.

## Implementation Order

1. Install `firebase`, `react-katex`, `katex`, `xlsx`, `jspdf`, `jspdf-autotable`. Wire Firebase config + a `useFirebase` hook.
2. Auth context (student + admin), login/register/admin-code pages, route guards.
3. Server-time offset hook.
4. Admin test create (form + JSON upload + KaTeX preview) + tests list.
5. Student test interface with shuffle, autosave, timer, auto-submit, anti-cheat.
6. Results page with live table + Excel/PDF export.
7. Provide the Firestore security rules text for you to paste into the Firebase console.

## Out of scope (ask if you want them)

- Multiple classes/grades beyond "10".
- Password reset UI (admin edits the field directly in `/admin/students`).
- Question types beyond MCQ (no short-answer/numeric).
- Image uploads in questions (LaTeX only).
- Proctoring beyond tab-switch counting (no camera/fullscreen lock).
