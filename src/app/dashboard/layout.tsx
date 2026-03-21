import type { ReactNode } from "react";

import { Eye } from "lucide-react";
import Link from "next/link";

import DashboardMobileMenu from "@/components/dashboard/DashboardMobileMenu";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import SignOutButton from "@/components/dashboard/SignOutButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ADMIN_LOGIN_PATH } from "@/lib/admin";
import { requireUser } from "@/lib/auth";
import { hasSupabasePublicEnv } from "@/lib/env";
import { defaultLocale } from "@/lib/i18n";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (!hasSupabasePublicEnv()) {
    return (
      <div className="w-full px-4 py-10 sm:px-6 lg:px-8 2xl:px-10">
        <Card className="p-6 text-sm text-zinc-300">
          Configura Supabase para usar el dashboard interno.
        </Card>
      </div>
    );
  }

  const user = await requireUser(`${ADMIN_LOGIN_PATH}?next=/dashboard`);

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 2xl:px-10">
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-950/70 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">
            Dashboard interno
          </p>
          <h1 className="mt-3 text-xl font-semibold text-white">
            Gestiona la landing sin perder el foco operativo.
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Revisa leads, ajusta contenido global y controla servicios o proyectos desde un mismo
            flujo.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Sesion activa
            </p>
            <p className="mt-2 text-zinc-200">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/${defaultLocale}`} target="_blank" rel="noreferrer">
                <Eye className="h-4 w-4" />
                Ver landing
              </Link>
            </Button>
            <SignOutButton />
            <div className="lg:hidden">
              <DashboardMobileMenu />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>
        <div className="min-w-0 rounded-2xl border border-white/10 bg-zinc-950/70 p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
