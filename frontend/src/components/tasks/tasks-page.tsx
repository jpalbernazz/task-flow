"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Filter, LayoutGrid, List, Plus } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import {
  createTask,
  deleteTask,
  getTasks,
  type CreateTaskInput,
  type UpdateTaskInput,
  updateTask,
} from "@/services/task-service"
import { getProjectCards } from "@/services/project-service"
import type { ProjectCardItem } from "@/lib/projects/types"
import type { KanbanColumnData, TaskStatus, TaskViewModel } from "@/lib/tasks/types"
import { KanbanBoard } from "./kanban-board"

const baseColumns: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: "todo", title: "A Fazer", color: "bg-muted-foreground/70" },
  { id: "in_progress", title: "Em Progresso", color: "bg-primary" },
  { id: "done", title: "Concluida", color: "bg-success" },
]

function buildDefaultTaskInput(totalTasks: number): CreateTaskInput {
  const nextDay = new Date()
  nextDay.setDate(nextDay.getDate() + 1)
  const dueDate = nextDay.toISOString().slice(0, 10)

  return {
    title: `Nova tarefa ${totalTasks + 1}`,
    description: "Descricao da nova tarefa",
    status: "todo",
    priority: "medium",
    dueDate,
    projectId: null,
  }
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message
  }

  return fallbackMessage
}

function parseProjectIdPrompt(value: string, fallback: number | null): number | null {
  const normalizedValue = value.trim()
  if (normalizedValue === "") {
    return null
  }

  const projectId = Number(normalizedValue)
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return fallback
  }

  return projectId
}

function buildProjectSelectionMessage(projects: ProjectCardItem[]): string {
  if (projects.length === 0) {
    return "Projeto ID (deixe vazio para sem projeto)"
  }

  const options = projects.map((project) => `${project.id} - ${project.name}`).join("\n")
  return `Projeto ID (deixe vazio para sem projeto)\n${options}`
}

function buildKanbanColumns(tasks: TaskViewModel[]): KanbanColumnData[] {
  return baseColumns.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }))
}

interface TasksPageViewProps {
  initialTasks: TaskViewModel[]
  initialError?: string | null
}

export function TasksPageView({ initialTasks, initialError = null }: TasksPageViewProps) {
  const [tasks, setTasks] = useState<TaskViewModel[]>(initialTasks)
  const [projects, setProjects] = useState<ProjectCardItem[]>([])
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("all")
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)

    try {
      const [taskList, projectList] = await Promise.all([getTasks(), getProjectCards()])
      setTasks(taskList)
      setProjects(projectList)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Nao foi possivel carregar as tarefas."))
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void refreshData()
  }, [refreshData])

  const projectsById = useMemo(() => {
    return projects.reduce<Record<number, ProjectCardItem>>((accumulator, project) => {
      accumulator[project.id] = project
      return accumulator
    }, {})
  }, [projects])

  const filteredTasks = useMemo(() => {
    if (selectedProjectFilter === "all") {
      return tasks
    }

    const projectId = Number(selectedProjectFilter)
    if (!Number.isInteger(projectId)) {
      return tasks
    }

    return tasks.filter((task) => task.projectId === projectId)
  }, [selectedProjectFilter, tasks])

  const columns = useMemo(() => buildKanbanColumns(filteredTasks), [filteredTasks])

  const handleCreateTask = useCallback(async () => {
    const baseInput = buildDefaultTaskInput(tasks.length)
    const projectPrompt = window.prompt(buildProjectSelectionMessage(projects), "")
    if (projectPrompt === null) {
      return
    }

    const input: CreateTaskInput = {
      ...baseInput,
      projectId: parseProjectIdPrompt(projectPrompt, null),
    }

    try {
      await createTask(input)
      setInfoMessage("Tarefa criada com sucesso.")
      await refreshData()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Nao foi possivel criar a tarefa."))
    }
  }, [projects, refreshData, tasks.length])

  const handleMoveTask = useCallback(
    async (taskId: number, status: TaskStatus) => {
      try {
        const updatedTask = await updateTask(taskId, { status })
        if (!updatedTask) {
          setErrorMessage("A tarefa nao foi encontrada para atualizar o status.")
          return
        }

        await refreshData()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Nao foi possivel atualizar o status da tarefa."))
      }
    },
    [refreshData]
  )

  const handleDeleteTask = useCallback(
    async (taskId: number) => {
      try {
        const deleted = await deleteTask(taskId)
        if (!deleted) {
          setErrorMessage("A tarefa nao foi encontrada para exclusao.")
          return
        }

        await refreshData()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Nao foi possivel excluir a tarefa."))
      }
    },
    [refreshData]
  )

  const handleEditTask = useCallback(
    async (task: TaskViewModel) => {
      const editedTitle = window.prompt("Editar titulo da tarefa", task.title)
      if (editedTitle === null) {
        return
      }

      const editedDescription = window.prompt("Editar descricao da tarefa", task.description)
      if (editedDescription === null) {
        return
      }

      const currentProjectId = task.projectId === null ? "" : String(task.projectId)
      const projectPrompt = window.prompt(buildProjectSelectionMessage(projects), currentProjectId)
      if (projectPrompt === null) {
        return
      }

      const payload: UpdateTaskInput = {
        title: editedTitle.trim() || task.title,
        description: editedDescription.trim() || task.description,
        projectId: parseProjectIdPrompt(projectPrompt, task.projectId),
      }

      try {
        const updatedTask = await updateTask(task.id, payload)
        if (!updatedTask) {
          setErrorMessage("A tarefa nao foi encontrada para edicao.")
          return
        }

        setInfoMessage("Tarefa atualizada com sucesso.")
        await refreshData()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Nao foi possivel editar a tarefa."))
      }
    },
    [projects, refreshData]
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{errorMessage}</span>
              <Button size="sm" variant="outline" onClick={() => void refreshData()} disabled={isRefreshing}>
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

        {isRefreshing ? <p className="text-sm text-muted-foreground">Atualizando tarefas...</p> : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Tarefas</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas tarefas com o quadro Kanban</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border bg-card p-1">
              <Button variant="ghost" size="sm" className="h-8 bg-primary/10 text-primary hover:bg-primary/20">
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only">Visualizacao Kanban</span>
              </Button>

              <Button variant="ghost" size="sm" className="h-8">
                <List className="h-4 w-4" />
                <span className="sr-only">Visualizacao Lista</span>
              </Button>
            </div>

            <div className="flex h-9 items-center gap-2 rounded-md border border-input px-2 text-sm">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                className="bg-transparent text-sm outline-none"
                value={selectedProjectFilter}
                onChange={(event) => setSelectedProjectFilter(event.target.value)}
              >
                <option value="all">Todos os projetos</option>
                {projects.map((project) => (
                  <option key={project.id} value={String(project.id)}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <Button size="sm" onClick={() => void handleCreateTask()}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        <KanbanBoard
          columns={columns}
          onMoveTask={handleMoveTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          getProjectName={(projectId) => {
            if (projectId === null) {
              return null
            }

            return projectsById[projectId]?.name ?? null
          }}
        />
      </div>
    </DashboardLayout>
  )
}

export default TasksPageView
