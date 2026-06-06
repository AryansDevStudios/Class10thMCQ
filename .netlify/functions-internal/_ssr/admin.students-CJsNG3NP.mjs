import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import {
  e as getDocs,
  c as collection,
  u as updateDoc,
  b as doc,
  d as deleteDoc,
} from "../_libs/firebase__firestore.mjs";
import { F as FIREBASE_CONFIGURED, d as db } from "./firebase-BOBCTMcs.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/idb.mjs";
import "../_libs/firebase__webchannel-wrapper.mjs";
import "util";
import "crypto";
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
import "stream";
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
function StudentsPage() {
  const [rows, setRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [filter, setFilter] = reactExports.useState("");
  const load = async () => {
    if (!FIREBASE_CONFIGURED) {
      setLoading(false);
      return;
    }
    const snap = await getDocs(collection(db(), "students"));
    setRows(
      snap.docs
        .map((d) => d.data())
        .sort((a, b) => (a.section + a.srNo).localeCompare(b.section + b.srNo)),
    );
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const resetPwd = async (srNo) => {
    const next = prompt("New password for " + srNo + ":");
    if (!next) return;
    await updateDoc(doc(db(), "students", srNo), {
      password: next,
    });
    load();
  };
  const remove = async (srNo) => {
    if (!confirm("Delete student " + srNo + "?")) return;
    await deleteDoc(doc(db(), "students", srNo));
    load();
  };
  const filtered = rows.filter((r) =>
    [r.srNo, r.name, r.section].some((v) => v.toLowerCase().includes(filter.toLowerCase())),
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", {
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
            className: "text-2xl font-bold text-slate-900",
            children: "Students",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
            value: filter,
            onChange: (e) => setFilter(e.target.value),
            placeholder: "Search…",
            className: "input max-w-xs",
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "mt-2 text-xs text-amber-700",
        children:
          "Passwords are stored in plain text per requirements — visible to administration.",
      }),
      loading
        ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "mt-6 text-sm text-slate-500",
            children: "Loading…",
          })
        : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
              className: "min-w-full text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                  className: "bg-slate-50 text-left text-xs uppercase text-slate-500",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "px-3 py-2",
                        children: "Sr. No.",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "px-3 py-2",
                        children: "Name",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "px-3 py-2",
                        children: "Section",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "px-3 py-2",
                        children: "Password",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "px-3 py-2",
                        children: "WhatsApp",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2" }),
                    ],
                  }),
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                  children: [
                    filtered.map((r) =>
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "tr",
                        {
                          className: "border-t border-slate-100",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                              className: "px-3 py-2 font-mono",
                              children: r.srNo,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                              className: "px-3 py-2",
                              children: r.name,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                              className: "px-3 py-2",
                              children: ["10-", r.section],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                              className: "px-3 py-2 font-mono",
                              children: r.password,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                              className: "px-3 py-2 font-mono",
                              children: r.whatsapp || "-",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                              className: "px-3 py-2 text-right",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                  onClick: () => resetPwd(r.srNo),
                                  className: "text-blue-600 hover:underline text-xs mr-3",
                                  children: "Reset password",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                  onClick: () => remove(r.srNo),
                                  className: "text-red-600 hover:underline text-xs",
                                  children: "Delete",
                                }),
                              ],
                            }),
                          ],
                        },
                        r.srNo,
                      ),
                    ),
                    filtered.length === 0 &&
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                          colSpan: 5,
                          className: "px-3 py-8 text-center text-slate-500",
                          children: "No students.",
                        }),
                      }),
                  ],
                }),
              ],
            }),
          }),
    ],
  });
}
export { StudentsPage as component };
