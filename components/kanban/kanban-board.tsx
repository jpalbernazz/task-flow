import { getTasksByStatus } from "@/mocks"
import type { TaskStatus } from "@/types"
import { KanbanColumn } from "@/components/kanban/kanban-column"

const kanbanColumns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "A Fazer", color: "bg-slate-400" },
  { id: "in_progress", title: "Em Progresso", color: "bg-amber-500" },
  { id: "done", title: "Concluida", color: "bg-emerald-500" },
]

export function KanbanBoard() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {kanbanColumns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          tasks={getTasksByStatus(column.id)}
        />
      ))}
    </div>
  )
}
