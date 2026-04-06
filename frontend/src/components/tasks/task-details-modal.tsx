"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProjectCardItem } from "@/lib/projects/types"
import { taskPriorityConfig, taskStatusConfig } from "@/lib/tasks/task-meta"
import type { TaskPriority, TaskStatus, TaskViewModel } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/lib/use-media-query"
import type { CreateTaskInput, UpdateTaskInput } from "@/services/task-service"

export type TaskModalMode = "create" | "edit"

interface TaskFormValues {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  projectId: number | null
}

interface TaskDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: TaskModalMode
  initialTask: TaskViewModel | null
  projects: ProjectCardItem[]
  onCreate: (input: CreateTaskInput) => Promise<void>
  onUpdate: (taskId: number, input: UpdateTaskInput) => Promise<void>
  onDelete: (taskId: number) => Promise<void>
}

function buildDefaultTaskValues(): TaskFormValues {
  const nextDay = new Date()
  nextDay.setDate(nextDay.getDate() + 1)

  return {
    title: "Nova tarefa",
    description: "Descricao da nova tarefa",
    status: "todo",
    priority: "medium",
    dueDate: nextDay.toISOString().slice(0, 10),
    projectId: null,
  }
}

function taskToFormValues(task: TaskViewModel): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    projectId: task.projectId,
  }
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message
  }

  return fallbackMessage
}

function isValidDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value))
}

