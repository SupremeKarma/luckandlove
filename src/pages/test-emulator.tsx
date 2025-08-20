'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  doc,
  deleteDoc,
  writeBatch,
  updateDoc,
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';

export default function TestEmulator() {
  const [mounted, setMounted] = useState(false);

  // Firestore state
  const [docs, setDocs] = useState<DocumentData[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docsError, setDocsError] = useState<string | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionUsers, setSessionUsers] = useState<DocumentData[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');

  // Search and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const usersCol = collection(db, 'test-users');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time Firestore listener for test documents
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

    const unsubscribeAuth = onAuthStateChanged(
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

    return () => unsubscribeAuth();
  }, [mounted]);

  // Real-time listener for persisted users in Firestore
  useEffect(() => {
    if (!mounted) return;

    const q = query(usersCol, orderBy(sortField, sortDirection));

    const unsubscribeUsers = onSnapshot(
      q,
      (snapshot) => {
        const allUsers = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setSessionUsers(allUsers);
      },
      (error) => {
        console.error('Error fetching persisted users:', error);
        setAuthError('Could not fetch test users from Firestore.');
      }
    );

    return () => unsubscribeUsers();
  }, [mounted, sortField, sortDirection]);

  const createTestUser = async () => {
    try {
      const email = `testuser${Date.now()}@example.com`;
      const password = 'password123';
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(usersCol, user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      alert(`User created: ${email}`);
    } catch (err: any) {
      alert(`Error creating user: ${err.message}`);
    }
  };
  
  const deleteTestUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user record from Firestore? This does not delete the Auth user.')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'test-users', userId));
    } catch(err: any) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  const deleteAllUsers = async () => {
    if (sessionUsers.length === 0) {
      alert("No users to delete.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete all ${sessionUsers.length} user records from Firestore? This cannot be undone.`)) {
      return;
    }
    try {
      const batch = writeBatch(db);
      sessionUsers.forEach((user) => {
        const docRef = doc(db, 'test-users', user.id);
        batch.delete(docRef);
      });
      await batch.commit();
      alert('All test users have been deleted from Firestore.');
    } catch (err: any) {
      alert(`Error deleting all users: ${err.message}`);
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
  
  const handleEditUser = (user: DocumentData) => {
    setEditingUserId(user.id);
    setNewEmail(user.email);
  };
  
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewEmail('');
  };

  const handleSaveUser = async (userId: string) => {
    if (!newEmail) {
      alert('Email cannot be empty.');
      return;
    }
    try {
      const userDocRef = doc(db, 'test-users', userId);
      await updateDoc(userDocRef, { email: newEmail });
      handleCancelEdit();
    } catch (err: any) {
      alert(`Error updating user: ${err.message}`);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = useMemo(() => {
    return sessionUsers.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sessionUsers, searchTerm]);


  if (!mounted) return null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Firebase Emulator Test</h1>

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

      <section>
        <h2 className="text-xl font-semibold mb-2">Auth</h2>
        {loadingAuth && <p>Loading auth state...</p>}
        {authError && <p className="text-red-500">Error: {authError}</p>}
        <div>
          <h3 className="font-semibold">Current User:</h3>
          {currentUser ? (
            <p className="text-sm">
              {currentUser.email} | UID: {currentUser.uid}
            </p>
          ) : (
            <p className="text-sm">No user signed in.</p>
          )}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">All Test Users (from Firestore):</h3>
            {sessionUsers.length > 0 && (
              <button
                onClick={deleteAllUsers}
                className="px-3 py-1 bg-red-700 text-white rounded text-xs font-semibold"
              >
                Delete All
              </button>
            )}
          </div>
          <div className="my-2 flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded text-sm w-full max-w-xs"
            />
            <div className="flex items-center gap-2 text-sm">
              <span>Sort by:</span>
              <button onClick={() => handleSort('email')} className={`px-2 py-1 rounded ${sortField === 'email' ? 'bg-gray-300' : 'bg-gray-100'}`}>
                Email {sortField === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
              </button>
              <button onClick={() => handleSort('createdAt')} className={`px-2 py-1 rounded ${sortField === 'createdAt' ? 'bg-gray-300' : 'bg-gray-100'}`}>
                Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '▲' : '▼')}
              </button>
            </div>
          </div>
          <ul className="list-disc pl-6 text-sm space-y-2">
            {filteredUsers.map((user) => (
              <li key={user.id} className="flex items-center justify-between gap-4">
                {editingUserId === user.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="border p-1 rounded text-sm w-full"
                    />
                    <button
                      onClick={() => handleSaveUser(user.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span>
                      {user.email} | UID: {user.uid}
                    </span>
                    <div className="flex items-center gap-2">
                       <button
                        onClick={() => handleEditUser(user)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTestUser(user.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
            {filteredUsers.length === 0 && !loadingAuth && (
              <li>No users match your search.</li>
            )}
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
