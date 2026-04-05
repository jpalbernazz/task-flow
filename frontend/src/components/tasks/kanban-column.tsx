import type { DragEvent } from "react"
import { cn } from "@/lib/utils"
import { TaskCard } from "./task-card"
import type { TaskStatus, TaskViewModel } from "@/lib/tasks/types"

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  color: string
  tasks: TaskViewModel[]
  onMoveTask: (taskId: number, status: TaskStatus) => Promise<void>
  onDeleteTask: (taskId: number) => Promise<void>
  onEditTask: (task: TaskViewModel) => Promise<void>
}

const TASK_ID_TRANSFER_TYPE = "text/task-id"

export function KanbanColumn({ id, title, color, tasks, onMoveTask, onDeleteTask, onEditTask }: KanbanColumnProps) {
  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    const taskId = Number(event.dataTransfer.getData(TASK_ID_TRANSFER_TYPE))
    if (!Number.isNaN(taskId)) {
      void onMoveTask(taskId, id)
    }
  }

  return (
    <section
      aria-labelledby={`kanban-${id}`}
      className="flex min-h-[420px] w-full flex-col rounded-xl border bg-muted/40 sm:min-w-[320px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
          <h3 id={`kanban-${id}`} className="text-sm font-semibold text-foreground">{title}</h3>
        </div>

        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
            Sem tarefas
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              dragDataTransferType={TASK_ID_TRANSFER_TYPE}
            />
          ))
        )}
      </div>
    </section>
  )
}
