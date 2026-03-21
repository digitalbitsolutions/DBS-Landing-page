import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAvailableTranslationLocales } from "@/lib/data/marketing-copy";
import { getLocaleDisplayName, type AppLocale } from "@/lib/i18n";
import type { Project } from "@/lib/supabase/database.types";

import DashboardEmptyState from "./DashboardEmptyState";
import DashboardSectionCard from "./DashboardSectionCard";
import ProjectRowActions from "./ProjectRowActions";

interface ProjectsTableProps {
  projects: Project[];
  disabledReason?: string;
  translationDisabledReason?: string;
}

export default function ProjectsTable({
  projects,
  disabledReason,
  translationDisabledReason,
}: ProjectsTableProps) {
  if (!projects.length) {
    return (
      <DashboardEmptyState
        title="No hay proyectos todavia"
        description="Puedes crear el primer caso desde aqui y controlar su slug, enlaces, orden y destacado."
      />
    );
  }

  const featuredProjects = projects.filter((project) => project.featured).length;
  const translatedProjects = projects.filter(
    (project) => getAvailableTranslationLocales(project.translations).length > 0,
  ).length;

  return (
    <DashboardSectionCard
      title="Portfolio de proyectos"
      description="Gestiona jerarquia visual, slugs, stack, enlaces y piezas destacadas de la landing."
      contentClassName="px-0 pb-0"
    >
      <div className="grid gap-3 px-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            Proyectos
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{projects.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-200/70">
            Destacados
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{featuredProjects}</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Con traducciones
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{translatedProjects}</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Proyecto</TableHead>
            <TableHead className="hidden xl:table-cell whitespace-nowrap">Portada</TableHead>
            <TableHead className="whitespace-nowrap">Stack</TableHead>
            <TableHead className="hidden lg:table-cell whitespace-nowrap">Idiomas</TableHead>
            <TableHead className="hidden lg:table-cell whitespace-nowrap">Orden</TableHead>
            <TableHead className="whitespace-nowrap">Estado</TableHead>
            <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const locales = getAvailableTranslationLocales(project.translations);

            return (
              <TableRow key={project.id}>
                <TableCell className="min-w-[280px]">
                  <div>
                    <p className="font-medium text-white">{project.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{project.short_description}</p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      /{project.slug}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <div className="relative h-14 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={`Portada de ${project.title}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                        Sin cover
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="min-w-[220px]">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.length ? (
                      project.stack.map((item) => (
                        <Badge key={item} variant="muted">
                          {item}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="muted">Sin stack</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-2">
                    {locales.length ? (
                      locales.map((locale) => (
                        <Badge key={locale} variant="muted">
                          {getLocaleDisplayName(locale as AppLocale)}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="muted">Solo base</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{project.order_index}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={project.featured ? "success" : "muted"} className="whitespace-nowrap">
                    {project.featured ? "Destacado" : "Normal"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ProjectRowActions
                    project={project}
                    disabledReason={disabledReason}
                    translationDisabledReason={translationDisabledReason}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </DashboardSectionCard>
  );
}
