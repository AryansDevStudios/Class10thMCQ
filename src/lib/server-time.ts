import { useEffect, useRef, useState } from "react";
import { syncServerTimeFn } from "@/server.functions/time.functions";

// Computes offset = serverNow - Date.now(). Use getServerNow() everywhere
// instead of Date.now() for time-sensitive logic.

let cachedOffset = 0;
let lastSync = 0;

export async function syncServerTime(): Promise<number> {
  try {
    const data = await syncServerTimeFn();
    const serverNow = data.serverNow;
    cachedOffset = serverNow - Date.now();
    lastSync = Date.now();
  } catch (e) {
    console.error("Failed to sync time", e);
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
