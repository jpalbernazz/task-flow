"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectCard } from "@/components/projects/project-card"
import {
  ProjectDetailsModal,
  type ProjectModalIntent,
  type ProjectModalMode,
} from "@/components/projects/project-details-modal"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { ProjectCardItem } from "@/lib/projects/types"
import { projectStatusConfig } from "@/lib/projects/project-status"
import {
  createProject,
  getProjectCards,
  type CreateProjectInput,
  type UpdateProjectInput,
  updateProject,
} from "@/services/project-service"

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message
  }

  return fallbackMessage
}

function normalizeSearchValue(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

export function ProjectsPageView() {
  const [projects, setProjects] = useState<ProjectCardItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ProjectModalMode>("create")
  const [modalIntent, setModalIntent] = useState<ProjectModalIntent>("view")
  const [selectedProject, setSelectedProject] = useState<ProjectCardItem | null>(null)

  const refreshProjects = useCallback(async () => {
    setIsRefreshing(true)

    try {
      const projectList = await getProjectCards()
      setProjects(projectList)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Nao foi possivel carregar os projetos."))
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

      return (
        searchableValues.some((value) => value.includes(normalizedSearch))
      )
    })
  }, [projects, searchTerm])

  const handleCreateProject = useCallback(async (input: CreateProjectInput) => {
    try {
      await createProject(input)
      setInfoMessage("Projeto criado com sucesso.")
      setErrorMessage(null)
      await refreshProjects()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Nao foi possivel criar o projeto."))
      throw error
    }
  }, [refreshProjects])

  const handleUpdateProject = useCallback(
    async (projectId: number, input: UpdateProjectInput) => {
      try {
        const updatedProject = await updateProject(projectId, input)
        if (!updatedProject) {
          const notFoundError = new Error("O projeto nao foi encontrado para edicao.")
          setErrorMessage(notFoundError.message)
          throw notFoundError
        }

        setInfoMessage("Projeto atualizado com sucesso.")
        setErrorMessage(null)
        await refreshProjects()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Nao foi possivel editar o projeto."))
        throw error
      }
    },
    [refreshProjects]
  )

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open)

    if (!open) {
      setSelectedProject(null)
      setModalMode("create")
      setModalIntent("view")
    }
  }

  const handleOpenCreateModal = () => {
    setSelectedProject(null)
    setModalMode("create")
    setModalIntent("edit")
    setIsModalOpen(true)
  }

  const handleOpenProjectModal = (project: ProjectCardItem, intent: ProjectModalIntent) => {
    setSelectedProject(project)
    setModalMode("view")
    setModalIntent(intent)
    setIsModalOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{errorMessage}</span>
              <Button size="sm" variant="outline" onClick={() => void refreshProjects()} disabled={isRefreshing}>
                Tentar novamente
              </Button>
            </div>
          </div>
        ) : null}

        {infoMessage ? (
          <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
            {infoMessage}
          </div>
        ) : null}

        {isRefreshing ? <p className="text-sm text-muted-foreground">Atualizando projetos...</p> : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
            <p className="text-muted-foreground">Gerencie e acompanhe todos os seus projetos</p>
          </div>
          <Button className="gap-2" onClick={handleOpenCreateModal}>
            <Plus className="h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
              className="pl-9"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            {searchTerm.trim() === ""
              ? "Nenhum projeto cadastrado no momento."
              : "Nenhum projeto encontrado para este filtro."}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenProject={handleOpenProjectModal}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectDetailsModal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        mode={modalMode}
        initialIntent={modalIntent}
        project={selectedProject}
        onCreate={handleCreateProject}
        onUpdate={handleUpdateProject}
      />
    </DashboardLayout>
  )
}

export default ProjectsPageView
