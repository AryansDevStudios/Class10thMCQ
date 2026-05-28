import "../_libs/firebase.mjs";
import { f as getFirestore } from "../_libs/firebase__firestore.mjs";
import { c as getApps, i as initializeApp } from "../_libs/firebase__app.mjs";
const firebaseConfig = {
  apiKey: "AIzaSyC-uI5RF7muhHGJqkQhyJQrXqEUDnWXA0k",
  authDomain: "studio-5937601749-9a26f.firebaseapp.com",
  projectId: "studio-5937601749-9a26f",
  storageBucket: "studio-5937601749-9a26f.firebasestorage.app",
  messagingSenderId: "129607235862",
  appId: "1:129607235862:web:abe3bc7c1ba934bcc07837"
};
const FIREBASE_CONFIGURED = !firebaseConfig.apiKey.includes("REPLACE_ME");
let app = null;
let dbInstance = null;
function getFirebase() {
  if (!FIREBASE_CONFIGURED) {
    throw new Error(
      "Firebase is not configured. Edit src/lib/firebase.ts and paste your Firebase Web App config."
    );
  }
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
    dbInstance = getFirestore(app);
  }
  return { app, db: dbInstance };
}
function db() {
  return getFirebase().db;
}
const ADMIN_CODE = "mpps1234mcq";
export {
  ADMIN_CODE as A,
  FIREBASE_CONFIGURED as F,
  db as d
};
