import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../api/firebase';

const likeJob = async (userId: string, jobId: string) => {
  const ref = doc(db, 'users', userId, 'swipes', 'data');
  const docSnap = await getDoc(ref);

  // Initialize doc only if it doesn't exist
  if (!docSnap.exists()) {
    await setDoc(ref, { likes: [], dislikes: [] });
  }

  await updateDoc(ref, {
    likes: arrayUnion(jobId),
  });
};

const dislikeJob = async (userId: string, jobId: string) => {
  const ref = doc(db, 'users', userId, 'swipes', 'data');
  const docSnap = await getDoc(ref);

  if (!docSnap.exists()) {
    await setDoc(ref, { likes: [], dislikes: [] });
  }

  await updateDoc(ref, {
    dislikes: arrayUnion(jobId),
  });
};

export { likeJob, dislikeJob };