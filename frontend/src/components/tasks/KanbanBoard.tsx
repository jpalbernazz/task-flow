import { KanbanColumn } from "./KanbanColumn"
import { useTasksPageContext } from "@/lib/tasks/tasks-page-context"

export function KanbanBoard() {
  const { columns } = useTasksPageContext()

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
