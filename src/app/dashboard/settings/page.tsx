import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DashboardNotice from "@/components/dashboard/DashboardNotice";
import SettingsForm from "@/components/forms/SettingsForm";
import { getDashboardCapabilities } from "@/lib/auth";
import { getDashboardData } from "@/lib/data/site";
import { hasGroqApiKey } from "@/lib/env";

export default async function DashboardSettingsPage() {
  const { settings, warning } = await getDashboardData();
  const { isLocalReadOnly } = await getDashboardCapabilities();
  const disabledReason = isLocalReadOnly
    ? "Modo local en solo lectura. Anade SUPABASE_SERVICE_ROLE_KEY para guardar cambios reales."
    : undefined;
  const translationDisabledReason = !hasGroqApiKey()
    ? "Configura GROQ_API_KEY o NEXT_PUBLIC_GROQ_API para traducir."
    : undefined;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Settings"
        description="Contenido global de la landing, SEO e idiomas: hero, CTAs, metadata, locales activos, contacto, ubicaciones y footer."
      />
      {warning ? <DashboardNotice message={warning} /> : null}
      {disabledReason ? <DashboardNotice message={disabledReason} /> : null}
      {translationDisabledReason ? <DashboardNotice message={translationDisabledReason} /> : null}
      <SettingsForm
        settings={settings}
        disabledReason={disabledReason}
        translationDisabledReason={translationDisabledReason}
      />
    </div>
  );
}
