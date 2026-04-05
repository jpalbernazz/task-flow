import { taskApiModelToViewModel } from "@/lib/tasks/task-mapper"
import { mockTaskApi } from "@/mocks/mock-task-api"
import type {
  KanbanColumnData,
  TaskApiModel,
  TaskStatus,
  TaskViewModel,
} from "@/lib/tasks/types"

const baseColumns: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: "todo", title: "A Fazer", color: "bg-slate-400" },
  { id: "in_progress", title: "Em Progresso", color: "bg-amber-500" },
  { id: "done", title: "Concluida", color: "bg-emerald-500" },
]

export type CreateTaskInput = Omit<TaskViewModel, "id">
export type UpdateTaskInput = Partial<Omit<TaskViewModel, "id">>

let taskStore: TaskApiModel[] = mockTaskApi.map((task) => ({ ...task }))

function viewModelToTaskApiModel(task: TaskViewModel): TaskApiModel {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    due_date: task.dueDate,
    assigned_user_id: task.assignedUserId,
    project_id: task.projectId,
  }
}

function createTaskApiModelFromInput(id: number, input: CreateTaskInput): TaskApiModel {
  return {
    id,
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    due_date: input.dueDate,
    assigned_user_id: input.assignedUserId,
    project_id: input.projectId,
  }
}

function getNextTaskId() {
  return taskStore.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1
}

export async function getTasks(): Promise<TaskViewModel[]> {
  return taskStore.map(taskApiModelToViewModel)
}

export async function createTask(input: CreateTaskInput): Promise<TaskViewModel> {
  const newTask = createTaskApiModelFromInput(getNextTaskId(), input)
  taskStore = [...taskStore, newTask]

  return taskApiModelToViewModel(newTask)
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<TaskViewModel | null> {
  const taskToUpdate = taskStore.find((task) => task.id === id)
  if (!taskToUpdate) {
    return null
  }

  const currentViewModel = taskApiModelToViewModel(taskToUpdate)
  const updatedTaskApiModel = viewModelToTaskApiModel({
    ...currentViewModel,
    ...input,
    id,
  })

  taskStore = taskStore.map((task) => (task.id === id ? updatedTaskApiModel : task))

  return taskApiModelToViewModel(updatedTaskApiModel)
}

export async function deleteTask(id: number): Promise<boolean> {
  const initialSize = taskStore.length
  taskStore = taskStore.filter((task) => task.id !== id)

  return taskStore.length < initialSize
}

export async function getTaskViewModels(): Promise<TaskViewModel[]> {
  return getTasks()
}

export async function getKanbanColumns(): Promise<KanbanColumnData[]> {
  const tasks = await getTasks()

  return baseColumns.map((column) => ({
    ...column,
    tasks: tasks.filter((task) => task.status === column.id),
  }))
}
