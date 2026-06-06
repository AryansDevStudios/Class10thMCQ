import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-QEy6FD-2.mjs";
import { A as ADMIN_CODE } from "./firebase-BOBCTMcs.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__firestore.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function AdminShell() {
  const { isAdmin, setAdmin } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "min-h-screen bg-slate-50 px-6 py-16",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "mx-auto max-w-md",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
            to: "/",
            className: "text-sm text-slate-600 hover:text-slate-900",
            children: "← Back to home",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
            className: "mt-3 text-2xl font-bold text-slate-900",
            children: "Admin Access",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "mt-1 text-sm text-slate-600",
            children: "Enter the shared management code.",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onSubmit: (e) => {
              e.preventDefault();
              if (code === ADMIN_CODE) {
                setAdmin(true);
              } else {
                setError("Incorrect code.");
              }
            },
            className: "mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                type: "password",
                autoFocus: true,
                value: code,
                onChange: (e) => setCode(e.target.value),
                className: "input",
                placeholder: "Admin code",
              }),
              error &&
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                  className: "text-sm text-red-600",
                  children: error,
                }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                className: "btn-primary w-full",
                children: "Enter",
              }),
            ],
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "min-h-screen bg-slate-50",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", {
        className: "border-b border-slate-200 bg-white",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "mx-auto flex max-w-5xl items-center justify-between px-6 py-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", {
              className: "flex items-center gap-5 text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                  to: "/admin",
                  className: "font-semibold text-slate-900",
                  children: "Admin",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                  to: "/admin/tests",
                  className: "text-slate-600 hover:text-slate-900",
                  children: "Tests",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                  to: "/admin/students",
                  className: "text-slate-600 hover:text-slate-900",
                  children: "Students",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              onClick: () => {
                setAdmin(false);
                navigate({
                  to: "/",
                });
              },
              className: "btn-ghost",
              children: "Log out",
            }),
          ],
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", {
        className: "mx-auto max-w-5xl px-6 py-8",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
      }),
    ],
  });
}
export { AdminShell as component };
