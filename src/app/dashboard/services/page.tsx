import DashboardNotice from "@/components/dashboard/DashboardNotice";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ServicesTable from "@/components/dashboard/ServicesTable";
import ServiceDialog from "@/components/forms/ServiceDialog";
import { getDashboardCapabilities } from "@/lib/auth";
import { getDashboardData } from "@/lib/data/site";
import { hasGroqApiKey } from "@/lib/env";

export default async function DashboardServicesPage() {
  const { services, warning } = await getDashboardData();
  const { isLocalReadOnly } = await getDashboardCapabilities();
  const disabledReason = isLocalReadOnly
    ? "Modo local en solo lectura. Anade SUPABASE_SERVICE_ROLE_KEY para editar servicios reales."
    : undefined;
  const translationDisabledReason = !hasGroqApiKey()
    ? "Configura GROQ_API_KEY o NEXT_PUBLIC_GROQ_API para traducir servicios."
    : disabledReason;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        eyebrow="Oferta"
        title="Servicios"
        description="Crea, prioriza y publica servicios con mejor lectura de estado, orden y cobertura por idiomas."
        action={<ServiceDialog disabledReason={disabledReason} />}
      />
      {warning ? <DashboardNotice message={warning} /> : null}
      {disabledReason ? <DashboardNotice message={disabledReason} /> : null}
      {translationDisabledReason && translationDisabledReason !== disabledReason ? (
        <DashboardNotice message={translationDisabledReason} />
      ) : null}
      <ServicesTable
        services={services}
        disabledReason={disabledReason}
        translationDisabledReason={translationDisabledReason}
      />
    </div>
  );
}
