"use client"

import { useCallback, useMemo, useState } from "react"
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
import type { KanbanColumnData, TaskStatus, TaskViewModel } from "@/lib/tasks/types"
import { KanbanBoard } from "./kanban-board"

const baseColumns: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: "todo", title: "A Fazer", color: "bg-slate-400" },
  { id: "in_progress", title: "Em Progresso", color: "bg-amber-500" },
  { id: "done", title: "Concluida", color: "bg-emerald-500" },
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
  }
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

function getErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim() !== "") {
    return error.message
  }

  return fallbackMessage
}

export function TasksPageView({ initialTasks, initialError = null }: TasksPageViewProps) {
  const [tasks, setTasks] = useState<TaskViewModel[]>(initialTasks)
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshTasks = useCallback(async () => {
    setIsRefreshing(true)

    try {
      const taskList = await getTasks()
      setTasks(taskList)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Nao foi possivel carregar as tarefas."))
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const columns = useMemo(() => buildKanbanColumns(tasks), [tasks])

  const handleCreateTask = useCallback(async () => {
    try {
      await createTask(buildDefaultTaskInput(tasks.length))
      setInfoMessage("Tarefa criada com sucesso.")
      await refreshTasks()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Nao foi possivel criar a tarefa."))
    }
  }, [tasks.length, refreshTasks])

  const handleMoveTask = useCallback(
    async (taskId: number, status: TaskStatus) => {
      try {
        const updatedTask = await updateTask(taskId, { status })
        if (!updatedTask) {
          setErrorMessage("A tarefa nao foi encontrada para atualizar o status.")
          return
        }

        await refreshTasks()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Nao foi possivel atualizar o status da tarefa."))
      }
    },
    [refreshTasks]
  )

  const handleDeleteTask = useCallback(
    async (taskId: number) => {
      try {
        const deleted = await deleteTask(taskId)
        if (!deleted) {
          setErrorMessage("A tarefa nao foi encontrada para exclusao.")
          return
        }

        await refreshTasks()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Nao foi possivel excluir a tarefa."))
      }
    },
    [refreshTasks]
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

      const payload: UpdateTaskInput = {
        title: editedTitle.trim() || task.title,
        description: editedDescription.trim() || task.description,
      }

      try {
        const updatedTask = await updateTask(task.id, payload)
        if (!updatedTask) {
          setErrorMessage("A tarefa nao foi encontrada para edicao.")
          return
        }

        setInfoMessage("Tarefa atualizada com sucesso.")
        await refreshTasks()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, "Nao foi possivel editar a tarefa."))
      }
    },
    [refreshTasks]
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{errorMessage}</span>
              <Button size="sm" variant="outline" onClick={() => void refreshTasks()} disabled={isRefreshing}>
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

            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>

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
        />
      </div>
    </DashboardLayout>
  )
}

export default TasksPageView
