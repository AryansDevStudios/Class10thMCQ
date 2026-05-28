import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { e as getDocs, q as query, h as orderBy, c as collection, g as getDoc, b as doc } from "../_libs/firebase__firestore.mjs";
import { F as FIREBASE_CONFIGURED, d as db } from "./firebase-BOBCTMcs.mjs";
import { u as useAuth } from "./router-QEy6FD-2.mjs";
import { u as useServerNow } from "./katex-text-B3-KgC-6.mjs";
import { r as regradeSubmission, S as StudentResultView } from "./StudentResultView-CMtDd-07.mjs";
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
function StudentHome() {
  const {
    student,
    logoutStudent
  } = useAuth();
  const navigate = useNavigate();
  const {
    now
  } = useServerNow(1e3);
  const [tests, setTests] = reactExports.useState([]);
  const [submittedIds, setSubmittedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [loading, setLoading] = reactExports.useState(true);
  const [tab, setTab] = reactExports.useState("live");
  const [viewing, setViewing] = reactExports.useState(null);
  const [viewLoading, setViewLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!student) {
      navigate({
        to: "/student/login"
      });
      return;
    }
    if (!FIREBASE_CONFIGURED) {
      setLoading(false);
      return;
    }
    (async () => {
      const snap = await getDocs(query(collection(db(), "tests"), orderBy("startAt", "desc")));
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      setTests(list);
      const results = await Promise.all(list.map(async (t) => {
        try {
          const sub = await getDoc(doc(db(), "tests", t.id, "submissions", student.srNo));
          return sub.exists() && sub.data().submittedAt ? t.id : null;
        } catch {
          return null;
        }
      }));
      setSubmittedIds(new Set(results.filter((x) => !!x)));
      setLoading(false);
    })();
  }, [student, navigate]);
  const openResult = async (t) => {
    if (!student) return;
    setViewLoading(true);
    try {
      const sub = await getDoc(doc(db(), "tests", t.id, "submissions", student.srNo));
      if (!sub.exists()) return;
      const graded = regradeSubmission(sub.data(), t);
      setViewing({
        test: t,
        graded
      });
    } finally {
      setViewLoading(false);
    }
  };
  if (!student) return null;
  const live = tests.filter((t) => now >= t.startAt && now < t.endAt);
  const upcoming = tests.filter((t) => now < t.startAt);
  const past = tests.filter((t) => now >= t.endAt);
  const groups = {
    live: {
      label: `Live now (${live.length})`,
      items: live,
      empty: "No tests are live right now. Check back at the scheduled start time."
    },
    upcoming: {
      label: `Upcoming (${upcoming.length})`,
      items: upcoming,
      empty: "No upcoming tests scheduled."
    },
    past: {
      label: `Past (${past.length})`,
      items: past,
      empty: "You have no past tests yet."
    }
  };
  const current = groups[tab];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-xs text-slate-500 hover:text-slate-800", children: "← Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-1 text-2xl font-bold text-slate-900", children: [
            "Welcome, ",
            student.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-600", children: [
            "Sr. No. ",
            student.srNo,
            " · Class 10-",
            student.section
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          logoutStudent();
          navigate({
            to: "/"
          });
        }, className: "btn-ghost", children: "Log out" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex gap-2 border-b border-slate-200", children: ["live", "upcoming", "past"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(k), className: "px-4 py-2 text-sm font-medium transition border-b-2 -mb-px " + (tab === k ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"), children: groups[k].label }, k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Loading…" }) : current.items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: current.empty }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: current.items.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900", children: t.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
            new Date(t.startAt).toLocaleString(),
            " → ",
            new Date(t.endAt).toLocaleString()
          ] })
        ] }),
        tab === "live" && !submittedIds.has(t.id) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/student/test/$testId", params: {
          testId: t.id
        }, className: "btn-primary", children: [
          "Start test · ",
          fmtRemaining(t.endAt - now)
        ] }),
        tab === "live" && submittedIds.has(t.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700", children: "✓ Already submitted" }),
        tab === "upcoming" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-500", children: "Not yet open" }),
        tab === "past" && submittedIds.has(t.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openResult(t), className: "btn-primary", disabled: viewLoading, children: viewLoading ? "Loading…" : "View result" }),
        tab === "past" && !submittedIds.has(t.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-500", children: "Not attempted" })
      ] }, t.id)) }) })
    ] }),
    viewing && /* @__PURE__ */ jsxRuntimeExports.jsx(StudentResultModal, { test: viewing.test, graded: viewing.graded, onClose: () => setViewing(null) })
  ] });
}
function StudentResultModal({
  test,
  graded,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-6 w-full max-w-3xl rounded-xl bg-white shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between border-b border-slate-200 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-slate-900", children: test.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Your result" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "text-slate-500 hover:text-slate-900 text-2xl leading-none", children: "×" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StudentResultView, { test, s: graded }) })
  ] }) });
}
function fmtRemaining(ms) {
  if (ms <= 0) return "—";
  const s = Math.floor(ms / 1e3);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h) return `${h}h ${m % 60}m left`;
  return `${m}m ${s % 60}s left`;
}
export {
  StudentHome as component
};
