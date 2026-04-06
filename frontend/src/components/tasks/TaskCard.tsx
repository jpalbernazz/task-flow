import type { DragEvent, KeyboardEvent } from "react"
import { Calendar, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTasksPageContext } from "@/lib/tasks/tasks-page-context"
import type { TaskViewModel } from "@/lib/tasks/types"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { taskPriorityConfig } from "@/lib/tasks/task-meta"

interface TaskCardProps {
  task: TaskViewModel
  dragDataTransferType: string
}

function formatShortDate(dateString: string) {
  const hasDateOnlyFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
  const normalizedDate = hasDateOnlyFormat
    ? `${dateString}T00:00:00Z`
    : dateString
  const parsedDate = new Date(normalizedDate)

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
    parsedDate,
  )
}

export function TaskCard({ task, dragDataTransferType }: TaskCardProps) {
  const { handleDeleteTask, handleOpenEditTaskModal, getProjectName } = useTasksPageContext()
  const priority = taskPriorityConfig[task.priority]
  const projectName = getProjectName(task.projectId)

  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.setData(dragDataTransferType, String(task.id))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Delete") {
      event.preventDefault()
      void handleDeleteTask(task.id)
    }

    if (event.key === "Enter") {
      event.preventDefault()
      handleOpenEditTaskModal(task)
    }
  }

  return (
    <Card
      className="cursor-grab border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      draggable
      onDragStart={handleDragStart}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onDoubleClick={() => handleOpenEditTaskModal(task)}
      aria-label={`Tarefa ${task.title}`}
    >
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="line-clamp-2 text-sm font-medium text-foreground">
            {task.title}
          </h4>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Acoes da tarefa</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleOpenEditTaskModal(task)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => {
                  void handleDeleteTask(task.id)
                }}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {projectName ? (
          <Badge variant="outline" className="text-xs">
            {projectName}
          </Badge>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className={cn("text-xs", priority.className)}
          >
            {priority.label}
          </Badge>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatShortDate(task.dueDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