export function TaskDetailsModal({
  open,
  onOpenChange,
  mode,
  initialTask,
  projects,
  onCreate,
  onUpdate,
  onDelete,
}: TaskDetailsModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [formValues, setFormValues] = useState<TaskFormValues>(buildDefaultTaskValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false)

  const statusEntries = useMemo(() => {
    return Object.entries(taskStatusConfig) as Array<
      [TaskStatus, { label: string; className: string }]
    >
  }, [])

  const priorityEntries = useMemo(() => {
    return Object.entries(taskPriorityConfig) as Array<
      [TaskPriority, { label: string; className: string }]
    >
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    if (mode === "create") {
      setFormValues(buildDefaultTaskValues())
    } else if (initialTask) {
      setFormValues(taskToFormValues(initialTask))
    }

    setSubmitError(null)
    setIsDeleteConfirming(false)
  }, [open, mode, initialTask])

  if (mode === "edit" && !initialTask) {
    return null
  }

  const modalTitle = mode === "create" ? "Nova Tarefa" : "Editar Tarefa"
  const modalDescription =
    mode === "create"
      ? "Preencha os dados principais para criar uma nova tarefa."
      : "Ajuste os dados da tarefa e mantenha o quadro atualizado."

  const handleChange = <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedTitle = formValues.title.trim()
    const normalizedDescription = formValues.description.trim()

    if (normalizedTitle === "") {
      setSubmitError("O titulo da tarefa e obrigatorio.")
      return
    }
    if (normalizedDescription === "") {
      setSubmitError("A descricao da tarefa e obrigatoria.")
      return
    }
    if (!isValidDate(formValues.dueDate)) {
      setSubmitError("Informe uma data de prazo valida.")
      return
    }
    if (!(formValues.status in taskStatusConfig)) {
      setSubmitError("Selecione um status valido.")
      return
    }
    if (!(formValues.priority in taskPriorityConfig)) {
      setSubmitError("Selecione uma prioridade valida.")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (mode === "create") {
        await onCreate({
          title: normalizedTitle,
          description: normalizedDescription,
          status: formValues.status,
          priority: formValues.priority,
          dueDate: formValues.dueDate,
          projectId: formValues.projectId,
        })
      } else if (initialTask) {
        await onUpdate(initialTask.id, {
          title: normalizedTitle,
          description: normalizedDescription,
          status: formValues.status,
          priority: formValues.priority,
          dueDate: formValues.dueDate,
          projectId: formValues.projectId,
        })
      }

      onOpenChange(false)
    } catch (error) {
      const fallback =
        mode === "create"
          ? "Nao foi possivel criar a tarefa."
          : "Nao foi possivel atualizar a tarefa."
      setSubmitError(getErrorMessage(error, fallback))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAction = async () => {
    if (mode !== "edit" || !initialTask) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onDelete(initialTask.id)
      onOpenChange(false)
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Nao foi possivel excluir a tarefa."))
    } finally {
      setIsSubmitting(false)
      setIsDeleteConfirming(false)
    }
  }

  const footerActions =
    mode === "edit" && isDeleteConfirming ? (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsDeleteConfirming(false)}
          disabled={isSubmitting}
        >
          Voltar
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => void handleDeleteAction()}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Excluindo..." : "Confirmar exclusao"}
        </Button>
      </>
    ) : (
      <>
        {mode === "edit" ? (
          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteConfirming(true)}
            disabled={isSubmitting}
          >
            Excluir Tarefa
          </Button>
        ) : null}
        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "create"
              ? "Criando..."
              : "Salvando..."
            : mode === "create"
              ? "Criar Tarefa"
              : "Salvar Alteracoes"}
        </Button>
      </>
    )

  const body = (
    <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-2 sm:px-6">
        {submitError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}

        {mode === "edit" && isDeleteConfirming ? (
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
            Esta acao remove a tarefa permanentemente. Clique em confirmar exclusao para continuar.
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="task-title">Titulo</Label>
          <Input
            id="task-title"
            value={formValues.title}
            onChange={(event) => handleChange("title", event.target.value)}
            placeholder="Nome da tarefa"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-description">Descricao</Label>
          <textarea
            id="task-description"
            value={formValues.description}
            onChange={(event) => handleChange("description", event.target.value)}
            placeholder="Descreva o objetivo e o contexto da tarefa"
            rows={4}
            required
            disabled={isSubmitting}
            className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="task-status">Status</Label>
            <select
              id="task-status"
              value={formValues.status}
              onChange={(event) => handleChange("status", event.target.value as TaskStatus)}
              disabled={isSubmitting}
              className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {statusEntries.map(([statusValue, status]) => (
                <option key={statusValue} value={statusValue}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-priority">Prioridade</Label>
            <select
              id="task-priority"
              value={formValues.priority}
              onChange={(event) => handleChange("priority", event.target.value as TaskPriority)}
              disabled={isSubmitting}
              className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {priorityEntries.map(([priorityValue, priority]) => (
                <option key={priorityValue} value={priorityValue}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="task-due-date">Prazo</Label>
            <Input
              id="task-due-date"
              type="date"
              value={formValues.dueDate}
              onChange={(event) => handleChange("dueDate", event.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-project">Projeto</Label>
            <select
              id="task-project"
              value={formValues.projectId === null ? "none" : String(formValues.projectId)}
              onChange={(event) => {
                const value = event.target.value
                handleChange("projectId", value === "none" ? null : Number(value))
              }}
              disabled={isSubmitting}
              className="border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="none">Sem projeto</option>
              {projects.map((project) => (
                <option key={project.id} value={String(project.id)}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={cn("font-medium", taskStatusConfig[formValues.status].className)}>
            {taskStatusConfig[formValues.status].label}
          </Badge>
          <Badge variant="secondary" className={cn("font-medium", taskPriorityConfig[formValues.priority].className)}>
            {taskPriorityConfig[formValues.priority].label}
          </Badge>
        </div>
      </div>
      {isDesktop ? <DialogFooter>{footerActions}</DialogFooter> : <DrawerFooter>{footerActions}</DrawerFooter>}
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-border px-6 py-4 pr-12">
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogDescription>{modalDescription}</DialogDescription>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="border-b border-border pr-10">
          <DrawerTitle>{modalTitle}</DrawerTitle>
          <DrawerDescription>{modalDescription}</DrawerDescription>
        </DrawerHeader>
        {body}
      </DrawerContent>
    </Drawer>
  )
}
