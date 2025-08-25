'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/firebase';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, Save, X, PlusCircle, Trash, ArrowUpDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type DbDoc = {
  id: number;
  created_at: string;
  random: number;
};

type DbUser = {
  id: string; // uid
  email?: string;
  created_at?: string;
  full_name?: string;
};

export default function TestEmulator() {
  const [mounted, setMounted] = useState(false);

  // Firestore state
  const [docs, setDocs] = useState<DbDoc[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docsError, setDocsError] = useState<string | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionUsers, setSessionUsers] = useState<DbUser[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');

  // Search and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real-time listener for test documents
  useEffect(() => {
    if (!mounted) return;
    setLoadingDocs(true);
    setDocsError(null);

    const fetchDocs = async () => {
        const { data, error } = await supabase.from('test').select('*');
        if (error) {
            setDocsError(error.message);
        } else {
            setDocs(data as DbDoc[]);
        }
        setLoadingDocs(false);
    };
    fetchDocs();

    const channel = supabase.channel('test-docs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'test' }, (payload) => {
          fetchDocs(); // Refetch all on change for simplicity
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [mounted]);

  // Auth listener for current user
  useEffect(() => {
    if (!mounted) return;
    setLoadingAuth(true);
    setAuthError(null);

    const fetchSession = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            setAuthError(error.message);
        }
        setCurrentUser(user);
        setLoadingAuth(false);
    }
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user ?? null);
    });

    return () => authListener.subscription.unsubscribe();
  }, [mounted]);


  // Real-time listener for persisted users in 'profiles' table
  useEffect(() => {
    if (!mounted) return;
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('*').order(sortField, { ascending: sortDirection === 'asc' });
      if (error) {
        setAuthError(error.message);
      } else {
        setSessionUsers(data as DbUser[]);
      }
    };
    fetchUsers();

    const channel = supabase.channel('profiles-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [mounted, sortField, sortDirection]);

  const createTestUser = async () => {
    try {
      const email = `testuser${Date.now()}@example.com`;
      const password = 'password123';
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: 'Test User' }}
      });
      if (error) throw error;
      if (data.user) {
        // Also create a profile, RLS should allow this
        await supabase.from('profiles').insert({ id: data.user.id, full_name: 'Test User', email: data.user.email });
      }
      alert(`User created: ${email}`);
    } catch (err: any) {
      alert(`Error creating user: ${err.message}`);
    }
  };
  
  const deleteTestUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user record from the profiles table? This does not delete the Auth user.')) {
      return;
    }
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
    } catch(err: any) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  const deleteAllUsers = async () => {
    if (sessionUsers.length === 0) {
      alert("No users to delete.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete all ${sessionUsers.length} user records from profiles? This cannot be undone.`)) {
      return;
    }
    try {
      const { error } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to delete all
      if (error) throw error;
      alert('All test users have been deleted from profiles table.');
    } catch (err: any) {
      alert(`Error deleting all users: ${err.message}`);
    }
  };

  const addTestDoc = async () => {
    try {
      const { error } = await supabase.from('test').insert({ random: Math.random() });
      if (error) throw error;
    } catch (err: any) {
      alert(`Error adding doc: ${err.message}`);
    }
  };
  
  const handleEditUser = (user: DbUser) => {
    setEditingUserId(user.id);
    setNewEmail(user.email || '');
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
      const { error } = await supabase.from('profiles').update({ email: newEmail }).eq('id', userId);
      if (error) throw error;
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
        <h1 className="text-3xl font-bold tracking-tight">Supabase Connection Test Suite</h1>
        <p className="text-gray-500">An interactive panel for testing Auth and Database connections.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Auth</CardTitle>
            <CardDescription>Create and manage test users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Current User</h3>
              {loadingAuth && <p className="text-sm text-gray-500">Loading auth state...</p>}
              {authError && <p className="text-sm text-red-500">Error: {authError}</p>}
              {currentUser ? (
                <p className="text-sm">
                  {currentUser.email} (UID: {currentUser.id})
                </p>
              ) : (
                <p className="text-sm text-gray-500">No user signed in.</p>
              )}
            </div>
            
            <Separator />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Test Users in 'profiles' table</h3>
                <Button variant="destructive" size="sm" onClick={deleteAllUsers} disabled={sessionUsers.length === 0}>
                  <Trash className="mr-2 h-4 w-4" /> Delete All
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
                         <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')}>
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
                             {user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
                          </TableCell>
                           <TableCell className="text-right">
                            {editingUserId === user.id ? (
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleSaveUser(user.id)}><Save className="text-green-500 h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={handleCancelEdit}><X className="text-gray-500 h-4 w-4" /></Button>
                              </div>
                            ) : (
                               <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteTestUser(user.id)}><Trash2 className="text-red-500 h-4 w-4" /></Button>
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
              <PlusCircle className="mr-2 h-4 w-4" /> Create Random Test User
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supabase Database</CardTitle>
            <CardDescription>Manage documents in the 'test' collection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {loadingDocs && <p className="text-sm text-gray-500">Loading documents...</p>}
             {docsError && <p className="text-sm text-red-500">Error: {docsError}</p>}
              <div className="max-h-96 overflow-y-auto rounded-md border p-2 text-sm">
                {docs.length > 0 ? (
                  docs.map((doc) => (
                    <div key={doc.id} className="p-2 border-b text-xs">
                      <p><strong>ID:</strong> {doc.id}</p>
                      <p><strong>Created:</strong> {doc.created_at}</p>
                      <p><strong>Random:</strong> {doc.random}</p>
                    </div>
                  ))
                ) : (
                   <p className="text-gray-500 text-center p-4">No documents yet.</p>
                )}
              </div>
            <Button onClick={addTestDoc} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Test Document
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
