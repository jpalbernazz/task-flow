"use client"

import { cn } from "@/lib/utils"
import type {
  RecentTaskItem,
  RecentTaskPriority,
  RecentTaskStatus,
} from "@/lib/dashboard/types"
import { useDashboardPageContext } from "@/lib/dashboard/dashboard-page-context"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const statusConfig: Record<RecentTaskStatus, { label: string; className: string }> = {
  todo: {
    label: "A Fazer",
    className: "bg-muted text-muted-foreground",
  },
  "in-progress": {
    label: "Em Progresso",
    className: "bg-primary/10 text-primary",
  },
  completed: {
    label: "Concluida",
    className: "bg-success/10 text-success",
  },
  overdue: {
    label: "Atrasada",
    className: "bg-destructive/10 text-destructive",
  },
}

const priorityConfig: Record<RecentTaskPriority, { label: string; className: string }> = {
  low: {
    label: "Baixa",
    className: "border-muted-foreground/30 text-muted-foreground",
  },
  medium: {
    label: "Media",
    className: "border-warning/50 text-warning",
  },
  high: {
    label: "Alta",
    className: "border-destructive/50 text-destructive",
  },
}

export function TaskList() {
  const { recentTasks } = useDashboardPageContext()

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Tarefas Relevantes</h2>
          <p className="text-sm text-muted-foreground">Tarefas priorizadas por prazo e status</p>
        </div>
        <Button variant="outline" size="sm" disabled>Ver todas</Button>
      </div>

      <div className="divide-y divide-border">
        {recentTasks.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">Nenhuma tarefa relevante encontrada no momento.</div>
        ) : (
          recentTasks.map((task) => <TaskRow key={task.id} task={task} />)
        )}
      </div>
    </div>
  )
}

function TaskRow({ task }: { task: RecentTaskItem }) {
  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <div className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50 md:p-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-card-foreground">{task.title}</p>
          <p className="text-sm text-muted-foreground">{task.project}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Badge variant="secondary" className={cn("text-xs", status.className)}>{status.label}</Badge>
          <Badge variant="outline" className={cn("text-xs", priority.className)}>{priority.label}</Badge>
        </div>
      </div>

      <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
        <Clock className="h-4 w-4" />
        <span>{task.dueDate}</span>
      </div>

      <Avatar className="h-8 w-8">
        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
        <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
          {task.assignee.initials}
        </AvatarFallback>
      </Avatar>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Opcoes</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Duplicar</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
