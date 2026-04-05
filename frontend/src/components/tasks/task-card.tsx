import type { DragEvent, KeyboardEvent } from "react"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskViewModel } from "@/lib/tasks/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface TaskCardProps {
  task: TaskViewModel
  onDeleteTask: (taskId: number) => Promise<void>
  onEditTask: (task: TaskViewModel) => Promise<void>
  dragDataTransferType: string
}

const priorityStyleByLevel = {
  low: {
    label: "Baixa",
    className: "bg-muted text-muted-foreground",
  },
  medium: {
    label: "Media",
    className: "bg-amber-100 text-amber-800",
  },
  high: {
    label: "Alta",
    className: "bg-rose-100 text-rose-800",
  },
} as const

function formatShortDate(dateString: string) {
  const hasDateOnlyFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateString)
  const normalizedDate = hasDateOnlyFormat ? `${dateString}T00:00:00Z` : dateString
  const parsedDate = new Date(normalizedDate)

  if (Number.isNaN(parsedDate.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(parsedDate)
}

export function TaskCard({ task, onDeleteTask, onEditTask, dragDataTransferType }: TaskCardProps) {
  const priority = priorityStyleByLevel[task.priority]
  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.setData(dragDataTransferType, String(task.id))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Delete") {
      event.preventDefault()
      void onDeleteTask(task.id)
    }

    if (event.key === "Enter") {
      event.preventDefault()
      void onEditTask(task)
    }
  }

  return (
    <Card
      className="border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      draggable
      onDragStart={handleDragStart}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onDoubleClick={() => void onEditTask(task)}
      aria-label={`Tarefa ${task.title}`}
    >
      <CardContent className="space-y-3 p-4">
        <h4 className="line-clamp-2 text-sm font-medium text-foreground">{task.title}</h4>

        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className={cn("text-xs", priority.className)}>
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
