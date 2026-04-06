"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ProjectCard } from "@/components/projects/project-card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { ProjectCardItem, ProjectStatus } from "@/lib/projects/types"
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

function buildDefaultProjectInput(): CreateProjectInput {
  const nextMonth = new Date()
  nextMonth.setDate(nextMonth.getDate() + 30)

  return {
    name: "Novo Projeto",
    description: "Descricao do novo projeto",
    deadline: nextMonth.toISOString().slice(0, 10),
    status: "planejado",
    progress: 0,
    tasksCompleted: 0,
    totalTasks: 0,
  }
}

function normalizeStatus(value: string, fallback: ProjectStatus): ProjectStatus {
  const validStatus: ProjectStatus[] = ["planejado", "em-andamento", "concluido", "atrasado"]
  return validStatus.includes(value as ProjectStatus) ? (value as ProjectStatus) : fallback
}

export function ProjectsPageView() {
  const [projects, setProjects] = useState<ProjectCardItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

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
    const normalizedSearch = searchTerm.trim().toLowerCase()
    if (normalizedSearch === "") {
      return projects
    }

    return projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch)
      )
    })
  }, [projects, searchTerm])

  const handleCreateProject = useCallback(async () => {
    const baseInput = buildDefaultProjectInput()

    const name = window.prompt("Nome do projeto", baseInput.name)
    if (name === null) {
      return
    }

    const description = window.prompt("Descricao do projeto", baseInput.description)
    if (description === null) {
      return
    }

    const deadline = window.prompt("Prazo (YYYY-MM-DD)", baseInput.deadline)
    if (deadline === null) {
      return
    }

    const input: CreateProjectInput = {
      ...baseInput,
      name: name.trim() || baseInput.name,
      description: description.trim() || baseInput.description,
      deadline: deadline.trim() || baseInput.deadline,
    }

    try {
      await createProject(input)
      setInfoMessage("Projeto criado com sucesso.")
      await refreshProjects()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Nao foi possivel criar o projeto."))
    }
  }, [refreshProjects])

  const handleEditProject = useCallback(
    async (project: ProjectCardItem) => {
      const name = window.prompt("Editar nome do projeto", project.name)
      if (name === null) {
        return
      }

      const description = window.prompt("Editar descricao do projeto", project.description)
      if (description === null) {
        return
      }

      const deadline = window.prompt("Editar prazo (YYYY-MM-DD)", project.deadline)
      if (deadline === null) {
        return
      }

      const statusValue = window.prompt(
        "Editar status (planejado, em-andamento, concluido, atrasado)",
        project.status
      )
      if (statusValue === null) {
        return
      }

      const payload: UpdateProjectInput = {
        name: name.trim() || project.name,
        description: description.trim() || project.description,
        deadline: deadline.trim() || project.deadline,
        status: normalizeStatus(statusValue.trim(), project.status),
      }

      try {
        const updatedProject = await updateProject(project.id, payload)
        if (!updatedProject) {
          setErrorMessage("O projeto nao foi encontrado para edicao.")
          return
        }

        setInfoMessage("Projeto atualizado com sucesso.")
        await refreshProjects()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Nao foi possivel editar o projeto."))
      }
    },
    [refreshProjects]
  )

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
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
            {infoMessage}
          </div>
        ) : null}

        {isRefreshing ? <p className="text-sm text-muted-foreground">Atualizando projetos...</p> : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projetos</h1>
            <p className="text-muted-foreground">Gerencie e acompanhe todos os seus projetos</p>
          </div>
          <Button className="gap-2" onClick={() => void handleCreateProject()}>
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onEditProject={handleEditProject} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ProjectsPageView
