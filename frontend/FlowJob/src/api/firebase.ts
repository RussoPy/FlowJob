// src/api/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Import variables from .env using the names defined in your env.d.ts
import {
    REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_FIREBASE_PROJECT_ID,
    REACT_APP_FIREBASE_STORAGE_BUCKET,
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    REACT_APP_FIREBASE_APP_ID,
    REACT_APP_FIREBASE_MEASUREMENT_ID
    // Maps_API_KEY // Import this if needed elsewhere
} from '@env';

// Use the imported variables with REACT_APP_ prefix
const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_API_KEY,
  authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_FIREBASE_APP_ID,
  measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase App (handles hot reloading correctly)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app); // Simplified Firestore initialization

// Export the initialized services and config
export { app, auth, db, storage, firebaseConfig };

// Optional runtime check (useful during development)
if (!REACT_APP_FIREBASE_API_KEY || !REACT_APP_FIREBASE_AUTH_DOMAIN || !REACT_APP_FIREBASE_PROJECT_ID || !REACT_APP_FIREBASE_APP_ID) {
    console.error("🔥🔥 FATAL ERROR: Missing Firebase configuration in .env file (expected REACT_APP_... variables)! 🔥🔥");
}