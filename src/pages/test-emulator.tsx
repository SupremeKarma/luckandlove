'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';

export default function TestEmulator() {
  const [docs, setDocs] = useState<DocumentData[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Real-time Firestore updates
    const q = query(collection(db, 'test'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDocs(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Polling emulator for users (Auth emulator doesn't have real-time listener)
    const interval = setInterval(async () => {
      try {
        // @ts-ignore Firebase Admin SDK is not in client; for emulator testing, we rely on manual login simulation
        // For true real-time, you'd need Admin SDK in a Node environment
        setUsers([]); // Placeholder: real-time user listing requires Admin SDK
      } catch (error) {
        console.error('Error listing users:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addFirestoreDoc = async () => {
    try {
      await addDoc(collection(db, 'test'), { createdAt: new Date() });
    } catch (error) {
      console.error(error);
    }
  };

  const createAuthUser = async () => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert(`User created: ${userCredential.user.email}`);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
      alert('Failed to create user');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Firebase Emulator Test</h1>

      <div className="space-y-2">
        <button
          onClick={addFirestoreDoc}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Firestore Doc
        </button>
        <div>
          <h2 className="font-semibold">Firestore Documents (Real-time):</h2>
          <pre>{JSON.stringify(docs, null, 2)}</pre>
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-2 py-1 rounded mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.targe.value)}
          className="border px-2 py-1 rounded mr-2"
        />
        <button
          onClick={createAuthUser}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Create Auth User
        </button>
        <div>
          <h2 className="font-semibold">Auth Users (Emulator only):</h2>
          <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
