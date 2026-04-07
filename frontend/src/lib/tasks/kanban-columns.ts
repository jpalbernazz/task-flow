import type { KanbanColumnData, TaskStatus, TaskViewModel } from "@/lib/tasks/types"

export const KANBAN_COLUMNS: ReadonlyArray<{ id: TaskStatus; title: string; color: string }> = [
  { id: "todo", title: "A Fazer", color: "bg-muted-foreground/70" },
  { id: "in_progress", title: "Em Progresso", color: "bg-primary" },
  { id: "done", title: "Concluida", color: "bg-success" },
]

export function buildKanbanColumns(tasks: TaskViewModel[]): KanbanColumnData[] {
  return KANBAN_COLUMNS.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }))
}
