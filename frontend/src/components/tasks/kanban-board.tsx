import { KanbanColumn } from "./kanban-column"
import type { KanbanColumnData, TaskStatus, TaskViewModel } from "@/lib/tasks/types"

interface KanbanBoardProps {
  columns: KanbanColumnData[]
  onMoveTask: (taskId: number, status: TaskStatus) => Promise<void>
  onDeleteTask: (taskId: number) => Promise<void>
  onOpenEditTask: (task: TaskViewModel) => void
  getProjectName: (projectId: number | null) => string | null
}

export function KanbanBoard({ columns, onMoveTask, onDeleteTask, onOpenEditTask, getProjectName }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          id={column.id}
          title={column.title}
          color={column.color}
          tasks={column.tasks}
          onMoveTask={onMoveTask}
          onDeleteTask={onDeleteTask}
          onOpenEditTask={onOpenEditTask}
          getProjectName={getProjectName}
        />
      ))}
    </div>
  )
}
