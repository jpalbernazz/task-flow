"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
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
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { taskPriorityConfig, taskStatusConfig } from "@/lib/tasks/task-meta"
import { useTaskDetailsFormController } from "@/lib/tasks/useTaskDetailsFormController"
import { useTasksPageContext } from "@/lib/tasks/tasks-page-context"
import type { TaskPriority, TaskStatus } from "@/lib/tasks/types"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/lib/useMediaQuery"

export function TaskDetailsModal() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const {
    projects,
    isTaskModalOpen,
    taskModalMode,
    selectedTask,
    handleTaskModalOpenChange,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTaskFromModal,
  } = useTasksPageContext()

  const {
    formValues,
    isSubmitting,
    submitError,
    isDeleteConfirming,
    statusEntries,
    priorityEntries,
    modalTitle,
    modalDescription,
    setIsDeleteConfirming,
    handleChange,
    handleCancel,
    handleSubmit,
    handleDeleteAction,
  } = useTaskDetailsFormController({
    open: isTaskModalOpen,
    mode: taskModalMode,
    initialTask: selectedTask,
    onOpenChange: handleTaskModalOpenChange,
    onCreate: handleCreateTask,
    onUpdate: handleUpdateTask,
    onDelete: handleDeleteTaskFromModal,
  })

  if (taskModalMode === "edit" && !selectedTask) {
    return null
  }

  const footerActions =
    taskModalMode === "edit" && isDeleteConfirming ? (
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
        {taskModalMode === "edit" ? (
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
            ? taskModalMode === "create"
              ? "Criando..."
              : "Salvando..."
            : taskModalMode === "create"
              ? "Criar Tarefa"
              : "Salvar Alteracoes"}
        </Button>
      </>
    )

  const body = (
    <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-1 flex-col overflow-hidden">
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto px-4 pb-2 sm:px-6">
        {submitError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {submitError}
          </div>
        ) : null}

        {taskModalMode === "edit" && isDeleteConfirming ? (
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
            Esta acao remove a tarefa permanentemente. Clique em confirmar exclusao para continuar.
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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
      <Dialog open={isTaskModalOpen} onOpenChange={handleTaskModalOpenChange}>
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
    <Drawer open={isTaskModalOpen} onOpenChange={handleTaskModalOpenChange}>
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
