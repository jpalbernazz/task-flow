import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { TaskDetailsModal } from "@/components/tasks/TaskDetailsModal"
import { TasksKanbanClient } from "@/components/tasks/TasksKanbanClient"
import { TasksPageFeedback } from "@/components/tasks/TasksPageFeedback"
import { TasksPageHeader } from "@/components/tasks/TasksPageHeader"
import type { ProjectCardItem } from "@/lib/projects/types"
import { TasksPageProvider } from "@/lib/tasks/tasks-page-context"
import type { TaskViewModel } from "@/lib/tasks/types"
import { getProjectCards } from "@/services/project-service"
import { getTasks } from "@/services/task-service"

export default async function TasksPage() {
  let initialTasks: TaskViewModel[] = []
  let initialProjects: ProjectCardItem[] = []
  let initialError: string | null = null

  try {
    const [tasks, projects] = await Promise.all([getTasks(), getProjectCards()])
    initialTasks = tasks
    initialProjects = projects
  } catch {
    initialError = "Não foi possível carregar as tarefas na inicialização."
  }

  return (
    <TasksPageProvider
      initialTasks={initialTasks}
      initialProjects={initialProjects}
      initialError={initialError}
    >
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <TasksPageFeedback />
          <TasksPageHeader />
          <TasksKanbanClient />
        </div>

        <TaskDetailsModal />
      </DashboardLayout>
    </TasksPageProvider>
  )
}
