import { TasksPageView } from "@/components/tasks/tasks-page"
import { getTasks } from "@/services/task-service"

export default async function TasksPage() {
  const initialTasks = await getTasks()

  return <TasksPageView initialTasks={initialTasks} />
}
