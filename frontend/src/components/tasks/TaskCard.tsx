"use client"

import { useState, type DragEvent, type KeyboardEvent } from "react"
import { Calendar, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTasksPageContext } from "@/lib/tasks/tasks-page-context"
import type { TaskViewModel } from "@/lib/tasks/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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
                onSelect={() => setIsDeleteDialogOpen(true)}
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(open)
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acao remove a tarefa permanentemente. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={async (event) => {
                event.preventDefault()
                setIsDeleting(true)
                try {
                  await handleDeleteTask(task.id)
                  setIsDeleteDialogOpen(false)
                } finally {
                  setIsDeleting(false)
                }
              }}
            >
              {isDeleting ? "Excluindo..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
