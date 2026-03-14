"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ADMIN_LOGIN_PATH } from "@/lib/admin";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await fetch("/api/dev-logout", { method: "POST" }).catch(() => null);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push(ADMIN_LOGIN_PATH);
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={loading}>
      <LogOut className="h-4 w-4" />
      {loading ? "Saliendo..." : "Salir"}
    </Button>
  );
}
