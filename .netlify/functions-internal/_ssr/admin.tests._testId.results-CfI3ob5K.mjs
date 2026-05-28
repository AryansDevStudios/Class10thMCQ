import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { g as getDoc, b as doc, o as onSnapshot, c as collection } from "../_libs/firebase__firestore.mjs";
import { u as utils, w as writeFileSync } from "../_libs/xlsx.mjs";
import { F as FIREBASE_CONFIGURED, d as db } from "./firebase-BOBCTMcs.mjs";
import { u as useServerNow } from "./katex-text-B3-KgC-6.mjs";
import { r as regradeSubmission, e as exportClassReportPdf, a as exportSectionReportPdf, s as statusText, S as StudentResultView } from "./StudentResultView-CMtDd-07.mjs";
import { a as Route } from "./router-QEy6FD-2.mjs";
import "../_libs/firebase.mjs";
import "../_libs/react-katex.mjs";
import "../_libs/jspdf.mjs";
import "../_libs/jspdf-autotable.mjs";
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
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
function formatTimeTaken(startedAt, submittedAt) {
  if (!startedAt || !submittedAt) return "-";
  const start = startedAt.toMillis ? startedAt.toMillis() : startedAt;
  const end = submittedAt.toMillis ? submittedAt.toMillis() : submittedAt;
  const diff = Math.max(0, end - start);
  const mins = Math.floor(diff / 6e4);
  const secs = Math.floor(diff % 6e4 / 1e3);
  return `${mins}m ${secs}s`;
}
function ResultsPage() {
  const {
    testId
  } = Route.useParams();
  const {
    now
  } = useServerNow(1e3);
  const [test, setTest] = reactExports.useState(null);
  const [subs, setSubs] = reactExports.useState([]);
  const [selectedSr, setSelectedSr] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!FIREBASE_CONFIGURED) return;
    (async () => {
      const t = await getDoc(doc(db(), "tests", testId));
      if (t.exists()) setTest({
        id: t.id,
        ...t.data()
      });
    })();
    const unsub = onSnapshot(collection(db(), "tests", testId, "submissions"), (snap) => {
      setSubs(snap.docs.map((d) => d.data()));
    });
    return () => unsub();
  }, [testId]);
  const graded = reactExports.useMemo(() => {
    if (!test) return [];
    return subs.map((s) => regradeSubmission(s, test)).sort((a, b) => b.score - a.score || a.wrongCount - b.wrongCount);
  }, [subs, test]);
  if (!test) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Loading…" });
  const ended = now >= test.endAt;
  const selected = selectedSr ? graded.find((g) => g.srNo === selectedSr) ?? null : null;
  const exportClassExcel = () => {
    const rows = graded.map((s, i) => {
      const base = {
        Rank: i + 1,
        "Sr. No.": s.srNo,
        Name: s.name,
        Section: s.section,
        "Total Score": `${s.score} / ${test.questions.length}`
      };
      return base;
    });
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Class Results");
    writeFileSync(wb, `${safeFile(test.title)}-class-results.xlsx`);
  };
  const exportStudentExcel = (s) => {
    const summary = [{
      "Sr. No.": s.srNo,
      Name: s.name,
      Section: s.section,
      "Total Score": `${s.score} / ${test.questions.length}`,
      "Correct Answers": s.correctCount,
      "Wrong Answers": s.wrongCount,
      Unattempted: s.unansweredCount,
      "Tab Switches": s.tabSwitches ?? 0,
      Status: statusText(s)
    }];
    const detail = test.questions.map((q, i) => {
      const chosen = s.answers?.[q.id];
      const chosenOrigIdx = chosen !== void 0 && chosen !== null ? s.optionOrder?.[q.id]?.[chosen] : void 0;
      const status = chosenOrigIdx === void 0 ? "Unattempted" : chosenOrigIdx === q.correctIndex ? "Correct" : "Wrong";
      return {
        "#": i + 1,
        Question: q.text,
        "Student answer": chosenOrigIdx === void 0 ? "-" : q.options[chosenOrigIdx],
        "Correct answer": q.options[q.correctIndex],
        Status: status,
        Explanation: q.explanation ?? ""
      };
    });
    const wb = utils.book_new();
    utils.book_append_sheet(wb, utils.json_to_sheet(summary), "Summary");
    utils.book_append_sheet(wb, utils.json_to_sheet(detail), "Per question");
    writeFileSync(wb, `${safeFile(test.title)}-${s.srNo}-${safeFile(s.name)}.xlsx`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/tests", className: "text-sm text-slate-600 hover:text-slate-900", children: "← All tests" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-bold text-slate-900", children: test.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
        new Date(test.startAt).toLocaleString(),
        " → ",
        new Date(test.endAt).toLocaleString(),
        " ·",
        " ",
        ended ? "Ended" : "In progress",
        " · ",
        graded.length,
        " submission",
        graded.length === 1 ? "" : "s"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: exportClassExcel, className: "btn-primary", children: "Class Excel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => exportClassReportPdf(test, graded), className: "btn-secondary", children: "Class PDF" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => exportSectionReportPdf(test, graded), className: "btn-secondary", children: "Section PDF" }),
      !ended && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "self-center text-xs text-amber-700", children: "Test still in progress — exports show a live snapshot." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-left text-xs uppercase text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Rank" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Sr.No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Sec" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Total score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 hidden sm:table-cell", children: "Time taken" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 hidden sm:table-cell", children: "Correct" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 hidden sm:table-cell", children: "Wrong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 hidden sm:table-cell", children: "Unattempted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 hidden sm:table-cell", children: "Tab switches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 hidden sm:table-cell", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        graded.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono", children: i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono", children: s.srNo }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: s.section }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 font-semibold", children: [
            s.score,
            " / ",
            test.questions.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-500 hidden sm:table-cell", children: formatTimeTaken(s.startedAt, s.submittedAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-emerald-700 hidden sm:table-cell", children: s.correctCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-red-600 hidden sm:table-cell", children: s.wrongCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-500 hidden sm:table-cell", children: s.unansweredCount }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 hidden sm:table-cell " + ((s.tabSwitches ?? 0) > 0 ? "text-amber-700 font-semibold" : ""), children: s.tabSwitches ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs hidden sm:table-cell", children: statusText(s) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right", children: [
            s.whatsapp && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              const msg = `Result for ${s.name} (Section ${s.section}): ${s.score} / ${test.questions.length}`;
              window.open(`https://wa.me/91${s.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
            }, className: "text-emerald-600 hover:underline text-xs mr-3 font-semibold", children: "WhatsApp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedSr(s.srNo), className: "text-blue-600 hover:underline text-xs", children: "View detail" })
          ] })
        ] }, s.srNo)),
        graded.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 11, className: "px-3 py-8 text-center text-slate-500", children: "No submissions yet." }) })
      ] })
    ] }) }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx(StudentDetailModal, { test, s: selected, onClose: () => setSelectedSr(null), onExportExcel: () => exportStudentExcel(selected) })
  ] });
}
function StudentDetailModal({
  test,
  s,
  onClose,
  onExportExcel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-10 w-full max-w-3xl rounded-xl bg-white shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between border-b border-slate-200 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-slate-900", children: [
        test.title,
        " — student detail"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-slate-900 text-2xl leading-none", children: "×" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-slate-100 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onExportExcel, className: "btn-secondary", children: "Download Excel" }),
      s.whatsapp && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        const msg = `Result for ${s.name} (Section ${s.section}): ${s.score} / ${test.questions.length}`;
        window.open(`https://wa.me/91${s.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
      }, className: "btn-primary bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white", children: "Send on WhatsApp" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StudentResultView, { test, s }) })
  ] }) });
}
function safeFile(s) {
  return s.replace(/[^a-z0-9-_]+/gi, "_");
}
export {
  ResultsPage as component
};
