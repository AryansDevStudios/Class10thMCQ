// Firebase client config.
//
// 1) Create a Firebase project at https://console.firebase.google.com
// 2) Add a Web App, copy the firebaseConfig values, and paste them below.
// 3) Enable Cloud Firestore (start in "test mode", then paste the rules
//    from src/lib/firestore.rules.txt into Firestore > Rules).
//
// These values are publishable (safe in client code). Security is enforced
// by the Firestore rules, not by hiding the config.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-uI5RF7muhHGJqkQhyJQrXqEUDnWXA0k",
  authDomain: "studio-5937601749-9a26f.firebaseapp.com",
  projectId: "studio-5937601749-9a26f",
  storageBucket: "studio-5937601749-9a26f.firebasestorage.app",
  messagingSenderId: "129607235862",
  appId: "1:129607235862:web:abe3bc7c1ba934bcc07837",
};

export const FIREBASE_CONFIGURED = !firebaseConfig.apiKey.includes("REPLACE_ME");

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

export function getFirebase() {
  if (!FIREBASE_CONFIGURED) {
    throw new Error(
      "Firebase is not configured. Edit src/lib/firebase.ts and paste your Firebase Web App config."
    );
  }
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
    dbInstance = getFirestore(app);
  }
  return { app: app!, db: dbInstance! };
}

export function db() {
  return getFirebase().db;
}

// Shared admin code — change this to whatever your school uses.
export const ADMIN_CODE = "mpps1234mcq";
