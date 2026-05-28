import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { K as KatexText } from "./katex-text-B3-KgC-6.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { a as autoTable } from "../_libs/jspdf-autotable.mjs";
function statusText(s) {
  if (!s.submittedAt) return "In progress";
  return s.autoSubmitted ? "Auto-submitted" : "Submitted";
}
function safeFile(s) {
  return s.replace(/[^a-z0-9-_]+/gi, "_");
}
function regradeSubmission(s, test) {
  const hasStored = typeof s.correctCount === "number" && typeof s.wrongCount === "number" && typeof s.unansweredCount === "number";
  if (hasStored) {
    return {
      ...s,
      score: s.score ?? s.correctCount,
      correctCount: s.correctCount,
      wrongCount: s.wrongCount,
      unansweredCount: s.unansweredCount
    };
  }
  let correct = 0, wrong = 0, unanswered = 0;
  for (const q of test.questions) {
    const chosen = s.answers?.[q.id];
    if (chosen === void 0 || chosen === null) {
      unanswered++;
      continue;
    }
    const orig = s.optionOrder?.[q.id]?.[chosen];
    if (orig === q.correctIndex) correct++;
    else wrong++;
  }
  return { ...s, score: correct, correctCount: correct, wrongCount: wrong, unansweredCount: unanswered };
}
async function exportClassReportPdf(test, graded) {
  const sorted = [...graded].sort((a, b) => b.score - a.score || a.wrongCount - b.wrongCount);
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(`${test.title} - Class Results`, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 30);
  doc.text(`Total Submissions: ${sorted.length}`, 14, 36);
  const tableData = sorted.map((s, i) => [
    i + 1,
    s.srNo,
    s.name,
    s.section,
    `${s.score} / ${test.questions.length}`,
    s.correctCount,
    s.wrongCount,
    s.unansweredCount
  ]);
  autoTable(doc, {
    startY: 45,
    head: [["Rank", "Sr. No.", "Name", "Section", "Score", "Correct", "Wrong", "Unattempted"]],
    body: tableData,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      textColor: [40, 40, 40],
      lineColor: [226, 232, 240],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });
  doc.save(`${safeFile(test.title)}-class-results.pdf`);
}
async function exportSectionReportPdf(test, graded) {
  const sections = Array.from(new Set(graded.map((g) => g.section))).sort();
  const doc = new jsPDF();
  let startY = 22;
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(`${test.title} - Section-wise Results`, 14, startY);
  startY += 8;
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, startY);
  startY += 12;
  sections.forEach((section, index) => {
    if (index > 0) {
      doc.addPage();
      startY = 22;
    }
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(`Section ${section}`, 14, startY);
    const sectionGraded = graded.filter((g) => g.section === section);
    const sorted = [...sectionGraded].sort((a, b) => b.score - a.score || a.wrongCount - b.wrongCount);
    const tableData = sorted.map((s, i) => [
      i + 1,
      s.srNo,
      s.name,
      `${s.score} / ${test.questions.length}`,
      s.correctCount,
      s.wrongCount,
      s.unansweredCount
    ]);
    autoTable(doc, {
      startY: startY + 5,
      head: [["Rank", "Sr. No.", "Name", "Score", "Correct", "Wrong", "Unattempted"]],
      body: tableData,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 10,
        textColor: [40, 40, 40],
        lineColor: [226, 232, 240],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      }
    });
  });
  doc.save(`${safeFile(test.title)}-section-results.pdf`);
}
function StudentResultView({ test, s }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900", children: s.name }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs", children: [
          "(",
          s.srNo,
          ")"
        ] }),
        " · Class 10-",
        s.section
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total score", value: `${s.score} / ${test.questions.length}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Correct answers", value: String(s.correctCount), valueClass: "text-emerald-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Wrong answers", value: String(s.wrongCount), valueClass: "text-red-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Unattempted", value: String(s.unansweredCount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Tab switches", value: String(s.tabSwitches ?? 0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Status", value: statusText(s) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-5 space-y-4", children: test.questions.map((q, i) => {
      const chosen = s.answers?.[q.id];
      const chosenOrig = chosen !== void 0 && chosen !== null ? s.optionOrder?.[q.id]?.[chosen] : void 0;
      const unanswered = chosenOrig === void 0;
      const isCorrect = chosenOrig === q.correctIndex;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg border border-slate-200 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-500", children: [
            i + 1,
            "."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KatexText, { text: q.text }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "rounded-full px-2 py-0.5 text-xs font-semibold " + (unanswered ? "bg-slate-200 text-slate-700" : isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"),
              children: unanswered ? "Unattempted" : isCorrect ? "Correct" : "Wrong"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-1.5 text-sm", children: q.options.map((opt, idx) => {
          const isStudent = idx === chosenOrig;
          const isAnswer = idx === q.correctIndex;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-2 rounded border p-2 " + (isAnswer ? "border-emerald-300 bg-emerald-50" : isStudent ? "border-red-300 bg-red-50" : "border-slate-200"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-slate-500", children: [
                  String.fromCharCode(65 + idx),
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KatexText, { text: opt }) }),
                isAnswer && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-emerald-700", children: "correct answer" }),
                isStudent && !isAnswer && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-red-700", children: "student chose" })
              ]
            },
            idx
          );
        }) }),
        q.explanation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded bg-slate-50 p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wide text-slate-500", children: "Explanation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KatexText, { text: q.explanation }) })
        ] })
      ] }, q.id);
    }) })
  ] });
}
function Stat({ label, value, valueClass = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded bg-white px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wide text-slate-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold text-slate-900 " + valueClass, children: value })
  ] });
}
export {
  StudentResultView as S,
  exportSectionReportPdf as a,
  exportClassReportPdf as e,
  regradeSubmission as r,
  statusText as s
};
