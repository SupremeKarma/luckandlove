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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, Save, X, PlusCircle, Trash, ArrowUpDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
      user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sessionUsers, searchTerm]);


  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Firebase Emulator Test Suite</h1>
        <p className="text-gray-500">An interactive panel for testing Auth and Firestore.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Auth Emulator</CardTitle>
            <CardDescription>Create and manage test users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Current User</h3>
              {loadingAuth && <p className="text-sm text-gray-500">Loading auth state...</p>}
              {authError && <p className="text-sm text-red-500">Error: {authError}</p>}
              {currentUser ? (
                <p className="text-sm">
                  {currentUser.email} (UID: {currentUser.uid})
                </p>
              ) : (
                <p className="text-sm text-gray-500">No user signed in.</p>
              )}
            </div>
            
            <Separator />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Test Users in Firestore</h3>
                <Button variant="destructive" size="sm" onClick={deleteAllUsers} disabled={sessionUsers.length === 0}>
                  <Trash className="mr-2" /> Delete All
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('email')}>
                          Email <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                         <Button variant="ghost" size="sm" onClick={() => handleSort('createdAt')}>
                          Created <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            {editingUserId === user.id ? (
                               <Input 
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="h-8"
                              />
                            ) : (
                              user.email
                            )}
                          </TableCell>
                          <TableCell className="text-gray-500 text-xs">
                            {new Date(user.createdAt).toLocaleString()}
                          </TableCell>
                           <TableCell className="text-right">
                            {editingUserId === user.id ? (
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleSaveUser(user.id)}><Save className="text-green-500" /></Button>
                                <Button variant="ghost" size="icon" onClick={handleCancelEdit}><X className="text-gray-500" /></Button>
                              </div>
                            ) : (
                               <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}><Edit/></Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteTestUser(user.id)}><Trash2 className="text-red-500" /></Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

            </div>
            
            <Button onClick={createTestUser} className="w-full">
              <PlusCircle className="mr-2" /> Create Random Test User
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Firestore Emulator</CardTitle>
            <CardDescription>Manage documents in the '/test' collection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {loadingDocs && <p className="text-sm text-gray-500">Loading documents...</p>}
             {docsError && <p className="text-sm text-red-500">Error: {docsError}</p>}
              <div className="max-h-96 overflow-y-auto rounded-md border p-2 text-sm">
                {docs.length > 0 ? (
                  docs.map((doc) => (
                    <div key={doc.id} className="p-2 border-b text-xs">
                      <p><strong>ID:</strong> {doc.id}</p>
                      <p><strong>Created:</strong> {doc.createdAt}</p>
                      <p><strong>Random:</strong> {doc.random}</p>
                    </div>
                  ))
                ) : (
                   <p className="text-gray-500 text-center p-4">No documents yet.</p>
                )}
              </div>
            <Button onClick={addTestDoc} className="w-full">
              <PlusCircle className="mr-2" /> Add Test Document
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
