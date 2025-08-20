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
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    setLoading(true);
    const q = query(collection(db, 'test'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDocs(data);
      setLoading(false);
    }, (err) => {
      console.error("Firestore snapshot error:", err);
      setError("Failed to load Firestore documents.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    // This is a placeholder as client SDK cannot list users.
    // In a real app, you might fetch this from a secure backend endpoint.
    const interval = setInterval(async () => {
      try {
        setUsers([]); // Placeholder
      } catch (err) {
        console.error('Error listing users:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [mounted]);

  const addFirestoreDoc = async () => {
    try {
      await addDoc(collection(db, 'test'), { createdAt: new Date() });
    } catch (err) {
      console.error(err);
      alert('Failed to add document.');
    }
  };

  const createAuthUser = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert(`User created: ${userCredential.user.email}`);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      alert('Failed to create user. See console for details.');
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Firebase Emulator Test</h1>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}

      <div className="p-6 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Firestore (Real-time)</h2>
        <button
          onClick={addFirestoreDoc}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          Add Firestore Doc
        </button>
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md max-h-60 overflow-y-auto">
          <h3 className="font-semibold mb-2">Documents in 'test' collection:</h3>
          {loading ? (
            <p>Loading documents...</p>
          ) : (
            <pre className="text-sm">{JSON.stringify(docs, null, 2)}</pre>
          )}
        </div>
      </div>

      <div className="p-6 border rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2 rounded-md w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded-md w-full"
          />
          <button
            onClick={createAuthUser}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-400"
          >
            Create Auth User
          </button>
        </div>
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Auth Users (Emulator only):</h3>
          <p className="text-sm text-gray-500 mb-2">Note: Real-time user listing requires Admin SDK on a backend. This is a placeholder.</p>
          <pre className="text-sm">{JSON.stringify(users, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
