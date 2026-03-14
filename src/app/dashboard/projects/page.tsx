import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import DashboardNotice from "@/components/dashboard/DashboardNotice";
import ProjectsTable from "@/components/dashboard/ProjectsTable";
import ProjectDialog from "@/components/forms/ProjectDialog";
import { getDashboardCapabilities } from "@/lib/auth";
import { getDashboardData } from "@/lib/data/site";
import { hasGroqApiKey } from "@/lib/env";

export default async function DashboardProjectsPage() {
  const { projects, warning } = await getDashboardData();
  const { isLocalReadOnly } = await getDashboardCapabilities();
  const disabledReason = isLocalReadOnly
    ? "Modo local en solo lectura. Añade SUPABASE_SERVICE_ROLE_KEY para editar proyectos reales."
    : undefined;
  const translationDisabledReason = !hasGroqApiKey()
    ? "Configura GROQ_API_KEY o NEXT_PUBLIC_GROQ_API para traducir proyectos."
    : disabledReason;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Projects"
        description="Gestiona portfolio, orden, slugs, enlaces y marca los casos destacados."
        action={<ProjectDialog disabledReason={disabledReason} />}
      />
      {warning ? <DashboardNotice message={warning} /> : null}
      {disabledReason ? <DashboardNotice message={disabledReason} /> : null}
      {translationDisabledReason && translationDisabledReason !== disabledReason ? (
        <DashboardNotice message={translationDisabledReason} />
      ) : null}
      <ProjectsTable
        projects={projects}
        disabledReason={disabledReason}
        translationDisabledReason={translationDisabledReason}
      />
    </div>
  );
}
