import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { ProjectDetailsModal } from "@/components/projects/ProjectDetailsModal"
import { ProjectsGrid } from "@/components/projects/ProjectsGrid"
import { ProjectsPageFeedback } from "@/components/projects/ProjectsPageFeedback"
import { ProjectsPageHeader } from "@/components/projects/ProjectsPageHeader"
import { ProjectsPageProvider } from "@/lib/projects/projects-page-context"
import type { ProjectCardItem } from "@/lib/projects/types"
import { getProjectCards } from "@/services/project-service"

export default async function ProjectsPage() {
  let initialProjects: ProjectCardItem[] = []
  let initialError: string | null = null

  try {
    initialProjects = await getProjectCards()
  } catch {
    initialError = "Nao foi possivel carregar os projetos na inicializacao."
  }

  return (
    <ProjectsPageProvider initialProjects={initialProjects} initialError={initialError}>
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <ProjectsPageFeedback />
          <ProjectsPageHeader />
          <ProjectsGrid />
        </div>

        <ProjectDetailsModal />
      </DashboardLayout>
    </ProjectsPageProvider>
  )
}
