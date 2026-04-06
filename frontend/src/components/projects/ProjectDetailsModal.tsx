"use client"

import { Calendar, CheckCircle2, ListTodo, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Badge } from "@/components/ui/Badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer"
import { projectStatusConfig } from "@/lib/projects/project-status"
import type {
  ProjectStatus,
} from "@/lib/projects/types"
import {
  useProjectDetailsFormController,
} from "@/lib/projects/useProjectDetailsFormController"
import { useProjectsPageContext } from "@/lib/projects/projects-page-context"
import { useMediaQuery } from "@/lib/useMediaQuery"
import { cn } from "@/lib/utils"

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

export function ProjectDetailsModal() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const {
    isModalOpen,
    modalMode,
    modalIntent,
    selectedProject,
    handleModalOpenChange,
    handleCreateProject,
    handleUpdateProject,
  } = useProjectsPageContext()

  const {
    isEditing,
    setIsEditing,
    isSubmitting,
    submitError,
    formValues,
    statusEntries,
    modalTitle,
    modalDescription,
    handleChange,
    handleCancelEditing,
    handleSubmit,
  } = useProjectDetailsFormController({
    open: isModalOpen,
    mode: modalMode,
    initialIntent: modalIntent,
    project: selectedProject,
    onOpenChange: handleModalOpenChange,
    onCreate: handleCreateProject,
    onUpdate: handleUpdateProject,
  })

  if (modalMode === "view" && !selectedProject) {
    return null
  }

  const renderViewMode = () => {
    if (!selectedProject) {
      return null
    }

    const status = projectStatusConfig[selectedProject.status]

    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">{selectedProject.name}</p>
            <p className="text-sm text-muted-foreground">
              {selectedProject.description.trim() === "" ? "Sem descricao." : selectedProject.description}
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
            <p className="text-sm font-medium text-foreground">{formatDate(selectedProject.deadline)}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Progresso</span>
            </div>
            <p className="text-sm font-medium text-foreground">{selectedProject.progress}%</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Concluidas</span>
            </div>
            <p className="text-sm font-medium text-foreground">{selectedProject.tasksCompleted} tarefas</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
              <ListTodo className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Total</span>
            </div>
            <p className="text-sm font-medium text-foreground">{selectedProject.totalTasks} tarefas</p>
          </div>
        </div>
      </div>
    )
  }

  const renderEditForm = () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
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

      <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
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
    if (modalMode === "create") {
      const actions = (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleModalOpenChange(false)}
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
          <Button type="button" variant="outline" onClick={() => handleModalOpenChange(false)}>
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
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto px-4 pb-2 sm:px-6">
        {submitError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}
        {modalMode === "view" && !isEditing ? renderViewMode() : renderEditForm()}
      </div>
      {renderFooterActions(!isDesktop)}
    </form>
  )

  if (isDesktop) {
    return (
      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
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
    <Drawer open={isModalOpen} onOpenChange={handleModalOpenChange}>
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
