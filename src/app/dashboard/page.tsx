import {
  ArrowRight,
  BriefcaseBusiness,
  FolderKanban,
  Inbox,
  Languages,
  Settings2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import DashboardNotice from "@/components/dashboard/DashboardNotice";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DashboardSectionCard from "@/components/dashboard/DashboardSectionCard";
import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/data/site";
import { defaultLocale, getLocaleDisplayName, type AppLocale } from "@/lib/i18n";

export default async function DashboardPage() {
  const { leads, projects, services, settings, warning } = await getDashboardData();
  const activeServices = services.filter((service) => service.active).length;
  const featuredProjects = projects.filter((project) => project.featured).length;
  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const pendingAutomation = leads.filter(
    (lead) => !lead.notification_sent_at || !lead.autoresponder_sent_at,
  ).length;
  const localeLabels = settings.enabled_locales.map((locale) =>
    getLocaleDisplayName(locale as AppLocale),
  );
  const quickLinks = [
    {
      href: "/dashboard/leads",
      title: "Atiende leads nuevos",
      description: "Prioriza respuestas comerciales y revisa automatizaciones pendientes.",
      value: `${newLeads} nuevos`,
      detail: pendingAutomation
        ? `${pendingAutomation} con automatizacion pendiente`
        : "Todo al dia",
      icon: Inbox,
    },
    {
      href: "/dashboard/services",
      title: "Ajusta servicios",
      description: "Manten visible solo la oferta actual y revisa idiomas disponibles.",
      value: `${activeServices} activos`,
      detail: `${services.length} en catalogo`,
      icon: BriefcaseBusiness,
    },
    {
      href: "/dashboard/projects",
      title: "Refuerza el portfolio",
      description: "Marca los casos clave y valida slugs, stack y enlaces publicos.",
      value: `${featuredProjects} destacados`,
      detail: `${projects.length} proyectos publicados`,
      icon: FolderKanban,
    },
    {
      href: "/dashboard/settings",
      title: "Revisa ajustes globales",
      description: "Copia principal, SEO, idiomas y automatizacion de emails.",
      value: `${localeLabels.length} idiomas`,
      detail: `Base: ${getLocaleDisplayName(settings.default_locale as AppLocale)}`,
      icon: Settings2,
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        eyebrow="Panel general"
        title="Resumen"
        description="Empieza por lo urgente, entiende el estado del sitio y entra rapido a la seccion que toca revisar."
        meta={
          <>
            <Badge variant={warning ? "warning" : "success"}>
              {warning ? "Revisar configuracion" : "Sistema listo"}
            </Badge>
            <Badge variant="muted">{localeLabels.length} idiomas activos</Badge>
          </>
        }
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/dashboard/leads">Ir a leads</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${defaultLocale}`} target="_blank" rel="noreferrer">
                Ver landing
              </Link>
            </Button>
          </div>
        }
      />

      {warning ? <DashboardNotice message={warning} /> : null}

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Leads nuevos"
          value={newLeads}
          description="Contactos que siguen esperando una primera respuesta comercial."
          icon={Inbox}
          detail={
            pendingAutomation
              ? `${pendingAutomation} con automatizacion pendiente`
              : "Sin bloqueos detectados"
          }
        />
        <StatCard
          title="Servicios activos"
          value={activeServices}
          description="Servicios publicados y visibles ahora mismo en la landing."
          icon={BriefcaseBusiness}
          detail={`${services.length - activeServices} ocultos o pausados`}
        />
        <StatCard
          title="Proyectos destacados"
          value={featuredProjects}
          description="Casos que dominan la narrativa del portfolio en la home."
          icon={FolderKanban}
          detail={`${projects.length} proyectos en total`}
        />
        <StatCard
          title="Idiomas activos"
          value={localeLabels.length}
          description="Cobertura linguistica habilitada en la landing publica."
          icon={Languages}
          detail={`Idioma base: ${getLocaleDisplayName(settings.default_locale as AppLocale)}`}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_minmax(0,1fr)]">
        <DashboardSectionCard
          title="Que revisar hoy"
          description="Entradas rapidas segun el tipo de trabajo mas comun dentro del panel."
        >
          <div className="grid gap-3 md:grid-cols-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-cyan-400/20 hover:bg-cyan-400/5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                      <Icon className="h-4 w-4 text-cyan-200" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-200" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-white">{link.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{link.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge>{link.value}</Badge>
                    <Badge variant="muted">{link.detail}</Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard
          title="Estado actual del sitio"
          description="Lectura rapida de la configuracion publica sin entrar todavia en edicion."
        >
          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Nombre del sitio
              </p>
              <p className="mt-3 text-sm text-white">{settings.site_name}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Contacto principal
              </p>
              <p className="mt-3 text-sm text-white">{settings.contact_email}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Idiomas activos
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {localeLabels.map((label) => (
                  <Badge key={label} variant="muted">
                    {label}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                Base: {getLocaleDisplayName(settings.default_locale as AppLocale)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Automatizacion
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant={settings.lead_notification_enabled ? "success" : "muted"}>
                  {settings.lead_notification_enabled
                    ? "Aviso interno activo"
                    : "Aviso interno pausado"}
                </Badge>
                <Badge variant={settings.autoresponder_enabled ? "success" : "muted"}>
                  {settings.autoresponder_enabled
                    ? "Autorespuesta activa"
                    : "Autorespuesta pausada"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 text-cyan-200" />
              <div>
                <p className="text-sm font-semibold text-white">Siguiente revision recomendada</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Si cambias copy o CTA en la landing, valida despues ajustes globales y servicios
                  para mantener coherencia.
                </p>
              </div>
            </div>
          </div>
        </DashboardSectionCard>
      </div>
    </div>
  );
}
