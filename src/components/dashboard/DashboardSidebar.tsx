"use client";

import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  FolderKanban,
  Inbox,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { defaultLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/dashboard",
    label: "Resumen",
    description: "KPIs, alertas y accesos directos",
    icon: BarChart3,
  },
  {
    href: "/dashboard/settings",
    label: "Ajustes",
    description: "Contenido global, SEO e idiomas",
    icon: Settings2,
  },
  {
    href: "/dashboard/services",
    label: "Servicios",
    description: "Catalogo, orden y traducciones",
    icon: BriefcaseBusiness,
  },
  {
    href: "/dashboard/projects",
    label: "Proyectos",
    description: "Portfolio, destacados y enlaces",
    icon: FolderKanban,
  },
  {
    href: "/dashboard/leads",
    label: "Leads",
    description: "Seguimiento comercial y automatizacion",
    icon: Inbox,
  },
];

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export default function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 p-4 lg:w-72">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">DBS CMS</p>
          <p className="mt-2 text-sm text-zinc-400">
            Panel de control para contenido, leads y SEO.
          </p>
        </div>
        <Badge variant="muted" className="whitespace-nowrap">interno</Badge>
      </div>

      <div className="mb-3 px-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">
          Navegacion
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm text-zinc-300 transition-colors hover:border-white/8 hover:bg-white/6 hover:text-white",
                isActive && "border-cyan-400/20 bg-cyan-400/10 text-white",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]",
                  isActive && "border-cyan-400/30 bg-cyan-400/10",
                )}
              >
                <Icon className={cn("h-4 w-4 text-cyan-200", isActive && "text-cyan-100")} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{link.label}</span>
                  {isActive ? <Badge>Actual</Badge> : null}
                </div>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{link.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold text-white">Revision rapida</p>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Empieza por leads y despues valida ajustes globales si cambias copy, SEO o idiomas.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-4 w-full justify-between">
          <Link href={`/${defaultLocale}`} target="_blank" rel="noreferrer">
            Ver landing publicada
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </aside>
  );
}
