import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskViewModel } from "../types/task-types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface TaskCardProps {
  task: TaskViewModel
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
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

export function TaskCard({ task }: TaskCardProps) {
  const priority = priorityStyleByLevel[task.priority]

  return (
    <Card className="border-border bg-card shadow-sm transition-shadow hover:shadow-md">
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
