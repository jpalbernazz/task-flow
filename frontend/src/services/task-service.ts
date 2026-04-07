import type {
  KanbanColumnData,
  ReorderTasksInput,
  TaskPriority,
  TaskStatus,
  TaskViewModel,
} from "@/lib/tasks/types"

const baseColumns: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: "todo", title: "A Fazer", color: "bg-muted-foreground/70" },
  { id: "in_progress", title: "Em Progresso", color: "bg-primary" },
  { id: "done", title: "Concluida", color: "bg-success" },
]

export interface CreateTaskInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  projectId: number | null
}

export type UpdateTaskInput = Partial<CreateTaskInput>

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"
const TASKS_ENDPOINT = `${API_BASE_URL}/tasks`

interface TaskWritePayload {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  projectId: number | null
}

function toTaskWritePayload(input: CreateTaskInput): TaskWritePayload {
  return {
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate,
    projectId: input.projectId ?? null,
  }
}

function toTaskUpdatePayload(input: UpdateTaskInput): Partial<TaskWritePayload> {
  const payload: Partial<TaskWritePayload> = {}

  if (input.title !== undefined) {
    payload.title = input.title
  }
  if (input.description !== undefined) {
    payload.description = input.description
  }
  if (input.status !== undefined) {
    payload.status = input.status
  }
  if (input.priority !== undefined) {
    payload.priority = input.priority
  }
  if (input.dueDate !== undefined) {
    payload.dueDate = input.dueDate
  }
  if (input.projectId !== undefined) {
    payload.projectId = input.projectId
  }

  return payload
}

function buildTaskEndpoint(id?: number): string {
  if (id === undefined) {
    return TASKS_ENDPOINT
  }

  return `${TASKS_ENDPOINT}/${id}`
}

async function throwApiError(response: Response, fallbackMessage: string): Promise<never> {
  let message = fallbackMessage

  try {
    const data = (await response.json()) as { error?: string }
    if (typeof data.error === "string" && data.error.trim() !== "") {
      message = data.error
    }
  } catch {
    // Keep fallback message when response body is empty or invalid JSON.
  }

  throw new Error(message)
}

export async function getTasks(): Promise<TaskViewModel[]> {
  const response = await fetch(buildTaskEndpoint(), { cache: "no-store" })
  if (!response.ok) {
    await throwApiError(response, "failed to fetch tasks")
  }

  return (await response.json()) as TaskViewModel[]
}

export async function createTask(input: CreateTaskInput): Promise<TaskViewModel> {
  const response = await fetch(buildTaskEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toTaskWritePayload(input)),
  })
  if (!response.ok) {
    await throwApiError(response, "failed to create task")
  }

  return (await response.json()) as TaskViewModel
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<TaskViewModel | null> {
  const response = await fetch(buildTaskEndpoint(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toTaskUpdatePayload(input)),
  })

  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    await throwApiError(response, "failed to update task")
  }

  return (await response.json()) as TaskViewModel
}

export async function deleteTask(id: number): Promise<boolean> {
  const response = await fetch(buildTaskEndpoint(id), { method: "DELETE" })
  if (response.status === 404) {
    return false
  }
  if (!response.ok) {
    await throwApiError(response, "failed to delete task")
  }

  return true
}

export async function reorderTasks(input: ReorderTasksInput): Promise<void> {
  const response = await fetch(`${TASKS_ENDPOINT}/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    await throwApiError(response, "failed to reorder tasks")
  }
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
