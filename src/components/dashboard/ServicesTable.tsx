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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Servicio</TableHead>
          <TableHead>Icono</TableHead>
          <TableHead>Idiomas</TableHead>
          <TableHead>Orden</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => {
          return (
            <TableRow key={service.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-white">{service.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{service.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <ServiceIcon name={service.icon} className="h-4 w-4 text-cyan-200" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {getAvailableTranslationLocales(service.translations).length ? (
                    getAvailableTranslationLocales(service.translations).map((locale) => (
                      <Badge key={locale} variant="muted">
                        {getLocaleDisplayName(locale as AppLocale)}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="muted">Solo base</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{service.order_index}</TableCell>
              <TableCell>
                <Badge variant={service.active ? "success" : "muted"}>
                  {service.active ? "active" : "inactive"}
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
  );
}
