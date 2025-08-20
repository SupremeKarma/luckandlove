
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionUsers, setSessionUsers] = useState<User[]>([]); // Tracks all users created in the session
  const [loadingAuth, setLoadingAuth] = useState(true);
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

  // Auth listener for current user
  useEffect(() => {
    if (!mounted) return;

    setLoadingAuth(true);
    setAuthError(null);

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);
          setLoadingAuth(false);
        },
        (error) => {
          console.error('Auth error:', error);
          setAuthError(error.message);
          setLoadingAuth(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      setAuthError(err.message);
      setLoadingAuth(false);
    }
  }, [mounted]);

  const createTestUser = async () => {
    try {
      const email = `testuser${Date.now()}@example.com`;
      const password = 'password123';
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Add new user to our session list
      setSessionUsers((prevUsers) => [...prevUsers, userCredential.user]);
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
        <h2 className="text-xl font-semibold mb-2">Firestore ('/test')</h2>
        {loadingDocs && <p>Loading documents...</p>}
        {docsError && <p className="text-red-500">Error: {docsError}</p>}
        <ul className="list-disc pl-6 text-sm">
          {docs.map((doc) => (
            <li key={doc.id}>
              ID: {doc.id} | Random: {doc.random} | Created: {doc.createdAt}
            </li>
          ))}
          {docs.length === 0 && !loadingDocs && <li>No documents yet.</li>}
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
        <h2 className="text-xl font-semibold mb-2">Auth</h2>
        {loadingAuth && <p>Loading auth state...</p>}
        {authError && <p className="text-red-500">Error: {authError}</p>}
        <div>
          <h3 className="font-semibold">Current User:</h3>
          {currentUser ? (
             <p className="text-sm">{currentUser.email} | UID: {currentUser.uid}</p>
          ) : (
            <p className="text-sm">No user signed in.</p>
          )}
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Users Created in this Session:</h3>
           <ul className="list-disc pl-6 text-sm">
              {sessionUsers.map((user) => (
                <li key={user.uid}>
                  {user.email} | UID: {user.uid} | Created: {user.metadata.creationTime}
                </li>
              ))}
              {sessionUsers.length === 0 && <li>No users created yet.</li>}
            </ul>
        </div>
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
