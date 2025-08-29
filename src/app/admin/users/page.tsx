
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { RequireRole } from "@/components/require-role";
import { supabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Row = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  updated_at: string;
};

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <RequireRole
        role="admin"
        redirectTo="/not-authorized"
        fallback={<p>Loading...</p>}
      >
        <UsersTable />
      </RequireRole>
    </div>
  );
}

function initials(s: string | null | undefined) {
  if (!s) return 'U';
  const parts = s.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last || s[0] || "U").toUpperCase();
}

function UsersTable() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,avatar_url,role,updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Failed to load users", { description: error.message });
    } else {
      setRows((data as Row[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setRole(targetId: string, nextRole: "user" | "admin") {
    setBusyId(targetId);
    const { error } = await supabase.rpc("set_user_role", {
      target_user: targetId,
      new_role: nextRole,
    });

    if (error) {
      toast.error("Failed to update role", { description: error.message });
    } else {
      toast.success(`User role updated to ${nextRole}`);
      await load();
    }
    setBusyId(null);
  }

  if (loading) return <p>Loading users...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          View and manage user roles in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const isSelf = user?.id === r.id;
              const nextRole = r.role === "admin" ? "user" : "admin";
              return(
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={r.avatar_url ?? undefined}
                          alt={r.full_name ?? "avatar"}
                        />
                        <AvatarFallback>
                          {initials(r.full_name ?? r.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{r.full_name || "—"}</div>
                        <div className="text-sm text-muted-foreground">
                          {r.email || "—"}
                        </div>
                      </div>
                      {isSelf && <Badge variant="outline">You</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.role === "admin" ? "default" : "secondary"}>
                      {r.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(r.updated_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === r.id || isSelf}
                      onClick={() => setRole(r.id, nextRole)}
                    >
                      {busyId === r.id
                        ? "Saving…"
                        : r.role === "admin"
                        ? "Demote"
                        : "Promote"}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground mt-4">
          Note: You can’t demote yourself. The last admin is also protected from demotion (server-side).
        </p>
      </CardContent>
    </Card>
  );
}
