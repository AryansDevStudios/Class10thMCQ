import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Question, Submission, TestDoc } from "./types";

export type Graded = Submission & {
  score: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
};

function statusText(s: { submittedAt: number | null; autoSubmitted: boolean }) {
  if (!s.submittedAt) return "In progress";
  return s.autoSubmitted ? "Auto-submitted" : "Submitted";
}

function safeFile(s: string) {
  return s.replace(/[^a-z0-9-_]+/gi, "_");
}

/** Helper used elsewhere (admin results) to regrade a submission against a test. */
export function regradeSubmission(s: Submission, test: TestDoc): Graded {
  const hasStored =
    typeof s.correctCount === "number" &&
    typeof s.wrongCount === "number" &&
    typeof s.unansweredCount === "number";
  if (hasStored) {
    return {
      ...s,
      score: s.score ?? s.correctCount!,
      correctCount: s.correctCount!,
      wrongCount: s.wrongCount!,
      unansweredCount: s.unansweredCount!,
    };
  }
  let correct = 0,
    wrong = 0,
    unanswered = 0;
  for (const q of test.questions) {
    const chosen = s.answers?.[q.id];
    if (chosen === undefined || chosen === null) {
      unanswered++;
      continue;
    }
    const orig = s.optionOrder?.[q.id]?.[chosen];
    if (orig === q.correctIndex) correct++;
    else wrong++;
  }
  return {
    ...s,
    score: correct,
    correctCount: correct,
    wrongCount: wrong,
    unansweredCount: unanswered,
  };
}

export { statusText, safeFile };

export async function exportClassReportPdf(test: TestDoc, graded: Graded[]) {
  // Sort descending by score
  const sorted = [...graded].sort((a, b) => b.score - a.score || a.wrongCount - b.wrongCount);

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(`${test.title} - Class Results`, 14, 22);

  // Subtitle
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Submissions: ${sorted.length}`, 14, 36);

  // Table Data
  const tableData = sorted.map((s, i) => [
    i + 1,
    s.srNo,
    s.name,
    s.section,
    `${s.score} / ${test.questions.length}`,
    s.correctCount,
    s.wrongCount,
    s.unansweredCount,
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
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
  });

  doc.save(`${safeFile(test.title)}-class-results.pdf`);
}

export async function exportSectionReportPdf(test: TestDoc, graded: Graded[]) {
  const sections = Array.from(new Set(graded.map((g) => g.section))).sort();
  const doc = new jsPDF();

  let startY = 22;

  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(`${test.title} - Section-wise Results`, 14, startY);
  startY += 8;

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, startY);
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
    const sorted = [...sectionGraded].sort(
      (a, b) => b.score - a.score || a.wrongCount - b.wrongCount,
    );

    const tableData = sorted.map((s, i) => [
      i + 1,
      s.srNo,
      s.name,
      `${s.score} / ${test.questions.length}`,
      s.correctCount,
      s.wrongCount,
      s.unansweredCount,
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
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });
  });

  doc.save(`${safeFile(test.title)}-section-results.pdf`);
}
