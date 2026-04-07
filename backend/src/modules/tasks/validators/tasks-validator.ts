import { AppError } from "../../../shared/http/app-error"
import type {
  CreateTaskDTO,
  TaskPriority,
  TaskReorderDTO,
  TaskStatus,
  UpdateTaskDTO,
} from "../types/tasks-types"

const validStatus: TaskStatus[] = ["todo", "in_progress", "done"]
const validPriority: TaskPriority[] = ["low", "medium", "high"]

function hasValidStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && validStatus.includes(value as TaskStatus)
}

function hasValidPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && validPriority.includes(value as TaskPriority)
}

function hasValidDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
}

function hasValidProjectId(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

interface CreateTaskHttpInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  projectId?: number | null
}

interface UpdateTaskHttpInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  projectId?: number | null
}

interface ReorderTaskColumnHttpInput {
  status: TaskStatus
  taskIds: number[]
}

interface ReorderTaskHttpInput {
  columns: ReorderTaskColumnHttpInput[]
}

export function parseTaskId(value: unknown): number {
  if (typeof value !== "string") {
    throw new AppError(400, "id must be a positive integer")
  }

  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "id must be a positive integer")
  }

  return id
}

export function validateCreateTaskPayload(payload: unknown): CreateTaskDTO {
  const data = payload as Partial<CreateTaskHttpInput>
  const rawPayload = isRecord(payload) ? payload : {}

  if ("due_date" in rawPayload) {
    throw new AppError(400, "due_date is not supported, use dueDate")
  }
  if ("project_id" in rawPayload) {
    throw new AppError(400, "project_id is not supported, use projectId")
  }

  if (typeof data.title !== "string" || data.title.trim() === "") {
    throw new AppError(400, "title is required")
  }

  if (typeof data.description !== "string") {
    throw new AppError(400, "description is required")
  }

  if (!hasValidStatus(data.status)) {
    throw new AppError(400, "status must be todo, in_progress or done")
  }

  if (!hasValidPriority(data.priority)) {
    throw new AppError(400, "priority must be low, medium or high")
  }

  if (!hasValidDate(data.dueDate)) {
    throw new AppError(400, "dueDate must be a valid date string")
  }
  if (data.projectId !== undefined && data.projectId !== null && !hasValidProjectId(data.projectId)) {
    throw new AppError(400, "projectId must be a positive integer or null")
  }

  return {
    title: data.title.trim(),
    description: data.description.trim(),
    status: data.status,
    priority: data.priority,
    dueDate: data.dueDate,
    projectId: data.projectId ?? null,
  }
}

export function validateUpdateTaskPayload(payload: unknown): UpdateTaskDTO {
  const data = payload as UpdateTaskHttpInput
  const rawPayload = isRecord(payload) ? payload : {}

  if ("due_date" in rawPayload) {
    throw new AppError(400, "due_date is not supported, use dueDate")
  }
  if ("project_id" in rawPayload) {
    throw new AppError(400, "project_id is not supported, use projectId")
  }

  if (data.title !== undefined && (typeof data.title !== "string" || data.title.trim() === "")) {
    throw new AppError(400, "title must be a non-empty string")
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    throw new AppError(400, "description must be a string")
  }

  if (data.status !== undefined && !hasValidStatus(data.status)) {
    throw new AppError(400, "status must be todo, in_progress or done")
  }

  if (data.priority !== undefined && !hasValidPriority(data.priority)) {
    throw new AppError(400, "priority must be low, medium or high")
  }

  if (data.dueDate !== undefined && !hasValidDate(data.dueDate)) {
    throw new AppError(400, "dueDate must be a valid date string")
  }
  if (data.projectId !== undefined && data.projectId !== null && !hasValidProjectId(data.projectId)) {
    throw new AppError(400, "projectId must be a positive integer or null")
  }

  return {
    title: data.title?.trim(),
    description: data.description?.trim(),
    status: data.status,
    priority: data.priority,
    dueDate: data.dueDate,
    projectId: data.projectId,
  }
}

export function validateReorderTasksPayload(payload: unknown): TaskReorderDTO {
  const data = payload as Partial<ReorderTaskHttpInput>

  if (!Array.isArray(data.columns) || data.columns.length !== validStatus.length) {
    throw new AppError(400, "columns must include one entry for each status")
  }

  const seenStatuses = new Set<TaskStatus>()
  const seenTaskIds = new Set<number>()

  const columns = data.columns.map((column) => {
    if (!column || !hasValidStatus(column.status)) {
      throw new AppError(400, "each column status must be todo, in_progress or done")
    }

    if (seenStatuses.has(column.status)) {
      throw new AppError(400, "columns must not contain duplicate status")
    }
    seenStatuses.add(column.status)

    if (!Array.isArray(column.taskIds)) {
      throw new AppError(400, "taskIds must be an array of positive integers")
    }

    const taskIds = column.taskIds.map((taskId) => {
      if (!hasValidProjectId(taskId)) {
        throw new AppError(400, "taskIds must contain only positive integers")
      }

      if (seenTaskIds.has(taskId)) {
        throw new AppError(400, "taskIds must not contain duplicates")
      }
      seenTaskIds.add(taskId)

      return taskId
    })

    return {
      status: column.status,
      taskIds,
    }
  })

  for (const status of validStatus) {
    if (!seenStatuses.has(status)) {
      throw new AppError(400, "columns must include todo, in_progress and done")
    }
  }

  return { columns }
}
