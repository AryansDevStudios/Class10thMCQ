import { createServerFn } from "@tanstack/react-start";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { dbServer } from "../lib/firebase.server";

export const syncServerTimeFn = createServerFn({ method: "POST" }).handler(async () => {
  const ref = doc(dbServer(), "_meta", "heartbeat");
  await setDoc(ref, { t: serverTimestamp() }, { merge: true });
  const snap = await getDoc(ref);
  const t = snap.data()?.t;
  if (t && typeof t.toMillis === "function") {
    return { serverNow: t.toMillis() };
  }
  return { serverNow: Date.now() };
});
