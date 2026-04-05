import { AppError } from "../../../shared/http/app-error"
import type {
  CreateTaskApiInput,
  CreateTaskDTO,
  TaskPriority,
  TaskStatus,
  UpdateTaskApiInput,
  UpdateTaskDTO,
} from "../types/task-types"

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

export function parseTaskId(value: unknown): number {
  if (typeof value !== "string") {
    throw new AppError(400, "id must be a number")
  }

  const id = Number(value)
  if (Number.isNaN(id)) {
    throw new AppError(400, "id must be a number")
  }

  return id
}

export function validateCreateTaskPayload(payload: unknown): CreateTaskDTO {
  const data = payload as Partial<CreateTaskApiInput>

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

  if (!hasValidDate(data.due_date)) {
    throw new AppError(400, "due_date must be a valid date string")
  }

  return {
    title: data.title.trim(),
    description: data.description.trim(),
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
  }
}

export function validateUpdateTaskPayload(payload: unknown): UpdateTaskDTO {
  const data = payload as UpdateTaskApiInput

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

  if (data.due_date !== undefined && !hasValidDate(data.due_date)) {
    throw new AppError(400, "due_date must be a valid date string")
  }

  return {
    title: data.title?.trim(),
    description: data.description?.trim(),
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
  }
}
