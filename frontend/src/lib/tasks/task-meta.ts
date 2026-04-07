import type { TaskPriority, TaskStatus } from "@/lib/tasks/types"

export const taskStatusConfig: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  todo: {
    label: "A Fazer",
    className: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "Em Progresso",
    className: "bg-primary/10 text-primary",
  },
  done: {
    label: "Concluída",
    className: "bg-success/10 text-success",
  },
}

export const taskPriorityConfig: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  low: {
    label: "Baixa",
    className: "bg-muted text-muted-foreground",
  },
  medium: {
    label: "Média",
    className: "bg-warning/15 text-warning",
  },
  high: {
    label: "Alta",
    className: "bg-destructive/15 text-destructive",
  },
}
