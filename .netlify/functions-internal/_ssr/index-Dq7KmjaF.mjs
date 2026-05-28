import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { F as FIREBASE_CONFIGURED } from "./firebase-BOBCTMcs.mjs";
import { u as useAuth } from "./router-QEy6FD-2.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__firestore.mjs";
import { G as GraduationCap, S as ShieldCheck } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function Home() {
  const {
    student,
    isAdmin
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (student) navigate({
      to: "/student"
    });
    else if (isAdmin) navigate({
      to: "/admin"
    });
  }, [student, isAdmin, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-6 py-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl", children: "Class 10th MCQ Test" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-slate-600", children: "Secure, real-time MCQ tests for MP Public School, Anandnagar Maharajganj." })
    ] }),
    !FIREBASE_CONFIGURED && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Setup required:" }),
      " Edit ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "src/lib/firebase.ts" }),
      " and paste your Firebase Web App config. Then enable Firestore in the Firebase console and apply the rules from ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "src/lib/firestore.rules.txt" }),
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-6 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/student/login", className: "group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-blue-400 hover:shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-10 w-10 text-blue-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-slate-900", children: "Student" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-600", children: "Log in with your Sr. No. to take active tests." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-emerald-400 hover:shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-10 w-10 text-emerald-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-slate-900", children: "Management / Teacher" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-600", children: "Create tests, schedule windows, view live results." })
      ] })
    ] })
  ] }) });
}
export {
  Home as component
};
