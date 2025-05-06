import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore'; // Notice Firestore type
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Load environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ✅ Correct way to type Firestore
let db: Firestore;

if (getApps().length > 0) {
  db = getFirestore(app); // Reuse
} else {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }); // Init only first time
}

export const auth = getAuth(app);
export const storage = getStorage(app);
export { db, firebaseConfig };
