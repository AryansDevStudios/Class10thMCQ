import { b as doc, j as setDoc, g as getDoc, s as serverTimestamp } from "../_libs/firebase__firestore.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { F as FIREBASE_CONFIGURED, d as db } from "./firebase-BOBCTMcs.mjs";
import { r as reactKatexExports } from "../_libs/react-katex.mjs";
let cachedOffset = 0;
let lastSync = 0;
async function syncServerTime() {
  if (!FIREBASE_CONFIGURED) return 0;
  const ref = doc(db(), "_meta", "heartbeat");
  await setDoc(ref, { t: serverTimestamp() }, { merge: true });
  const snap = await getDoc(ref);
  const t = snap.data()?.t;
  if (t && typeof t.toMillis === "function") {
    const serverNow = t.toMillis();
    cachedOffset = serverNow - Date.now();
    lastSync = Date.now();
  }
  return cachedOffset;
}
function getServerNow() {
  return Date.now() + cachedOffset;
}
function useServerNow(tickMs = 250) {
  const [now, setNow] = reactExports.useState(() => getServerNow());
  const synced = reactExports.useRef(false);
  reactExports.useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        await syncServerTime();
        if (!cancelled) {
          synced.current = true;
          setNow(getServerNow());
        }
      } catch (e) {
        console.error("server time sync failed", e);
      }
    };
    init();
    const tick = setInterval(() => setNow(getServerNow()), tickMs);
    const resync = setInterval(() => {
      syncServerTime().catch(() => {
      });
    }, 3e4);
    return () => {
      cancelled = true;
      clearInterval(tick);
      clearInterval(resync);
    };
  }, [tickMs]);
  return { now, synced: synced.current || Date.now() - lastSync < 6e4 };
}
function KatexText({ text }) {
  if (!text) return null;
  const parts = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === "$" && text[i + 1] === "$") {
      const end = text.indexOf("$$", i + 2);
      if (end === -1) {
        parts.push({ type: "text", value: text.slice(i) });
        break;
      }
      parts.push({ type: "block", value: text.slice(i + 2, end) });
      i = end + 2;
    } else if (text[i] === "$") {
      const end = text.indexOf("$", i + 1);
      if (end === -1) {
        parts.push({ type: "text", value: text.slice(i) });
        break;
      }
      parts.push({ type: "inline", value: text.slice(i + 1, end) });
      i = end + 1;
    } else {
      const nextDollar = text.indexOf("$", i);
      const end = nextDollar === -1 ? text.length : nextDollar;
      parts.push({ type: "text", value: text.slice(i, end) });
      i = end;
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "katex-text", children: parts.map((p, idx) => {
    if (p.type === "text") return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, { children: p.value }, idx);
    try {
      return p.type === "inline" ? /* @__PURE__ */ jsxRuntimeExports.jsx(reactKatexExports.InlineMath, { math: p.value }, idx) : /* @__PURE__ */ jsxRuntimeExports.jsx(reactKatexExports.BlockMath, { math: p.value }, idx);
    } catch {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: p.value }, idx);
    }
  }) });
}
export {
  KatexText as K,
  getServerNow as g,
  useServerNow as u
};
