import type { Task, TaskStatus } from "@/types"
import { cn } from "@/lib/utils"
import { TaskCard } from "@/components/kanban/task-card"

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  color: string
  tasks: Task[]
}

export function KanbanColumn({ id, title, color, tasks }: KanbanColumnProps) {
  return (
    <section
      aria-labelledby={`kanban-${id}`}
      className="flex min-h-[420px] w-full flex-col rounded-xl border bg-muted/40 sm:min-w-[320px]"
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
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  )
}
