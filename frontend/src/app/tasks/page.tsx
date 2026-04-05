import { TasksPageView } from "@/components/tasks/tasks-page"
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

  return <TasksPageView initialTasks={initialTasks} initialError={initialError} />
}
