"use client"

import { useState } from "react"
import { Calendar, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface TaskCardProps {
  task: Task
  onDragStart: (task: Task) => void
  onDragEnd: () => void
}

const priorityStyleByLevel = {
  low: {
    label: "Baixa",
    className: "bg-muted text-muted-foreground hover:bg-muted",
  },
  medium: {
    label: "Media",
    className: "bg-warning/20 text-warning-foreground hover:bg-warning/30",
  },
  high: {
    label: "Alta",
    className: "bg-destructive/20 text-destructive hover:bg-destructive/30",
  },
} as const

const monthLabels = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
]

function formatShortDate(dateString: string) {
  const [_, month, day] = dateString.split("-")
  return `${Number(day)} ${monthLabels[Number(month) - 1]}`
}

function isOverdueDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number)
  const dueDate = new Date(year, month - 1, day)
  const today = new Date()

  dueDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  return dueDate < today
}

export function TaskCard({ task, onDragStart, onDragEnd }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const priority = priorityStyleByLevel[task.priority]
  const overdue = task.status !== "done" && isOverdueDate(task.dueDate)

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.effectAllowed = "move"
    setIsDragging(true)
    onDragStart(task)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    onDragEnd()
  }

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "cursor-grab border-border bg-card shadow-sm transition-all hover:shadow-md active:cursor-grabbing",
        isDragging && "scale-105 rotate-2 opacity-50 shadow-lg"
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground/50" />

          <div className="flex-1 space-y-3">
            <p className="text-sm font-medium leading-snug text-foreground">
              {task.title}
            </p>

            <div className="flex items-center justify-between">
              <Badge variant="secondary" className={cn("text-xs", priority.className)}>
                {priority.label}
              </Badge>

              <div
                className={cn(
                  "flex items-center gap-1 text-xs text-muted-foreground",
                  overdue && "text-destructive"
                )}
              >
                <Calendar className="h-3 w-3" />
                <span>{formatShortDate(task.dueDate)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {task.assignee.avatar}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {task.assignee.name}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
