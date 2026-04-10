import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredValues = Object.values(firebaseConfig).filter((value) => value !== undefined);
export const firebaseReady = requiredValues.length === 6 && requiredValues.every((value) => value !== "");
export const realtimeStoreId = import.meta.env.VITE_FIREBASE_STORE_ID || "housepod-main";

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

if (firebaseReady) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firestoreDb = getFirestore(firebaseApp);
}

export { firebaseApp, firestoreDb };
