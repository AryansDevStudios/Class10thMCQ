import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getServerConfig } from "../config.server";

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

export function getFirebaseServer() {
  const config = getServerConfig();

  if (!config.firebaseConfig.apiKey) {
    throw new Error("Server Firebase is not configured. Missing FIREBASE_API_KEY in .env");
  }

  if (!app) {
    // Only initialize if there isn't already an app.
    // getApps() returns an array of initialized apps.
    app = getApps()[0] ?? initializeApp(config.firebaseConfig as any);
    dbInstance = getFirestore(app);
  }
  return { app: app!, db: dbInstance! };
}

export function dbServer() {
  return getFirebaseServer().db;
}
