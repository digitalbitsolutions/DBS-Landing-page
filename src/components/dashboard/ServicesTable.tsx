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
import { ServiceIcon } from "@/lib/icons";
import { getLocaleDisplayName, type AppLocale } from "@/lib/i18n";
import type { Service } from "@/lib/supabase/database.types";

import DashboardEmptyState from "./DashboardEmptyState";
import DashboardSectionCard from "./DashboardSectionCard";
import ServiceRowActions from "./ServiceRowActions";

interface ServicesTableProps {
  services: Service[];
  disabledReason?: string;
  translationDisabledReason?: string;
}

export default function ServicesTable({
  services,
  disabledReason,
  translationDisabledReason,
}: ServicesTableProps) {
  if (!services.length) {
    return (
      <DashboardEmptyState
        title="No hay servicios todavia"
        description="Anade el primer servicio para publicarlo en la landing y gestionarlo desde este panel."
      />
    );
  }

  const activeServices = services.filter((service) => service.active).length;
  const translatedServices = services.filter(
    (service) => getAvailableTranslationLocales(service.translations).length > 0,
  ).length;

  return (
    <DashboardSectionCard
      title="Catalogo de servicios"
      description="Controla publicacion, orden, iconografia y cobertura de traducciones."
      contentClassName="px-0 pb-0"
    >
      <div className="grid gap-3 px-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            Servicios
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{services.length}</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-emerald-200/70">
            Activos
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{activeServices}</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Con traducciones
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{translatedServices}</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Servicio</TableHead>
            <TableHead className="hidden md:table-cell whitespace-nowrap">Icono</TableHead>
            <TableHead className="whitespace-nowrap">Idiomas</TableHead>
            <TableHead className="hidden lg:table-cell whitespace-nowrap">Orden</TableHead>
            <TableHead className="whitespace-nowrap">Estado</TableHead>
            <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => {
            const locales = getAvailableTranslationLocales(service.translations);

            return (
              <TableRow key={service.id}>
                <TableCell className="min-w-[260px]">
                  <div>
                    <p className="font-medium text-white">{service.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{service.description}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                    <ServiceIcon name={service.icon} className="h-4 w-4 text-cyan-200" />
                  </div>
                </TableCell>
                <TableCell className="min-w-[220px]">
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
                <TableCell className="hidden lg:table-cell">{service.order_index}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={service.active ? "success" : "muted"} className="whitespace-nowrap">
                    {service.active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ServiceRowActions
                    service={service}
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
