import { useCallback, useEffect, useMemo, useState } from "react"
import { getErrorMessage } from "@/lib/get-error-message"
import type { ProjectCardItem } from "@/lib/projects/types"
import type { KanbanColumnData, TaskModalMode, TaskViewModel } from "@/lib/tasks/types"
import { buildKanbanColumns } from "@/lib/tasks/kanban-columns"
import { getProjectCards } from "@/services/project-service"
import {
  createTask,
  deleteTask,
  getTasks,
  reorderTasks,
  type CreateTaskInput,
  type UpdateTaskInput,
  updateTask,
} from "@/services/task-service"

export interface ProjectFilterOption {
  value: string
  label: string
}

interface UseTasksPageControllerParams {
  initialTasks: TaskViewModel[]
  initialError?: string | null
}

export function useTasksPageController({
  initialTasks,
  initialError = null,
}: UseTasksPageControllerParams) {
  const [tasks, setTasks] = useState<TaskViewModel[]>(initialTasks)
  const [projects, setProjects] = useState<ProjectCardItem[]>([])
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("all")
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskModalMode, setTaskModalMode] = useState<TaskModalMode>("create")
  const [selectedTask, setSelectedTask] = useState<TaskViewModel | null>(null)

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)

    try {
      const [taskList, projectList] = await Promise.all([
        getTasks(),
        getProjectCards(),
      ])
      setTasks(taskList)
      setProjects(projectList)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível carregar as tarefas."))
      setInfoMessage(null)
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

  const projectFilterOptions = useMemo<ProjectFilterOption[]>(() => {
    return [
      { value: "all", label: "Todos os projetos" },
      ...projects.map((project) => ({
        value: String(project.id),
        label: project.name,
      })),
    ]
  }, [projects])

  const selectedProjectOption = useMemo<ProjectFilterOption>(() => {
    return (
      projectFilterOptions.find((option) => option.value === selectedProjectFilter) ??
      projectFilterOptions[0]
    )
  }, [projectFilterOptions, selectedProjectFilter])

  const canReorderTasks = selectedProjectFilter === "all"

  const handleCreateTask = useCallback(
    async (input: CreateTaskInput) => {
      try {
        await createTask(input)
        setInfoMessage("Tarefa criada com sucesso.")
        setErrorMessage(null)
        await refreshData()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Não foi possível criar a tarefa."))
        setInfoMessage(null)
        throw error
      }
    },
    [refreshData],
  )

  const handleDeleteTask = useCallback(
    async (taskId: number) => {
      try {
        const deleted = await deleteTask(taskId)
        if (!deleted) {
          setErrorMessage("A tarefa não foi encontrada para exclusão.")
          setInfoMessage(null)
          return
        }

        setInfoMessage("Tarefa excluida com sucesso.")
        setErrorMessage(null)
        await refreshData()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Não foi possível excluir a tarefa."))
        setInfoMessage(null)
      }
    },
    [refreshData],
  )

  const handleUpdateTask = useCallback(
    async (taskId: number, payload: UpdateTaskInput) => {
      try {
        const updatedTask = await updateTask(taskId, payload)
        if (!updatedTask) {
          const notFoundError = new Error("A tarefa não foi encontrada para edição.")
          setErrorMessage(notFoundError.message)
          setInfoMessage(null)
          throw notFoundError
        }

        setInfoMessage("Tarefa atualizada com sucesso.")
        setErrorMessage(null)
        await refreshData()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Não foi possível editar a tarefa."))
        setInfoMessage(null)
        throw error
      }
    },
    [refreshData],
  )

  const handleDeleteTaskFromModal = useCallback(
    async (taskId: number) => {
      try {
        const deleted = await deleteTask(taskId)
        if (!deleted) {
          const notFoundError = new Error("A tarefa não foi encontrada para exclusão.")
          setErrorMessage(notFoundError.message)
          setInfoMessage(null)
          throw notFoundError
        }

        setInfoMessage("Tarefa excluida com sucesso.")
        setErrorMessage(null)
        await refreshData()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Não foi possível excluir a tarefa."))
        setInfoMessage(null)
        throw error
      }
    },
    [refreshData],
  )

  const handleReorderTasksBoard = useCallback(
    async (nextColumns: KanbanColumnData[]) => {
      if (!canReorderTasks) {
        return
      }

      const previousTasks = tasks
      const reorderedTaskIds = new Set<number>()
      const optimisticallyReorderedTasks = nextColumns.flatMap((column) =>
        column.tasks.map((task, position) => {
          reorderedTaskIds.add(task.id)

          return {
            ...task,
            status: column.id,
            position,
          }
        }),
      )
      const untouchedTasks = previousTasks.filter((task) => !reorderedTaskIds.has(task.id))

      setTasks([...optimisticallyReorderedTasks, ...untouchedTasks])

      try {
        await reorderTasks({
          columns: nextColumns.map((column) => ({
            status: column.id,
            taskIds: column.tasks.map((task) => task.id),
          })),
        })
        setErrorMessage(null)
      } catch (error) {
        setTasks(previousTasks)
        setErrorMessage(getErrorMessage(error, "Não foi possível reordenar as tarefas."))
        setInfoMessage(null)
        throw error
      }
    },
    [canReorderTasks, tasks],
  )

  const handleTaskModalOpenChange = useCallback((open: boolean) => {
    setIsTaskModalOpen(open)

    if (!open) {
      setTaskModalMode("create")
      setSelectedTask(null)
    }
  }, [])

  const handleOpenCreateTaskModal = useCallback(() => {
    setTaskModalMode("create")
    setSelectedTask(null)
    setIsTaskModalOpen(true)
  }, [])

  const handleOpenEditTaskModal = useCallback((task: TaskViewModel) => {
    setTaskModalMode("edit")
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }, [])

  const getProjectName = useCallback(
    (projectId: number | null) => {
      if (projectId === null) {
        return null
      }

      return projectsById[projectId]?.name ?? null
    },
    [projectsById],
  )

  const viewState = useMemo(
    () => ({
      hasError: errorMessage !== null,
      hasInfo: infoMessage !== null,
      isRefreshing,
    }),
    [errorMessage, infoMessage, isRefreshing],
  )

  return {
    columns,
    projects,
    selectedProjectFilter,
    setSelectedProjectFilter,
    projectFilterOptions,
    selectedProjectOption,
    canReorderTasks,
    errorMessage,
    infoMessage,
    isRefreshing,
    refreshData,
    isTaskModalOpen,
    taskModalMode,
    selectedTask,
    handleTaskModalOpenChange,
    handleOpenCreateTaskModal,
    handleOpenEditTaskModal,
    handleCreateTask,
    handleDeleteTask,
    handleUpdateTask,
    handleDeleteTaskFromModal,
    handleReorderTasksBoard,
    getProjectName,
    viewState,
  }
}
