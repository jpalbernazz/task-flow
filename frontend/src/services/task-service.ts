import { taskApiModelToViewModel } from "@/lib/tasks/task-mapper"
import { mockTaskApi } from "@/mocks/mock-task-api"
import type { KanbanColumnData, TaskStatus, TaskViewModel } from "@/lib/tasks/types"

const baseColumns: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: "todo", title: "A Fazer", color: "bg-slate-400" },
  { id: "in_progress", title: "Em Progresso", color: "bg-amber-500" },
  { id: "done", title: "Concluida", color: "bg-emerald-500" },
]

export function getTaskViewModels(): TaskViewModel[] {
  return mockTaskApi.map(taskApiModelToViewModel)
}

export function getKanbanColumns(): KanbanColumnData[] {
  const tasks = getTaskViewModels()

  return baseColumns.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }))
}
