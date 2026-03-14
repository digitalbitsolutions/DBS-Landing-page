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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Proyecto</TableHead>
          <TableHead>Portada</TableHead>
          <TableHead>Stack</TableHead>
          <TableHead>Idiomas</TableHead>
          <TableHead>Orden</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>
              <div>
                <p className="font-medium text-white">{project.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{project.short_description}</p>
              </div>
            </TableCell>
            <TableCell>
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
            <TableCell>
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
            <TableCell>
              <div className="flex flex-wrap gap-2">
                {getAvailableTranslationLocales(project.translations).length ? (
                  getAvailableTranslationLocales(project.translations).map((locale) => (
                    <Badge key={locale} variant="muted">
                      {getLocaleDisplayName(locale as AppLocale)}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="muted">Solo base</Badge>
                )}
              </div>
            </TableCell>
            <TableCell>{project.order_index}</TableCell>
            <TableCell>
              <Badge variant={project.featured ? "success" : "muted"}>
                {project.featured ? "featured" : "standard"}
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
        ))}
      </TableBody>
    </Table>
  );
}
