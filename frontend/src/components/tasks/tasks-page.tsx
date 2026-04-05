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
    assignedUserId: 1,
    projectId: 1,
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
}

export function TasksPageView({ initialTasks }: TasksPageViewProps) {
  const [tasks, setTasks] = useState<TaskViewModel[]>(initialTasks)

  const refreshTasks = useCallback(async () => {
    const taskList = await getTasks()
    setTasks(taskList)
  }, [])

  const columns = useMemo(() => buildKanbanColumns(tasks), [tasks])

  const handleCreateTask = useCallback(async () => {
    await createTask(buildDefaultTaskInput(tasks.length))
    await refreshTasks()
  }, [tasks.length, refreshTasks])

  const handleMoveTask = useCallback(
    async (taskId: number, status: TaskStatus) => {
      await updateTask(taskId, { status })
      await refreshTasks()
    },
    [refreshTasks]
  )

  const handleDeleteTask = useCallback(
    async (taskId: number) => {
      await deleteTask(taskId)
      await refreshTasks()
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

      await updateTask(task.id, payload)
      await refreshTasks()
    },
    [refreshTasks]
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
