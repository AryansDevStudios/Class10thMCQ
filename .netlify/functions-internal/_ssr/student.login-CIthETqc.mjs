import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { g as getDoc, b as doc } from "../_libs/firebase__firestore.mjs";
import { F as FIREBASE_CONFIGURED, d as db } from "./firebase-BOBCTMcs.mjs";
import { u as useAuth } from "./router-QEy6FD-2.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function StudentLogin() {
  const navigate = useNavigate();
  const {
    loginStudent
  } = useAuth();
  const [srNo, setSrNo] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!FIREBASE_CONFIGURED) {
      setError("Firebase not configured. See homepage notice.");
      return;
    }
    setLoading(true);
    try {
      const snap = await getDoc(doc(db(), "students", srNo.trim()));
      if (!snap.exists()) {
        setError("No student with that Sr. No.");
      } else {
        const data = snap.data();
        if (data.password !== password) {
          setError("Incorrect password. Ask administration to reset it.");
        } else {
          loginStudent({
            srNo: srNo.trim(),
            name: data.name,
            section: data.section
          });
          navigate({
            to: "/student"
          });
        }
      }
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-50 px-6 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm text-slate-600 hover:text-slate-900", children: "← Back to home" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-2xl font-bold text-slate-900", children: "Student Login" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Sr. No.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: srNo, onChange: (e) => setSrNo(e.target.value), required: true, className: "input", autoFocus: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "input" }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loading, className: "btn-primary w-full", children: loading ? "Signing in…" : "Sign In" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-slate-600", children: [
        "New student?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/student/register", className: "text-blue-600 hover:underline", children: "Register" })
      ] })
    ] })
  ] }) });
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
export {
  StudentLogin as component
};
