import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import {
  e as getDocs,
  q as query,
  h as orderBy,
  c as collection,
  d as deleteDoc,
  b as doc,
} from "../_libs/firebase__firestore.mjs";
import { F as FIREBASE_CONFIGURED, d as db } from "./firebase-BOBCTMcs.mjs";
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
function TestsList() {
  const [tests, setTests] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const load = async () => {
    if (!FIREBASE_CONFIGURED) {
      setLoading(false);
      return;
    }
    const snap = await getDocs(query(collection(db(), "tests"), orderBy("startAt", "desc")));
    setTests(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })),
    );
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const onDelete = async (id) => {
    if (!confirm("Delete this test? Submissions will remain orphaned in Firestore.")) return;
    await deleteDoc(doc(db(), "tests", id));
    load();
  };
  const now = Date.now();
  const statusLabel = (t) => {
    if (now < t.startAt)
      return {
        text: "Upcoming",
        cls: "bg-slate-200 text-slate-700",
      };
    if (now < t.endAt)
      return {
        text: "Active",
        cls: "bg-emerald-100 text-emerald-700",
      };
    return {
      text: "Ended",
      cls: "bg-slate-100 text-slate-500",
    };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
            className: "text-2xl font-bold text-slate-900",
            children: "Tests",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
            to: "/admin/tests/new",
            className: "btn-primary",
            children: "+ New test",
          }),
        ],
      }),
      loading
        ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "mt-6 text-sm text-slate-500",
            children: "Loading…",
          })
        : tests.length === 0
          ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
              className: "mt-6 text-sm text-slate-500",
              children: "No tests yet. Create one to get started.",
            })
          : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", {
              className: "mt-6 space-y-3",
              children: tests.map((t) => {
                const s = statusLabel(t);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className:
                      "flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "font-medium text-slate-900",
                                children: t.title,
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "rounded-full px-2 py-0.5 text-xs font-medium " + s.cls,
                                children: s.text,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                            className: "text-xs text-slate-500",
                            children: [
                              new Date(t.startAt).toLocaleString(),
                              " → ",
                              new Date(t.endAt).toLocaleString(),
                              " ·",
                              " ",
                              t.questions?.length ?? 0,
                              " questions",
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex gap-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                            to: "/admin/tests/$testId/results",
                            params: {
                              testId: t.id,
                            },
                            className: "btn-secondary",
                            children: "Results",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                            onClick: () => onDelete(t.id),
                            className: "btn-danger",
                            children: "Delete",
                          }),
                        ],
                      }),
                    ],
                  },
                  t.id,
                );
              }),
            }),
    ],
  });
}
export { TestsList as component };
