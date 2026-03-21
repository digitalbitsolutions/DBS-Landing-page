import LeadStatusMenu from "@/components/forms/LeadStatusMenu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatShortDate } from "@/lib/utils";
import type { Lead } from "@/lib/supabase/database.types";

import DashboardEmptyState from "./DashboardEmptyState";
import LeadRowActions from "./LeadRowActions";
import DashboardSectionCard from "./DashboardSectionCard";

interface LeadsTableProps {
  leads: Lead[];
  disabledReason?: string;
}

export default function LeadsTable({ leads, disabledReason }: LeadsTableProps) {
  if (!leads.length) {
    return (
      <DashboardEmptyState
        title="Todavia no hay leads"
        description="Cuando alguien complete el formulario publico, aparecera aqui con su estado y fecha de entrada."
      />
    );
  }

  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const contactedLeads = leads.filter((lead) => lead.status === "contacted").length;
  const closedLeads = leads.filter((lead) => lead.status === "closed").length;
  const pendingAutomation = leads.filter(
    (lead) => !lead.notification_sent_at || !lead.autoresponder_sent_at,
  ).length;

  return (
    <DashboardSectionCard
      title="Bandeja de leads"
      description="Prioriza nuevos contactos, actualiza el estado comercial y vigila las automatizaciones pendientes."
      contentClassName="px-0 pb-0"
    >
      <div className="grid gap-3 px-6 md:grid-cols-4">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            Totales
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{leads.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber-200/70">
            Nuevos
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{newLeads}</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Contactados
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{contactedLeads}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            Automatizacion pendiente
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">{pendingAutomation}</p>
          <p className="mt-1 text-xs text-zinc-500">{closedLeads} leads cerrados</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Lead</TableHead>
            <TableHead className="whitespace-nowrap">Contacto</TableHead>
            <TableHead className="hidden xl:table-cell whitespace-nowrap">Empresa</TableHead>
            <TableHead className="whitespace-nowrap">Estado</TableHead>
            <TableHead className="whitespace-nowrap">Automatizacion</TableHead>
            <TableHead className="hidden lg:table-cell whitespace-nowrap">Fecha</TableHead>
            <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="min-w-[240px]">
                <div>
                  <p className="font-medium text-white">{lead.name}</p>
                  <p className="mt-1 max-w-xl truncate text-sm text-zinc-400" title={lead.message}>
                    {lead.message}
                  </p>
                </div>
              </TableCell>
              <TableCell className="min-w-[220px] whitespace-nowrap">
                <div className="space-y-2">
                  <p>{lead.email}</p>
                  <Badge variant="muted">{lead.locale.toUpperCase()}</Badge>
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                {lead.company || "Sin empresa"}
              </TableCell>
              <TableCell>
                <LeadStatusMenu
                  leadId={lead.id}
                  currentStatus={lead.status}
                  disabledReason={disabledReason}
                />
              </TableCell>
              <TableCell className="min-w-[260px]">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={lead.notification_sent_at ? "success" : "warning"}>
                      {lead.notification_sent_at ? "Aviso interno" : "Aviso pendiente"}
                    </Badge>
                    <Badge variant={lead.autoresponder_sent_at ? "success" : "warning"}>
                      {lead.autoresponder_sent_at ? "Autorespuesta" : "Autorespuesta pendiente"}
                    </Badge>
                  </div>
                  {lead.email_last_error ? (
                    <p className="max-w-xs text-xs text-red-300" title={lead.email_last_error}>
                      {lead.email_last_error}
                    </p>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatShortDate(lead.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <LeadRowActions lead={lead} disabledReason={disabledReason} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardSectionCard>
  );
}
