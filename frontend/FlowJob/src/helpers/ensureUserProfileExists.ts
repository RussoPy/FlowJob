// src/helpers/ensureUserProfileExists.ts
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../api/firebase'; // adjust path if needed

export async function ensureUserProfileExists() {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      id: uid,
      email: auth.currentUser?.email || '',
      username: '',
      firstName: '',
      lastName: '',
      phone: auth.currentUser?.phoneNumber || '',
      profileComplete: false,
      liked_jobs: [],
      matched_jobs: [],
      disliked_jobs: {},
      created_at: serverTimestamp(),
    });

    console.log('✅ Firestore user document created');
  } else {
    console.log('📦 Firestore user already exists');
  }
}
