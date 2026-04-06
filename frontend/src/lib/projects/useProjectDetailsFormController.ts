import { useEffect, useMemo, useState } from "react"
import { getErrorMessage } from "@/lib/get-error-message"
import { isValidDate } from "@/lib/is-valid-date"
import { projectStatusConfig } from "@/lib/projects/project-status"
import type {
  ProjectCardItem,
  ProjectFormValues,
  ProjectModalIntent,
  ProjectModalMode,
  ProjectStatus,
} from "@/lib/projects/types"
import type { CreateProjectInput, UpdateProjectInput } from "@/services/project-service"

interface UseProjectDetailsFormControllerParams {
  open: boolean
  mode: ProjectModalMode
  initialIntent?: ProjectModalIntent
  project: ProjectCardItem | null
  onOpenChange: (open: boolean) => void
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

export function useProjectDetailsFormController({
  open,
  mode,
  initialIntent = "view",
  project,
  onOpenChange,
  onCreate,
  onUpdate,
}: UseProjectDetailsFormControllerParams) {
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

  const handleChange = <K extends keyof ProjectFormValues>(
    field: K,
    value: ProjectFormValues[K],
  ) => {
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
      const fallback =
        mode === "create"
          ? "Nao foi possivel criar o projeto."
          : "Nao foi possivel atualizar o projeto."
      setSubmitError(getErrorMessage(error, fallback))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}
