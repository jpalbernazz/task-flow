import type { KanbanColumnData } from "@/types"
import { KanbanColumn } from "@/components/kanban/kanban-column"

interface KanbanBoardProps {
  columns: KanbanColumnData[]
}

export function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          tasks={column.tasks}
        />
      ))}
    </div>
  )
}
