import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { TaskDetailsModal } from "@/components/tasks/TaskDetailsModal"
import { TasksKanbanClient } from "@/components/tasks/TasksKanbanClient"
import { TasksPageFeedback } from "@/components/tasks/TasksPageFeedback"
import { TasksPageHeader } from "@/components/tasks/TasksPageHeader"
import { TasksPageProvider } from "@/lib/tasks/tasks-page-context"
import type { TaskViewModel } from "@/lib/tasks/types"
import { getTasks } from "@/services/task-service"

export default async function TasksPage() {
  let initialTasks: TaskViewModel[] = []
  let initialError: string | null = null

  try {
    initialTasks = await getTasks()
  } catch {
    initialError = "Nao foi possivel carregar as tarefas na inicializacao."
  }

  return (
    <TasksPageProvider initialTasks={initialTasks} initialError={initialError}>
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
