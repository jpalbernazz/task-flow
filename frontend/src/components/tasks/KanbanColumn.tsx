"use client"

import { memo } from "react"
import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"
import { TaskCard } from "./TaskCard"
import type { TaskStatus, TaskViewModel } from "@/lib/tasks/types"

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  color: string
  tasks: TaskViewModel[]
  isReorderDisabled: boolean
}

function KanbanColumnComponent({
  id,
  title,
  color,
  tasks,
  isReorderDisabled,
}: KanbanColumnProps) {
  const droppableId = `column-${id}`
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: { type: "column", columnId: id },
    disabled: isReorderDisabled,
  })

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`kanban-${id}`}
      className={cn(
        "flex min-h-[22rem] w-full flex-col rounded-2xl border bg-gradient-to-b from-muted/70 to-muted/30 shadow-sm transition-all lg:min-h-[28rem]",
        isOver && !isReorderDisabled && "border-primary/50 shadow-md ring-2 ring-primary/15",
      )}
    >
      <header className="flex items-center justify-between border-b border-border/80 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2.5">
          <span className={cn("h-2.5 w-2.5 rounded-full shadow-xs", color)} />
          <h3 id={`kanban-${id}`} className="text-sm font-semibold text-foreground">
            {title}
          </h3>
        </div>

        <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold text-muted-foreground shadow-xs">
          {tasks.length}
        </span>
      </header>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col gap-2.5 p-2.5 sm:gap-3 sm:p-3">
          {tasks.length === 0 ? (
            <div
              className={cn(
                "flex h-full min-h-28 items-center justify-center rounded-xl border border-dashed bg-background/50 p-3 text-center text-xs text-muted-foreground transition-colors sm:min-h-36 sm:p-4",
                isOver && !isReorderDisabled && "border-primary/40 text-primary",
              )}
            >
              Arraste tarefas para esta coluna
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                columnId={id}
                isDragDisabled={isReorderDisabled}
              />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  )
}

export const KanbanColumn = memo(KanbanColumnComponent)
