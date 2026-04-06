import { AppError } from "../../../shared/http/app-error"
import type {
  CreateProjectDTO,
  ProjectStatus,
  UpdateProjectDTO,
} from "../types/projects-types"

const validStatus: ProjectStatus[] = ["planejado", "em-andamento", "concluido", "atrasado"]

function hasValidStatus(value: unknown): value is ProjectStatus {
  return typeof value === "string" && validStatus.includes(value as ProjectStatus)
}

function hasValidDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
}

function hasNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
}

function hasValidProgress(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

interface CreateProjectHttpInput {
  name: string
  description: string
  status: ProjectStatus
  deadline: string
  progress: number
  tasksCompleted: number
  totalTasks: number
}

interface UpdateProjectHttpInput {
  name?: string
  description?: string
  status?: ProjectStatus
  deadline?: string
  progress?: number
  tasksCompleted?: number
  totalTasks?: number
}

export function parseProjectId(value: unknown): number {
  if (typeof value !== "string") {
    throw new AppError(400, "id must be a positive integer")
  }

  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "id must be a positive integer")
  }

  return id
}

export function validateCreateProjectPayload(payload: unknown): CreateProjectDTO {
  const data = payload as Partial<CreateProjectHttpInput>
  const rawPayload = isRecord(payload) ? payload : {}

  if ("tasks_completed" in rawPayload) {
    throw new AppError(400, "tasks_completed is not supported, use tasksCompleted")
  }
  if ("total_tasks" in rawPayload) {
    throw new AppError(400, "total_tasks is not supported, use totalTasks")
  }

  if (typeof data.name !== "string" || data.name.trim() === "") {
    throw new AppError(400, "name is required")
  }

  if (typeof data.description !== "string") {
    throw new AppError(400, "description is required")
  }

  if (!hasValidStatus(data.status)) {
    throw new AppError(400, "status must be planejado, em-andamento, concluido or atrasado")
  }

  if (!hasValidDate(data.deadline)) {
    throw new AppError(400, "deadline must be a valid date string")
  }

  if (!hasValidProgress(data.progress)) {
    throw new AppError(400, "progress must be between 0 and 100")
  }

  if (!hasNonNegativeNumber(data.tasksCompleted)) {
    throw new AppError(400, "tasksCompleted must be a non-negative number")
  }

  if (!hasNonNegativeNumber(data.totalTasks)) {
    throw new AppError(400, "totalTasks must be a non-negative number")
  }

  return {
    name: data.name.trim(),
    description: data.description.trim(),
    status: data.status,
    deadline: data.deadline,
    progress: data.progress,
    tasksCompleted: data.tasksCompleted,
    totalTasks: data.totalTasks,
  }
}

export function validateUpdateProjectPayload(payload: unknown): UpdateProjectDTO {
  const data = payload as UpdateProjectHttpInput
  const rawPayload = isRecord(payload) ? payload : {}

  if ("tasks_completed" in rawPayload) {
    throw new AppError(400, "tasks_completed is not supported, use tasksCompleted")
  }
  if ("total_tasks" in rawPayload) {
    throw new AppError(400, "total_tasks is not supported, use totalTasks")
  }

  if (data.name !== undefined && (typeof data.name !== "string" || data.name.trim() === "")) {
    throw new AppError(400, "name must be a non-empty string")
  }

  if (data.description !== undefined && typeof data.description !== "string") {
    throw new AppError(400, "description must be a string")
  }

  if (data.status !== undefined && !hasValidStatus(data.status)) {
    throw new AppError(400, "status must be planejado, em-andamento, concluido or atrasado")
  }

  if (data.deadline !== undefined && !hasValidDate(data.deadline)) {
    throw new AppError(400, "deadline must be a valid date string")
  }

  if (data.progress !== undefined && !hasValidProgress(data.progress)) {
    throw new AppError(400, "progress must be between 0 and 100")
  }

  if (data.tasksCompleted !== undefined && !hasNonNegativeNumber(data.tasksCompleted)) {
    throw new AppError(400, "tasksCompleted must be a non-negative number")
  }

  if (data.totalTasks !== undefined && !hasNonNegativeNumber(data.totalTasks)) {
    throw new AppError(400, "totalTasks must be a non-negative number")
  }

  return {
    name: data.name?.trim(),
    description: data.description?.trim(),
    status: data.status,
    deadline: data.deadline,
    progress: data.progress,
    tasksCompleted: data.tasksCompleted,
    totalTasks: data.totalTasks,
  }
}
