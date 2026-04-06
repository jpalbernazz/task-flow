"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar, CheckCircle2, ListTodo, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { projectStatusConfig } from "@/lib/projects/project-status"
import { useMediaQuery } from "@/lib/use-media-query"
import type { ProjectCardItem, ProjectStatus } from "@/lib/projects/types"
import type { CreateProjectInput, UpdateProjectInput } from "@/services/project-service"
import { cn } from "@/lib/utils"

export type ProjectModalMode = "create" | "view"
export type ProjectModalIntent = "view" | "edit"

interface ProjectFormValues {
  name: string
  description: string
  deadline: string
  status: ProjectStatus
}

interface ProjectDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: ProjectModalMode
  initialIntent?: ProjectModalIntent
  project: ProjectCardItem | null
  onCreate: (input: CreateProjectInput) => Promise<void>
  onUpdate: (projectId: number, input: UpdateProjectInput) => Promise<void>
}

function buildDefaultFormValues(): ProjectFormValues {
  const nextMonth = new Date()
  nextMonth.setDate(nextMonth.getDate() + 30)

  return {
    name: "Novo Projeto",
    description: "Descricao do novo projeto",
    deadline: nextMonth.toISOString().slice(0, 10),
    status: "planejado",
  }
}

function projectToFormValues(project: ProjectCardItem): ProjectFormValues {
  return {
    name: project.name,
    description: project.description,
    deadline: project.deadline,
    status: project.status,
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

function formatDate(date: string): string {
  const hasDateOnlyFormat = /^\d{4}-\d{2}-\d{2}$/.test(date)
  const normalizedDate = hasDateOnlyFormat ? `${date}T00:00:00Z` : date
  const parsedDate = new Date(normalizedDate)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate)
}

export function ProjectDetailsModal({
  open,
  onOpenChange,
  mode,
  initialIntent = "view",
  project,
  onCreate,
  onUpdate,
}: ProjectDetailsModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isEditing, setIsEditing] = useState(mode === "create")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<ProjectFormValues>(buildDefaultFormValues)

  const statusEntries = useMemo(() => {
    return Object.entries(projectStatusConfig) as Array<
      [ProjectStatus, { label: string; className: string }]
    >
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    if (mode === "create") {
      setFormValues(buildDefaultFormValues())
      setIsEditing(true)
    } else if (project) {
      setFormValues(projectToFormValues(project))
      setIsEditing(initialIntent === "edit")
    }

    setSubmitError(null)
  }, [open, mode, project, initialIntent])

  if (mode === "view" && !project) {
    return null
  }

  const modalTitle =
    mode === "create"
      ? "Novo Projeto"
      : isEditing
        ? "Editar Projeto"
        : "Detalhes do Projeto"

  const modalDescription =
    mode === "create"
      ? "Preencha os dados principais para criar um novo projeto."
      : isEditing
        ? "Atualize os dados principais do projeto."
        : "Visualize as informacoes consolidadas do projeto."

  const handleChange = <K extends keyof ProjectFormValues>(field: K, value: ProjectFormValues[K]) => {
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const handleCancelEditing = () => {
    if (!project) {
      return
    }

    setFormValues(projectToFormValues(project))
    setSubmitError(null)
    setIsEditing(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isEditing && mode === "view") {
      return
    }

    const normalizedName = formValues.name.trim()
    const normalizedDescription = formValues.description.trim()

    if (normalizedName === "") {
      setSubmitError("O nome do projeto e obrigatorio.")
      return
    }

    if (normalizedDescription === "") {
      setSubmitError("A descricao do projeto e obrigatoria.")
      return
    }

    if (!isValidDate(formValues.deadline)) {
      setSubmitError("Informe um prazo valido.")
      return
    }

    if (!(formValues.status in projectStatusConfig)) {
      setSubmitError("Selecione um status valido.")
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        await onCreate({
          name: normalizedName,
          description: normalizedDescription,
          deadline: formValues.deadline,
          status: formValues.status,
          progress: 0,
          tasksCompleted: 0,
          totalTasks: 0,
        })
      } else if (project) {
        await onUpdate(project.id, {
          name: normalizedName,
          description: normalizedDescription,
          deadline: formValues.deadline,
          status: formValues.status,
        })
      }

      onOpenChange(false)
    } catch (error) {
      const fallback = mode === "create" ? "Nao foi possivel criar o projeto." : "Nao foi possivel atualizar o projeto."
      setSubmitError(getErrorMessage(error, fallback))
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderViewMode = () => {
    if (!project) {
      return null
    }

    const status = projectStatusConfig[project.status]

    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{project.name}</p>
            <p className="text-sm text-muted-foreground">
              {project.description.trim() === "" ? "Sem descricao." : project.description}
            </p>
          </div>
          <Badge variant="secondary" className={cn("font-medium", status.className)}>
            {status.label}
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Prazo</span>
            </div>
            <p className="text-sm font-medium text-foreground">{formatDate(project.deadline)}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Progresso</span>
            </div>
            <p className="text-sm font-medium text-foreground">{project.progress}%</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Concluidas</span>
            </div>
            <p className="text-sm font-medium text-foreground">{project.tasksCompleted} tarefas</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
              <ListTodo className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Total</span>
            </div>
            <p className="text-sm font-medium text-foreground">{project.totalTasks} tarefas</p>
          </div>
        </div>
      </div>
    )
  }

  const renderEditForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">Nome</Label>
        <Input
          id="project-name"
          value={formValues.name}
          onChange={(event) => handleChange("name", event.target.value)}
          placeholder="Nome do projeto"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Descricao</Label>
        <textarea
          id="project-description"
          value={formValues.description}
          onChange={(event) => handleChange("description", event.target.value)}
          placeholder="Descreva o objetivo principal do projeto"
          disabled={isSubmitting}
          rows={4}
          className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="project-deadline">Prazo</Label>
          <Input
            id="project-deadline"
            type="date"
            value={formValues.deadline}
            onChange={(event) => handleChange("deadline", event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-status">Status</Label>
          <select
            id="project-status"
            value={formValues.status}
            onChange={(event) => handleChange("status", event.target.value as ProjectStatus)}
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
      </div>
    </div>
  )

  const renderFooterActions = (isDrawer: boolean) => {
    if (mode === "create") {
      const actions = (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Projeto"}
          </Button>
        </>
      )

      return isDrawer ? <DrawerFooter>{actions}</DrawerFooter> : <DialogFooter>{actions}</DialogFooter>
    }

    if (!isEditing) {
      const actions = (
        <>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button type="button" onClick={() => setIsEditing(true)}>
            Editar Projeto
          </Button>
        </>
      )

      return isDrawer ? <DrawerFooter>{actions}</DrawerFooter> : <DialogFooter>{actions}</DialogFooter>
    }

    const actions = (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancelEditing}
          disabled={isSubmitting}
        >
          Cancelar Edicao
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Alteracoes"}
        </Button>
      </>
    )

    return isDrawer ? <DrawerFooter>{actions}</DrawerFooter> : <DialogFooter>{actions}</DialogFooter>
  }

  const modalBody = (
    <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-2 sm:px-6">
        {submitError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}
        {mode === "view" && !isEditing ? renderViewMode() : renderEditForm()}
      </div>
      {renderFooterActions(!isDesktop)}
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
          {modalBody}
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
        {modalBody}
      </DrawerContent>
    </Drawer>
  )
}
