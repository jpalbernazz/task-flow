import { useCallback, useEffect, useMemo, useState } from "react"
import { getErrorMessage } from "@/lib/get-error-message"
import { projectStatusConfig } from "@/lib/projects/project-status"
import type {
  ProjectCardItem,
  ProjectModalMode,
} from "@/lib/projects/types"
import {
  createProject,
  deleteProject,
  getProjectCards,
  type CreateProjectInput,
  type UpdateProjectInput,
  updateProject,
} from "@/services/project-service"

interface UseProjectsPageControllerParams {
  initialProjects: ProjectCardItem[]
  initialError?: string | null
}

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

export function useProjectsPageController({
  initialProjects,
  initialError = null,
}: UseProjectsPageControllerParams) {
  const [projects, setProjects] = useState<ProjectCardItem[]>(initialProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ProjectModalMode>("create")
  const [selectedProject, setSelectedProject] = useState<ProjectCardItem | null>(null)

  const refreshProjects = useCallback(async () => {
    setIsRefreshing(true)

    try {
      const projectList = await getProjectCards()
      setProjects(projectList)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível carregar os projetos."))
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void refreshProjects()
  }, [refreshProjects])

  const filteredProjects = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(searchTerm)
    if (normalizedSearch === "") {
      return projects
    }

    return projects.filter((project) => {
      const statusLabel = projectStatusConfig[project.status].label
      const searchableValues = [
        project.name,
        project.description,
        project.status,
        statusLabel,
      ].map(normalizeSearchValue)

      return searchableValues.some((value) => value.includes(normalizedSearch))
    })
  }, [projects, searchTerm])

  const handleCreateProject = useCallback(
    async (input: CreateProjectInput) => {
      try {
        await createProject(input)
        setInfoMessage("Projeto criado com sucesso.")
        setErrorMessage(null)
        await refreshProjects()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Não foi possível criar o projeto."))
        throw error
      }
    },
    [refreshProjects],
  )

  const handleUpdateProject = useCallback(
    async (projectId: number, input: UpdateProjectInput) => {
      try {
        const updatedProject = await updateProject(projectId, input)
        if (!updatedProject) {
          const notFoundError = new Error("O projeto não foi encontrado para edição.")
          setErrorMessage(notFoundError.message)
          throw notFoundError
        }

        setInfoMessage("Projeto atualizado com sucesso.")
        setErrorMessage(null)
        await refreshProjects()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Não foi possível editar o projeto."))
        throw error
      }
    },
    [refreshProjects],
  )

  const handleDeleteProjectFromModal = useCallback(
    async (projectId: number) => {
      try {
        const deleted = await deleteProject(projectId)
        if (!deleted) {
          const notFoundError = new Error("O projeto não foi encontrado para exclusão.")
          setErrorMessage(notFoundError.message)
          throw notFoundError
        }

        setInfoMessage("Projeto excluído com sucesso.")
        setErrorMessage(null)
        await refreshProjects()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Não foi possível excluir o projeto."))
        throw error
      }
    },
    [refreshProjects],
  )

  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open)

    if (!open) {
      setSelectedProject(null)
      setModalMode("create")
    }
  }, [])

  const handleOpenCreateModal = useCallback(() => {
    setSelectedProject(null)
    setModalMode("create")
    setIsModalOpen(true)
  }, [])

  const handleOpenProjectModal = useCallback((project: ProjectCardItem) => {
    setSelectedProject(project)
    setModalMode("view")
    setIsModalOpen(true)
  }, [])

  const viewState = useMemo(
    () => ({
      hasError: errorMessage !== null,
      hasInfo: infoMessage !== null,
      isRefreshing,
    }),
    [errorMessage, infoMessage, isRefreshing],
  )

  return {
    projects,
    searchTerm,
    setSearchTerm,
    filteredProjects,
    errorMessage,
    infoMessage,
    isRefreshing,
    refreshProjects,
    isModalOpen,
    modalMode,
    selectedProject,
    handleModalOpenChange,
    handleOpenCreateModal,
    handleOpenProjectModal,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProjectFromModal,
    viewState,
  }
}
