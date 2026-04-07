import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProjectDetailsModal } from "@/components/projects/ProjectDetailsModal";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { ProjectsPageFeedback } from "@/components/projects/ProjectsPageFeedback";
import { ProjectsPageHeader } from "@/components/projects/ProjectsPageHeader";
import { requireServerAuth } from "@/lib/auth/server-auth";
import { ProjectsPageProvider } from "@/lib/projects/projects-page-context";
import type { ProjectCardItem } from "@/lib/projects/types";
import { getProjectCards } from "@/services/project-service";

export default async function ProjectsPage() {
  const { user, requestHeaders } = await requireServerAuth()
  let initialProjects: ProjectCardItem[] = [];
  let initialError: string | null = null;

  try {
    initialProjects = await getProjectCards({ requestHeaders });
  } catch {
    initialError = "Não foi possível carregar os projetos na inicialização.";
  }

  return (
    <ProjectsPageProvider
      initialProjects={initialProjects}
      initialError={initialError}
    >
      <DashboardLayout initialUser={user}>
        <div className="flex flex-col md:gap-6 gap-4">
          <ProjectsPageFeedback />
          <ProjectsPageHeader />
          <ProjectsGrid />
        </div>

        <ProjectDetailsModal />
      </DashboardLayout>
    </ProjectsPageProvider>
  );
}
