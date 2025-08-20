'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';

export default function TestEmulator() {
  const [mounted, setMounted] = useState(false);

  // Firestore state
  const [docs, setDocs] = useState<DocumentData[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docsError, setDocsError] = useState<string | null>(null);

  // Auth state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time Firestore listener
  useEffect(() => {
    if (!mounted) return;

    setLoadingDocs(true);
    setDocsError(null);

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'test'),
        (snapshot: QuerySnapshot<DocumentData>) => {
          setDocs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoadingDocs(false);
        },
        (error) => {
          console.error('Firestore error:', error);
          setDocsError(error.message);
          setLoadingDocs(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      setDocsError(err.message);
      setLoadingDocs(false);
    }
  }, [mounted]);

  // Auth listener
  useEffect(() => {
    if (!mounted) return;

    setLoadingUsers(true);
    setAuthError(null);

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUsers(user ? [user] : []);
          setLoadingUsers(false);
        },
        (error) => {
          console.error('Auth error:', error);
          setAuthError(error.message);
          setLoadingUsers(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      setAuthError(err.message);
      setLoadingUsers(false);
    }
  }, [mounted]);

  const createTestUser = async () => {
    try {
      const email = `testuser${Date.now()}@example.com`;
      const password = 'password123';
      await createUserWithEmailAndPassword(auth, email, password);
      alert(`User created: ${email}`);
    } catch (err: any) {
      alert(`Error creating user: ${err.message}`);
    }
  };

  const addTestDoc = async () => {
    try {
      await addDoc(collection(db, 'test'), {
        createdAt: new Date().toISOString(),
        random: Math.random(),
      });
    } catch (err: any) {
      alert(`Error adding doc: ${err.message}`);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Firebase Emulator Test</h1>

      {/* Firestore Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Firestore Test Collection</h2>
        {loadingDocs && <p>Loading documents...</p>}
        {docsError && <p className="text-red-500">Error: {docsError}</p>}
        <ul className="list-disc pl-6">
          {docs.map((doc) => (
            <li key={doc.id}>
              ID: {doc.id} | Random: {doc.random} | Created: {doc.createdAt}
            </li>
          ))}
        </ul>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={addTestDoc}
        >
          Add Firestore Document
        </button>
      </section>

      {/* Auth Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Auth Users</h2>
        {loadingUsers && <p>Loading user info...</p>}
        {authError && <p className="text-red-500">Error: {authError}</p>}
        <ul className="list-disc pl-6">
          {users.map((user) => (
            <li key={user.uid}>
              {user.email} | UID: {user.uid} | Logged in: {user.metadata.creationTime}
            </li>
          ))}
        </ul>
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          onClick={createTestUser}
        >
          Create Test Auth User
        </button>
      </section>
    </div>
  );
}
