import DashboardNotice from "@/components/dashboard/DashboardNotice";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import LeadsTable from "@/components/dashboard/LeadsTable";
import { getDashboardCapabilities } from "@/lib/auth";
import { getDashboardData } from "@/lib/data/site";

export default async function DashboardLeadsPage() {
  const { leads, warning } = await getDashboardData();
  const { isLocalReadOnly } = await getDashboardCapabilities();
  const disabledReason = isLocalReadOnly
    ? "Modo local en solo lectura. Anade SUPABASE_SERVICE_ROLE_KEY para actualizar leads reales."
    : undefined;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        eyebrow="Pipeline comercial"
        title="Leads"
        description="Consulta entradas del formulario, mueve cada lead por su estado y detecta fallos de automatizacion sin perder contexto."
      />
      {warning ? <DashboardNotice message={warning} /> : null}
      {disabledReason ? <DashboardNotice message={disabledReason} /> : null}
      <LeadsTable leads={leads} disabledReason={disabledReason} />
    </div>
  );
}
