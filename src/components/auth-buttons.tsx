
"use client";
import { useAuth } from "@/context/auth-context";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { signOut, loading } = useAuth();
  return (
    <Button disabled={loading} variant="outline" onClick={() => signOut()}>
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
