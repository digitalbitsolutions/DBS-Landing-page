import { BriefcaseBusiness, FolderKanban, Inbox } from "lucide-react";
import Link from "next/link";

import DashboardNotice from "@/components/dashboard/DashboardNotice";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data/site";
import { getLocaleDisplayName, type AppLocale } from "@/lib/i18n";

export default async function DashboardPage() {
  const { leads, projects, services, settings, warning } = await getDashboardData();
  const activeServices = services.filter((service) => service.active).length;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Overview"
        description="Resumen del mini CMS, con accesos rapidos a las areas clave de la landing."
      />

      {warning ? <DashboardNotice message={warning} /> : null}

      <div className="grid gap-5 xl:grid-cols-3">
        <StatCard
          title="Leads"
          value={leads.length}
          description="Contactos recibidos desde el formulario publico."
          icon={Inbox}
        />
        <StatCard
          title="Projects"
          value={projects.length}
          description="Casos visibles y editables desde el panel."
          icon={FolderKanban}
        />
        <StatCard
          title="Active services"
          value={activeServices}
          description="Servicios actualmente publicados en la landing."
          icon={BriefcaseBusiness}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accesos rapidos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard/settings">Editar settings</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/services">Gestionar servicios</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/projects">Gestionar proyectos</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/leads">Revisar leads</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Snapshot publico</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Site name
            </p>
            <p className="mt-3 text-sm text-white">{settings.site_name}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Contacto
            </p>
            <p className="mt-3 text-sm text-white">{settings.contact_email}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
              Idiomas
            </p>
            <p className="mt-3 text-sm text-white">
              {settings.enabled_locales.map((locale) => getLocaleDisplayName(locale as AppLocale)).join(" / ")}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Principal: {getLocaleDisplayName(settings.default_locale as AppLocale)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
