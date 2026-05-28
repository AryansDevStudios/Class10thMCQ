import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db, FIREBASE_CONFIGURED } from "./firebase";

// Computes offset = serverNow - Date.now(). Use getServerNow() everywhere
// instead of Date.now() for time-sensitive logic.

let cachedOffset = 0;
let lastSync = 0;

export async function syncServerTime(): Promise<number> {
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

export function getServerNow() {
  return Date.now() + cachedOffset;
}

export function useServerNow(tickMs = 250) {
  const [now, setNow] = useState(() => getServerNow());
  const synced = useRef(false);

  useEffect(() => {
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
      syncServerTime().catch(() => {});
    }, 30_000);
    return () => {
      cancelled = true;
      clearInterval(tick);
      clearInterval(resync);
    };
  }, [tickMs]);

  return { now, synced: synced.current || Date.now() - lastSync < 60_000 };
}
