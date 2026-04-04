import { getTasksByStatus } from "@/mocks"
import type { KanbanColumnData, TaskStatus } from "@/types"

const baseColumns: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: "todo", title: "A Fazer", color: "bg-slate-400" },
  { id: "in_progress", title: "Em Progresso", color: "bg-amber-500" },
  { id: "done", title: "Concluida", color: "bg-emerald-500" },
]

export function getKanbanColumns(): KanbanColumnData[] {
  return baseColumns.map((column) => ({
    ...column,
    tasks: getTasksByStatus(column.id),
  }))
}
