import { Suspense } from "react";

import type { Metadata } from "next";

import LoginForm from "@/components/forms/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasSupabasePublicEnv } from "@/lib/env";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

function LoginContent() {
  if (!hasSupabasePublicEnv()) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Configura Supabase antes de usar el dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-zinc-400">
          <p>
            Falta configurar <code>NEXT_PUBLIC_SUPABASE_URL</code> o <code>SUPABASE_URL</code>, y una clave publica como{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> o <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY</code>.
          </p>
          <p>
            Cuando el proyecto tenga esas variables y un usuario creado en Supabase Auth,
            este login te dara acceso al mini CMS.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <LoginForm />;
}

export default function AdminLoginPage() {
  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-16">
      <Suspense fallback={<div className="text-sm text-zinc-400">Cargando acceso...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
