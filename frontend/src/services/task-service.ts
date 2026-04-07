import type {
  KanbanColumnData,
  ReorderTasksInput,
  TaskPriority,
  TaskStatus,
  TaskViewModel,
} from "@/lib/tasks/types"
import { buildKanbanColumns } from "@/lib/tasks/kanban-columns"
import { apiFetch, throwApiError, type ApiRequestContext } from "@/services/api-client"

export interface CreateTaskInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  projectId: number | null
}

export type UpdateTaskInput = Partial<CreateTaskInput>

const TASKS_ENDPOINT = "/tasks"

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

export async function getTasks(context: ApiRequestContext = {}): Promise<TaskViewModel[]> {
  const response = await apiFetch(buildTaskEndpoint(), {
    cache: "no-store",
    requestHeaders: context.requestHeaders,
  })
  if (!response.ok) {
    await throwApiError(response, "failed to fetch tasks")
  }

  return (await response.json()) as TaskViewModel[]
}

export async function createTask(input: CreateTaskInput): Promise<TaskViewModel> {
  const response = await apiFetch(buildTaskEndpoint(), {
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
  const response = await apiFetch(buildTaskEndpoint(id), {
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
  const response = await apiFetch(buildTaskEndpoint(id), { method: "DELETE" })
  if (response.status === 404) {
    return false
  }
  if (!response.ok) {
    await throwApiError(response, "failed to delete task")
  }

  return true
}

export async function reorderTasks(input: ReorderTasksInput): Promise<void> {
  const response = await apiFetch(`${TASKS_ENDPOINT}/reorder`, {
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
  return buildKanbanColumns(tasks)
}
