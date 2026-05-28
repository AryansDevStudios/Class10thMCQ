import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as doc, g as getDoc, j as setDoc, s as serverTimestamp } from "../_libs/firebase__firestore.mjs";
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
function StudentRegister() {
  const navigate = useNavigate();
  const {
    loginStudent
  } = useAuth();
  const [srNo, setSrNo] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [section, setSection] = reactExports.useState("A");
  const [password, setPassword] = reactExports.useState("");
  const [whatsapp, setWhatsapp] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!FIREBASE_CONFIGURED) {
      setError("Firebase not configured. See homepage notice.");
      return;
    }
    if (!srNo.trim() || !name.trim() || !password || !whatsapp.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!/^\d{4}$/.test(srNo.trim())) {
      setError("Sr. No. must be exactly 4 digits.");
      return;
    }
    if (!/^\d{10}$/.test(whatsapp.trim())) {
      setError("WhatsApp number must be exactly 10 digits.");
      return;
    }
    setLoading(true);
    try {
      const ref = doc(db(), "students", srNo.trim());
      const existing = await getDoc(ref);
      if (existing.exists()) {
        setError("That Sr. No. is already registered. Try logging in.");
        return;
      }
      await setDoc(ref, {
        srNo: srNo.trim(),
        name: name.trim(),
        class: "10",
        section,
        password,
        whatsapp: whatsapp.trim(),
        createdAt: serverTimestamp()
      });
      loginStudent({
        srNo: srNo.trim(),
        name: name.trim(),
        section,
        whatsapp: whatsapp.trim()
      });
      navigate({
        to: "/student"
      });
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-slate-50 px-6 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm text-slate-600 hover:text-slate-900", children: "← Back to home" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-2xl font-bold text-slate-900", children: "Student Registration" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-600", children: "Class 10 only." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Sr. No.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: srNo, onChange: (e) => setSrNo(e.target.value), required: true, placeholder: "e.g. 1234", maxLength: 4, className: "input" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Exactly 4 digits." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), required: true, className: "input" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Class", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: "10", disabled: true, className: "input bg-slate-100" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: section, onChange: (e) => setSection(e.target.value), className: "input", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "A", children: "A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "B", children: "B" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "H", children: "H" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Password", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "input" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Note: passwords are stored in plain text so administration can help if you forget it." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "WhatsApp Number", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: whatsapp, onChange: (e) => setWhatsapp(e.target.value), required: true, placeholder: "e.g. 9876543210", maxLength: 10, className: "input" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-slate-500", children: "Exactly 10 digits. Used for sending test results." })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loading, className: "btn-primary w-full", children: loading ? "Creating…" : "Register" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-slate-600", children: [
        "Already registered?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/student/login", className: "text-blue-600 hover:underline", children: "Login" })
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
  StudentRegister as component
};
