import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
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
function AdminHome() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
        className: "text-2xl font-bold text-slate-900",
        children: "Management Dashboard",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "grid gap-4 sm:grid-cols-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
            to: "/admin/tests",
            className:
              "rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-400",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "text-lg font-semibold",
                children: "Tests",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-sm text-slate-600",
                children: "Create tests, schedule windows, view live results.",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
            to: "/admin/students",
            className:
              "rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-400",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "text-lg font-semibold",
                children: "Students",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-sm text-slate-600",
                children: "View registrations and reset passwords.",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
export { AdminHome as component };
